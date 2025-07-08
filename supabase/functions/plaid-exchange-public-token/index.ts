import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body safely
    let public_token;
    try {
      const body = await req.json();
      public_token = body.public_token;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body - must be valid JSON' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('=== Plaid Exchange Public Token Function Started ===');
    console.log('Request method:', req.method);
    console.log('Public token received:', public_token ? 'YES' : 'NO');
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('User-Agent:', req.headers.get('user-agent'));
    console.log('Timestamp:', new Date().toISOString());

    if (!public_token) {
      console.error('No public token provided');
      return new Response(
        JSON.stringify({ error: 'Public token is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          details: userError?.message || 'No user found' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Plaid credentials from environment
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID')
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY')
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox'

    console.log('Environment check:', {
      plaidClientId: PLAID_CLIENT_ID ? 'SET' : 'MISSING',
      plaidSecretKey: PLAID_SECRET_KEY ? 'SET' : 'MISSING',
      plaidEnvironment: PLAID_ENVIRONMENT
    });

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      console.error('Missing Plaid credentials')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error - Missing Plaid credentials',
          details: {
            clientId: PLAID_CLIENT_ID ? 'SET' : 'MISSING',
            secretKey: PLAID_SECRET_KEY ? 'SET' : 'MISSING'
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Determine Plaid API URL based on environment
    const plaidApiUrl = PLAID_ENVIRONMENT === 'production' 
      ? 'https://production.plaid.com'
      : PLAID_ENVIRONMENT === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com'

    console.log(`Exchanging public token for user ${user.id}`)

    // Exchange public token for access token
    const exchangeRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET_KEY,
      public_token: public_token,
    }

    console.log('Making token exchange request to Plaid API...');
    console.log('Exchange request details:', {
      client_id: PLAID_CLIENT_ID,
      secret: '[REDACTED]',
      public_token: public_token.substring(0, 20) + '...',
      url: `${plaidApiUrl}/link/token/exchange`
    });

    const exchangeResponse = await fetch(`${plaidApiUrl}/link/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchangeRequest),
    })

    console.log('Exchange response status:', exchangeResponse.status);
    const exchangeData = await exchangeResponse.json()
    console.log('Exchange response data:', exchangeData);

    if (!exchangeResponse.ok) {
      console.error('Plaid token exchange error:', exchangeData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to exchange public token',
          details: exchangeData,
          status: exchangeResponse.status
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get accounts data
    const accountsRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET_KEY,
      access_token: exchangeData.access_token,
    }

    console.log('Making accounts request to Plaid API...');
    const accountsResponse = await fetch(`${plaidApiUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountsRequest),
    })

    console.log('Accounts response status:', accountsResponse.status);
    const accountsData = await accountsResponse.json()
    console.log('Accounts response data:', {
      accounts_count: accountsData.accounts?.length || 0,
      accounts: accountsData.accounts?.map((acc: any) => ({
        id: acc.account_id,
        name: acc.name,
        type: acc.type,
        subtype: acc.subtype,
        balance: acc.balances?.current
      })) || []
    });

    if (!accountsResponse.ok) {
      console.error('Plaid accounts fetch error:', accountsData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch accounts',
          details: accountsData,
          status: accountsResponse.status
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Store accounts in database
    const accountsToInsert = accountsData.accounts.map((account: any) => ({
      user_id: user.id,
      name: account.name || account.official_name || 'Unknown Account',
      account_type: account.subtype || account.type,
      balance: account.balances.current || 0,
      plaid_account_id: account.account_id,
      plaid_item_id: exchangeData.item_id,
      plaid_institution_id: null, // Will be populated later if needed
      institution_name: null, // Will be populated later if needed
      is_plaid_linked: true,
      last_plaid_sync: new Date().toISOString(),
    }))

    console.log('Preparing to insert accounts:', {
      user_id: user.id,
      accounts_count: accountsToInsert.length,
      accounts_summary: accountsToInsert.map(acc => ({
        name: acc.name,
        type: acc.account_type,
        balance: acc.balance,
        plaid_account_id: acc.plaid_account_id
      }))
    });

    const { data: insertedAccounts, error: insertError } = await supabaseClient
      .from('bank_accounts')
      .insert(accountsToInsert)
      .select()

    console.log('Database insert result:', {
      success: !insertError,
      inserted_count: insertedAccounts?.length || 0,
      error: insertError,
      inserted_accounts: insertedAccounts?.map(acc => ({
        id: acc.id,
        name: acc.name,
        balance: acc.balance,
        user_id: acc.user_id
      }))
    });

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save accounts to database',
          details: insertError,
          plaid_data: {
            accounts_received: accountsData.accounts.length,
            item_id: exchangeData.item_id
          },
          debug_info: {
            user_id: user.id,
            attempted_inserts: accountsToInsert.length
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify accounts were saved correctly
    const { data: verificationAccounts, error: verificationError } = await supabaseClient
      .from('bank_accounts')
      .select('id, name, balance, user_id')
      .eq('user_id', user.id)
      .in('plaid_account_id', accountsToInsert.map(acc => acc.plaid_account_id))

    console.log('Account verification result:', {
      verification_success: !verificationError,
      verified_count: verificationAccounts?.length || 0,
      verification_error: verificationError
    });

    console.log(`Successfully linked ${accountsData.accounts.length} accounts for user ${user.id}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        accounts: insertedAccounts,
        summary: {
          total_accounts: insertedAccounts?.length || 0,
          item_id: exchangeData.item_id,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== Critical Error in plaid-exchange-public-token ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during account linking',
        details: error.message,
        type: error.constructor.name,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})