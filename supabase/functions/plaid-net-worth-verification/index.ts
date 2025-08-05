import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead_id, public_token } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get Plaid credentials
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY');
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox';

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      throw new Error('Plaid credentials not configured');
    }

    const plaidApiUrl = PLAID_ENVIRONMENT === 'production' 
      ? 'https://production.plaid.com'
      : PLAID_ENVIRONMENT === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com';

    // Exchange public token for access token
    const tokenResponse = await fetch(`${plaidApiUrl}/link/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_KEY,
        public_token: public_token,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Plaid token exchange failed: ${tokenData.error_message}`);
    }

    const accessToken = tokenData.access_token;

    // Get account balances
    const balanceResponse = await fetch(`${plaidApiUrl}/accounts/balance/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_KEY,
        access_token: accessToken,
      }),
    });

    const balanceData = await balanceResponse.json();
    
    if (!balanceResponse.ok) {
      throw new Error(`Plaid balance fetch failed: ${balanceData.error_message}`);
    }

    // Calculate net worth from all accounts
    let totalAssets = 0;
    let totalLiabilities = 0;
    const accountDetails = [];

    for (const account of balanceData.accounts) {
      const balance = account.balances.current || 0;
      
      if (['depository', 'investment'].includes(account.type)) {
        totalAssets += balance;
      } else if (['credit', 'loan'].includes(account.type)) {
        totalLiabilities += Math.abs(balance);
      }

      accountDetails.push({
        account_id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: balance,
        currency: account.balances.iso_currency_code
      });
    }

    const netWorth = totalAssets - totalLiabilities;

    // Prepare Plaid verification data
    const plaidData = {
      access_token: accessToken, // Store securely
      accounts: accountDetails,
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
      verification_date: new Date().toISOString(),
      plaid_environment: PLAID_ENVIRONMENT
    };

    // Update lead with verified net worth
    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update({
        verified_net_worth: netWorth,
        plaid_verified_data: plaidData,
        plaid_verification_status: 'verified'
      })
      .eq('id', lead_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log verification activity
    await supabaseClient
      .from('lead_enrichment_log')
      .insert({
        lead_id: lead_id,
        enrichment_type: 'plaid_net_worth',
        provider: 'plaid',
        status: 'completed',
        request_data: { public_token: 'redacted' },
        response_data: {
          net_worth: netWorth,
          account_count: accountDetails.length,
          verification_date: new Date().toISOString()
        }
      });

    // Check for auto-assignment based on net worth
    await checkNetWorthAutoAssignment(supabaseClient, updatedLead);

    return new Response(
      JSON.stringify({ 
        success: true,
        lead: updatedLead,
        net_worth: netWorth,
        account_summary: {
          total_accounts: accountDetails.length,
          total_assets: totalAssets,
          total_liabilities: totalLiabilities
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in plaid-net-worth-verification:', error);
    
    // Update lead status to failed
    if (req.body) {
      try {
        const { lead_id } = await req.json();
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: req.headers.get('Authorization')! },
            },
          }
        );
        
        await supabaseClient
          .from('leads')
          .update({ plaid_verification_status: 'failed' })
          .eq('id', lead_id);
      } catch (e) {
        console.error('Failed to update lead status:', e);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function checkNetWorthAutoAssignment(supabaseClient: any, lead: any) {
  try {
    // Get active routing rules for net worth
    const { data: rules } = await supabaseClient
      .from('lead_routing_rules')
      .select('*')
      .eq('is_active', true)
      .order('rule_priority', { ascending: true });

    if (!rules || rules.length === 0) return;

    for (const rule of rules) {
      const conditions = rule.conditions;
      
      if (conditions.min_net_worth && lead.verified_net_worth >= conditions.min_net_worth) {
        // Auto-assign lead based on verified net worth
        await supabaseClient
          .from('leads')
          .update({
            advisor_id: rule.actions.assign_to_advisor,
            auto_assigned: true,
            assignment_reason: `Verified high net worth: $${lead.verified_net_worth.toLocaleString()}`
          })
          .eq('id', lead.id);

        console.log(`Auto-assigned lead ${lead.id} based on net worth: $${lead.verified_net_worth.toLocaleString()}`);
        break;
      }
    }
  } catch (error) {
    console.error('Error checking net worth auto-assignment:', error);
  }
}