// Minimal test version to debug the 500 error
console.log('=== EDGE FUNCTION MODULE LOADING ===');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('=== SETTING UP SERVE HANDLER ===');

// Use Deno.serve instead of the imported serve function
Deno.serve(async (req) => {
  try {
    console.log('=== EDGE FUNCTION REQUEST STARTED ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('=== HANDLING CORS OPTIONS ===');
      return new Response(null, { headers: corsHeaders });
    }

    // Test environment variables
    console.log('=== TESTING ENVIRONMENT VARIABLES ===');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET_KEY');
    const plaidEnv = Deno.env.get('PLAID_ENVIRONMENT');
    
    console.log('Environment variables status:', {
      supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
      supabaseKey: supabaseKey ? 'SET' : 'MISSING',
      plaidClientId: plaidClientId ? 'SET' : 'MISSING',
      plaidSecret: plaidSecret ? 'SET' : 'MISSING',
      plaidEnv: plaidEnv || 'NOT SET (will default to sandbox)'
    });

    // Test request body parsing
    console.log('=== TESTING REQUEST BODY PARSING ===');
    let body;
    try {
      body = await req.json();
      console.log('Request body parsed successfully:', Object.keys(body));
    } catch (error) {
      console.error('Failed to parse request body:', error.message);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid JSON in request body',
          details: error.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Test authorization header
    console.log('=== TESTING AUTHORIZATION ===');
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? 'PRESENT' : 'MISSING');

    // Return success for now to test basic functionality
    console.log('=== RETURNING TEST SUCCESS RESPONSE ===');
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Edge function is working - basic test passed',
        environment: {
          supabaseUrl: supabaseUrl ? 'configured' : 'missing',
          plaidClientId: plaidClientId ? 'configured' : 'missing',
          plaidSecret: plaidSecret ? 'configured' : 'missing',
          plaidEnv: plaidEnv || 'default-sandbox'
        },
        request: {
          method: req.method,
          hasAuth: !!authHeader,
          bodyKeys: body ? Object.keys(body) : []
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('=== CRITICAL ERROR IN EDGE FUNCTION ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Critical edge function error',
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});