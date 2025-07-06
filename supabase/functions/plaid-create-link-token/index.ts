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

    console.log(`Creating link token for user ${user.id} in ${PLAID_ENVIRONMENT} environment`)

    // Create link token request
    const linkTokenRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET_KEY,
      client_name: 'Advanced Wealth Management',
      country_codes: ['US'],
      language: 'en',
      user: {
        client_user_id: user.id,
      },
      products: ['transactions', 'accounts'],
      account_filters: {
        depository: {
          account_subtypes: ['checking', 'savings', 'money_market', 'cd']
        }
      }
    }

    // Call Plaid API to create link token
    const response = await fetch(`${plaidApiUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkTokenRequest),
    })

    const plaidResponse = await response.json()

    if (!response.ok) {
      console.error('Plaid API error:', plaidResponse)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create link token',
          details: plaidResponse 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Link token created successfully')

    return new Response(
      JSON.stringify({ 
        link_token: plaidResponse.link_token,
        expiration: plaidResponse.expiration 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in plaid-create-link-token:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})