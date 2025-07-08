import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  try {
    console.log('=== PLAID EXCHANGE FUNCTION STARTED ===');
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET_KEY');
    const plaidEnv = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox';

    console.log('Environment check:', {
      supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
      supabaseKey: supabaseKey ? 'SET' : 'MISSING',
      plaidClientId: plaidClientId ? 'SET' : 'MISSING',
      plaidSecret: plaidSecret ? 'SET' : 'MISSING',
      plaidEnv
    });

    // Validate required environment variables
    if (!supabaseUrl || !supabaseKey || !plaidClientId || !plaidSecret) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Server configuration error - missing required environment variables'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const body = await req.json();
    console.log('Request body keys:', Object.keys(body));

    const { public_token } = body;
    if (!public_token) {
      console.error('No public_token provided');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'public_token is required'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Authorization required'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Authentication failed'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('User authenticated:', user.id);

    // Exchange public token for access token with Plaid
    const plaidUrl = plaidEnv === 'sandbox' 
      ? 'https://sandbox.plaid.com'
      : plaidEnv === 'development'
      ? 'https://development.plaid.com'
      : 'https://production.plaid.com';

    console.log('Calling Plaid token exchange:', plaidUrl);

    const plaidResponse = await fetch(`${plaidUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret,
      },
      body: JSON.stringify({
        public_token: public_token,
      }),
    });

    const plaidData = await plaidResponse.json();
    console.log('Plaid response status:', plaidResponse.status);
    console.log('Plaid response data keys:', Object.keys(plaidData));

    if (!plaidResponse.ok) {
      console.error('Plaid exchange failed:', plaidData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to exchange token with Plaid',
          details: plaidData
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { access_token, item_id } = plaidData;

    // Get account info from Plaid
    console.log('Getting account info from Plaid');
    const accountsResponse = await fetch(`${plaidUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret,
      },
      body: JSON.stringify({
        access_token: access_token,
      }),
    });

    const accountsData = await accountsResponse.json();
    console.log('Accounts response status:', accountsResponse.status);
    console.log('Accounts found:', accountsData.accounts?.length || 0);

    if (!accountsResponse.ok) {
      console.error('Failed to get accounts:', accountsData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to get account information',
          details: accountsData
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Save accounts to database
    const accountsToInsert = accountsData.accounts.map((account: any) => ({
      user_id: user.id,
      name: account.name,
      account_type: account.subtype || account.type,
      balance: account.balances.current || 0,
      is_plaid_linked: true,
      plaid_account_id: account.account_id,
      plaid_item_id: item_id,
      plaid_institution_id: accountsData.item?.institution_id,
      institution_name: accountsData.item?.institution_name || account.name,
      last_plaid_sync: new Date().toISOString(),
    }));

    console.log('Inserting accounts into database:', accountsToInsert.length);

    const { data: insertedAccounts, error: insertError } = await supabase
      .from('bank_accounts')
      .insert(accountsToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to save accounts to database',
          details: insertError
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Successfully inserted accounts:', insertedAccounts?.length || 0);

    return new Response(
      JSON.stringify({ 
        success: true,
        accounts: insertedAccounts,
        message: `Successfully linked ${insertedAccounts?.length || 0} accounts`
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('=== CRITICAL ERROR IN PLAID EXCHANGE ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: {
          name: error.name,
          message: error.message
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});