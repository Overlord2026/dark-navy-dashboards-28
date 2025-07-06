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
    // Parse request body
    const { public_token } = await req.json()

    if (!public_token) {
      return new Response(
        JSON.stringify({ error: 'Public token is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      console.error('Missing Plaid credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
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

    const exchangeResponse = await fetch(`${plaidApiUrl}/link/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchangeRequest),
    })

    const exchangeData = await exchangeResponse.json()

    if (!exchangeResponse.ok) {
      console.error('Plaid token exchange error:', exchangeData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to exchange public token',
          details: exchangeData 
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

    const accountsResponse = await fetch(`${plaidApiUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountsRequest),
    })

    const accountsData = await accountsResponse.json()

    if (!accountsResponse.ok) {
      console.error('Plaid accounts fetch error:', accountsData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch accounts',
          details: accountsData 
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
      name: `${accountsData.institution.name} ${account.name}`,
      account_type: account.subtype || account.type,
      balance: account.balances.current || 0,
      plaid_account_id: account.account_id,
      plaid_item_id: exchangeData.item_id,
      plaid_institution_id: accountsData.institution.institution_id,
      institution_name: accountsData.institution.name,
      is_plaid_linked: true,
      last_plaid_sync: new Date().toISOString(),
    }))

    const { data: insertedAccounts, error: insertError } = await supabaseClient
      .from('bank_accounts')
      .insert(accountsToInsert)
      .select()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save accounts',
          details: insertError 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully linked ${accountsData.accounts.length} accounts for user ${user.id}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        accounts: insertedAccounts,
        institution: accountsData.institution
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in plaid-exchange-public-token:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})