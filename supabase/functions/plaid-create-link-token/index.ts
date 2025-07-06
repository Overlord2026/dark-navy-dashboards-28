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

  // Enhanced logging for debugging
  console.log('=== Plaid Create Link Token Function Started ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Check environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
  const plaidSecretKey = Deno.env.get('PLAID_SECRET_KEY');
  const plaidEnvironment = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox';
  
  console.log('Environment check:', {
    supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
    supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING',
    plaidClientId: plaidClientId ? 'SET' : 'MISSING', 
    plaidSecretKey: plaidSecretKey ? 'SET' : 'MISSING',
    plaidEnvironment
  });

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      supabaseUrl ?? '',
      supabaseAnonKey ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    console.log('Getting user from Supabase auth...');
    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser()

    console.log('Auth result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      error: authError 
    });

    if (!user) {
      console.error('No authenticated user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No user found' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Plaid credentials from environment
    const PLAID_CLIENT_ID = plaidClientId;
    const PLAID_SECRET_KEY = plaidSecretKey;
    const PLAID_ENVIRONMENT = plaidEnvironment;

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      console.error('Missing Plaid credentials:', {
        clientId: PLAID_CLIENT_ID ? 'SET' : 'MISSING',
        secretKey: PLAID_SECRET_KEY ? 'SET' : 'MISSING'
      });
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
    console.log('Making request to Plaid API:', {
      url: `${plaidApiUrl}/link/token/create`,
      requestBody: {
        ...linkTokenRequest,
        secret: '[REDACTED]' // Don't log the secret
      }
    });
    
    const response = await fetch(`${plaidApiUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkTokenRequest),
    })

    console.log('Plaid API response status:', response.status);
    console.log('Plaid API response headers:', Object.fromEntries(response.headers.entries()));
    
    const plaidResponse = await response.json()
    console.log('Plaid API response body:', plaidResponse);

    if (!response.ok) {
      console.error('Plaid API error - Status:', response.status);
      console.error('Plaid API error - Response:', plaidResponse);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create link token',
          details: plaidResponse,
          status: response.status
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
    console.error('=== Critical Error in plaid-create-link-token ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        type: error.constructor.name
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})