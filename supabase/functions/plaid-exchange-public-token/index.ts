import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== EDGE FUNCTION STARTED ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('=== CORS OPTIONS REQUEST ===');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Processing POST request ===');
    
    // Parse request body
    const body = await req.json();
    const public_token = body.public_token;
    
    console.log('Public token received:', public_token ? 'YES' : 'NO');

    if (!public_token) {
      console.log('=== NO PUBLIC TOKEN PROVIDED ===');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Public token is required' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('=== NO AUTH HEADER ===');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing Authorization header' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('=== CREATING SUPABASE CLIENT ===');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the user
    console.log('=== GETTING USER ===');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User authenticated:', user.id);

    // Get Plaid credentials
    console.log('=== GETTING PLAID CREDENTIALS ===');
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID')
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY')
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox'

    console.log('Environment check:', {
      plaidClientId: PLAID_CLIENT_ID ? 'SET' : 'MISSING',
      plaidSecretKey: PLAID_SECRET_KEY ? 'SET' : 'MISSING',
      plaidEnvironment: PLAID_ENVIRONMENT
    });

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      console.log('=== MISSING PLAID CREDENTIALS ===');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Server configuration error - Missing Plaid credentials'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Determine Plaid API URL
    const plaidApiUrl = PLAID_ENVIRONMENT === 'production' 
      ? 'https://production.plaid.com'
      : PLAID_ENVIRONMENT === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com'

    console.log(`Using Plaid API: ${plaidApiUrl}`);

    // Exchange public token for access token
    console.log('=== EXCHANGING TOKEN ===');
    const exchangeRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET_KEY,
      public_token: public_token,
    }

    const exchangeResponse = await fetch(`${plaidApiUrl}/link/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchangeRequest),
    })

    const exchangeData = await exchangeResponse.json()
    console.log('Exchange response status:', exchangeResponse.status);

    if (!exchangeResponse.ok) {
      console.error('Plaid token exchange failed:', exchangeData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to exchange public token',
          details: exchangeData
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Token exchange successful');

    // Get accounts
    console.log('=== GETTING ACCOUNTS ===');
    const accountsRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET_KEY,
      access_token: exchangeData.access_token,
    }

    const accountsResponse = await fetch(`${plaidApiUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountsRequest),
    })

    const accountsData = await accountsResponse.json()
    console.log('Accounts response status:', accountsResponse.status);
    console.log('Accounts found:', accountsData.accounts?.length || 0);

    if (!accountsResponse.ok) {
      console.error('Failed to fetch accounts:', accountsData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to fetch accounts',
          details: accountsData
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!accountsData.accounts || accountsData.accounts.length === 0) {
      console.log('=== NO ACCOUNTS FOUND ===');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No accounts found' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare accounts for database
    console.log('=== PREPARING ACCOUNTS FOR DATABASE ===');
    const accountsToInsert = accountsData.accounts.map((account: any) => ({
      user_id: user.id,
      name: account.name || account.official_name || 'Unknown Account',
      account_type: account.subtype || account.type || 'unknown',
      balance: account.balances?.current || account.balances?.available || 0,
      plaid_account_id: account.account_id,
      plaid_item_id: exchangeData.item_id,
      is_plaid_linked: true,
      last_plaid_sync: new Date().toISOString(),
    }))

    console.log('Inserting accounts to database...');
    
    // Insert accounts
    const { data: insertedAccounts, error: insertError } = await supabaseClient
      .from('bank_accounts')
      .insert(accountsToInsert)
      .select()

    if (insertError) {
      console.error('Database insert error:', insertError);
      
      // Handle duplicate accounts
      if (insertError.message?.includes('duplicate key')) {
        console.log('Accounts already exist - returning success');
        return new Response(
          JSON.stringify({ 
            success: true,
            accounts: [],
            message: 'Accounts already linked'
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to save accounts',
          details: insertError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully linked ${insertedAccounts?.length || 0} accounts`);

    return new Response(
      JSON.stringify({ 
        success: true,
        accounts: insertedAccounts,
        summary: {
          total_accounts: insertedAccounts?.length || 0,
          item_id: exchangeData.item_id
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})