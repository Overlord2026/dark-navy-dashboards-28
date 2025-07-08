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
    console.log('=== Plaid Create Link Token Function Started ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('User-Agent:', req.headers.get('user-agent'));
    console.log('Timestamp:', new Date().toISOString());

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

    console.log(`Creating link token for user ${user.id}`)

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
      products: ['auth', 'transactions'],
      redirect_uri: null,
    }

    console.log('Making link token request to Plaid API...');
    console.log('Link token request details:', {
      client_id: PLAID_CLIENT_ID,
      secret: '[REDACTED]',
      client_name: linkTokenRequest.client_name,
      products: linkTokenRequest.products,
      user_id: user.id,
      url: `${plaidApiUrl}/link/token/create`
    });

    const response = await fetch(`${plaidApiUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkTokenRequest),
    })

    console.log('Link token response status:', response.status);
    const data = await response.json()
    console.log('Link token response data:', data);

    if (!response.ok) {
      console.error('Plaid link token creation error:', data)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create link token',
          details: data,
          status: response.status
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully created link token for user ${user.id}`)

    return new Response(
      JSON.stringify({ 
        link_token: data.link_token,
        expiration: data.expiration,
        request_id: data.request_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== Critical Error in plaid-create-link-token ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during link token creation',
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