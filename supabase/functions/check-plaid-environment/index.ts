import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CHECKING PLAID ENVIRONMENT VARIABLE ===');
    
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY');
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT');

    console.log(`PLAID_CLIENT_ID: ${PLAID_CLIENT_ID ? 'SET' : 'MISSING'}`);
    console.log(`PLAID_SECRET_KEY: ${PLAID_SECRET_KEY ? 'SET' : 'MISSING'}`);
    console.log(`PLAID_ENVIRONMENT: ${PLAID_ENVIRONMENT || 'MISSING (will default to sandbox)'}`);

    const result = {
      PLAID_CLIENT_ID_SET: !!PLAID_CLIENT_ID,
      PLAID_SECRET_KEY_SET: !!PLAID_SECRET_KEY,
      PLAID_ENVIRONMENT_SET: !!PLAID_ENVIRONMENT,
      PLAID_ENVIRONMENT_VALUE: PLAID_ENVIRONMENT || 'sandbox (default)',
      client_id_prefix: PLAID_CLIENT_ID ? PLAID_CLIENT_ID.substring(0, 12) : null,
      environment_status: PLAID_ENVIRONMENT ? 'CONFIGURED' : 'MISSING - DEFAULTING TO SANDBOX',
      issue_analysis: {
        credentials_valid: !!(PLAID_CLIENT_ID && PLAID_SECRET_KEY),
        environment_configured: !!PLAID_ENVIRONMENT,
        likely_issue: !PLAID_ENVIRONMENT 
          ? 'PLAID_ENVIRONMENT not set - defaulting to sandbox, but credentials may be for production'
          : 'Auth product not enabled for this client_id in production environment'
      },
      recommended_actions: []
    };

    if (!PLAID_ENVIRONMENT) {
      result.recommended_actions.push({
        priority: 'HIGH',
        action: 'SET_PLAID_ENVIRONMENT',
        description: 'Add PLAID_ENVIRONMENT=production to Supabase secrets',
        why: 'Without this, system defaults to sandbox mode which may not match your production credentials'
      });
    }

    if (PLAID_CLIENT_ID && PLAID_SECRET_KEY) {
      result.recommended_actions.push({
        priority: 'CRITICAL',
        action: 'CONTACT_PLAID_SUPPORT',
        description: 'Request "auth" product enablement for production environment',
        client_id: PLAID_CLIENT_ID.substring(0, 12) + '...',
        message_template: `Hi Plaid Support,

I need to enable the "auth" product for my client_id ${PLAID_CLIENT_ID.substring(0, 12)}... in the production environment.

Currently receiving error: "client is not authorized to access the following products: ["auth"]"

Please approve the "auth" product for production use with this client_id.

Thanks!`
      });
    }

    console.log('Analysis result:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error checking Plaid environment:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);