import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== PLAID INTEGRATION DIAGNOSTIC STARTED ===');
    
    // Step 1: Check all required environment variables
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY');
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT');

    console.log('Environment Variables Check:');
    console.log(`PLAID_CLIENT_ID: ${PLAID_CLIENT_ID ? 'SET ✓' : 'MISSING ✗'}`);
    console.log(`PLAID_SECRET_KEY: ${PLAID_SECRET_KEY ? 'SET ✓' : 'MISSING ✗'}`);
    console.log(`PLAID_ENVIRONMENT: ${PLAID_ENVIRONMENT || 'MISSING (defaulting to sandbox)'}`);

    const diagnosticReport = {
      step1_secrets_check: {
        PLAID_CLIENT_ID: {
          present: !!PLAID_CLIENT_ID,
          value: PLAID_CLIENT_ID ? `${PLAID_CLIENT_ID.substring(0, 10)}...` : null,
          status: PLAID_CLIENT_ID ? 'SET' : 'MISSING'
        },
        PLAID_SECRET_KEY: {
          present: !!PLAID_SECRET_KEY,
          value: PLAID_SECRET_KEY ? `${PLAID_SECRET_KEY.substring(0, 10)}...` : null,
          status: PLAID_SECRET_KEY ? 'SET' : 'MISSING'
        },
        PLAID_ENVIRONMENT: {
          present: !!PLAID_ENVIRONMENT,
          value: PLAID_ENVIRONMENT || 'sandbox (default)',
          status: PLAID_ENVIRONMENT ? 'SET' : 'MISSING - DEFAULTING TO SANDBOX'
        }
      },
      step2_api_test: null,
      step3_auth_product_check: null,
      step4_recommendations: []
    };

    // Step 2: Test API connection if credentials are present
    if (PLAID_CLIENT_ID && PLAID_SECRET_KEY) {
      console.log('=== TESTING PLAID API CONNECTION ===');
      
      const environment = PLAID_ENVIRONMENT || 'sandbox';
      const plaidApiUrl = environment === 'production' 
        ? 'https://production.plaid.com'
        : environment === 'development'
        ? 'https://development.plaid.com'
        : 'https://sandbox.plaid.com';

      console.log(`Using Plaid API URL: ${plaidApiUrl}`);

      // Test with link token creation
      const linkTokenRequest = {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_KEY,
        client_name: 'Advanced Wealth Management - Diagnostic Test',
        country_codes: ['US'],
        language: 'en',
        user: {
          client_user_id: 'diagnostic-test-user',
        },
        products: ['auth', 'transactions'],
        redirect_uri: null,
      };

      try {
        console.log('Making test request to Plaid API...');
        const response = await fetch(`${plaidApiUrl}/link/token/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(linkTokenRequest),
        });

        const responseData = await response.json();
        console.log(`Plaid API Response Status: ${response.status}`);
        console.log(`Plaid API Response:`, responseData);

        diagnosticReport.step2_api_test = {
          success: response.ok,
          status_code: response.status,
          response_data: responseData,
          api_url_used: plaidApiUrl,
          environment_used: environment
        };

        // Step 3: Analyze specific errors
        if (!response.ok) {
          console.log('=== ANALYZING API ERROR ===');
          
          if (responseData.error_code) {
            console.log(`Error Code: ${responseData.error_code}`);
            console.log(`Error Type: ${responseData.error_type}`);
            console.log(`Error Message: ${responseData.error_message}`);

            // Check for specific auth product issues
            if (responseData.error_message && responseData.error_message.includes('client is not authorized')) {
              diagnosticReport.step3_auth_product_check = {
                issue_detected: true,
                error_type: 'AUTH_PRODUCT_NOT_ENABLED',
                description: 'The "auth" product is not enabled/approved for this client_id in the current environment',
                environment: environment,
                client_id_prefix: PLAID_CLIENT_ID.substring(0, 10)
              };

              diagnosticReport.step4_recommendations.push({
                priority: 'HIGH',
                action: 'ENABLE_AUTH_PRODUCT',
                description: `Contact Plaid to enable the "auth" product for your ${environment} environment`,
                client_id_prefix: PLAID_CLIENT_ID.substring(0, 10),
                example_message: `Hi Plaid Support, I need to enable the "auth" product for my client_id ${PLAID_CLIENT_ID.substring(0, 10)}... in the ${environment} environment. Currently getting "client is not authorized to access the following products: ["auth"]" error. Please approve this product access for production use.`
              });
            } else if (responseData.error_message && responseData.error_message.includes('invalid')) {
              diagnosticReport.step3_auth_product_check = {
                issue_detected: true,
                error_type: 'INVALID_CREDENTIALS',
                description: 'Client ID or Secret Key appears to be invalid',
                recommendation: 'Verify credentials in Plaid Dashboard'
              };

              diagnosticReport.step4_recommendations.push({
                priority: 'CRITICAL',
                action: 'UPDATE_CREDENTIALS',
                description: 'Update PLAID_CLIENT_ID and PLAID_SECRET_KEY with valid values from Plaid Dashboard'
              });
            }
          }
        } else {
          diagnosticReport.step3_auth_product_check = {
            issue_detected: false,
            auth_product_status: 'ENABLED',
            description: 'Auth product is properly enabled for this client_id'
          };
        }

      } catch (fetchError: any) {
        console.error('Network error testing Plaid API:', fetchError);
        diagnosticReport.step2_api_test = {
          success: false,
          error: 'NETWORK_ERROR',
          message: fetchError.message,
          api_url_used: plaidApiUrl
        };
      }
    } else {
      console.log('Skipping API test - missing required credentials');
      diagnosticReport.step2_api_test = {
        success: false,
        error: 'MISSING_CREDENTIALS',
        message: 'Cannot test API without PLAID_CLIENT_ID and PLAID_SECRET_KEY'
      };

      if (!PLAID_CLIENT_ID) {
        diagnosticReport.step4_recommendations.push({
          priority: 'CRITICAL',
          action: 'ADD_CLIENT_ID',
          description: 'Add PLAID_CLIENT_ID to Supabase secrets'
        });
      }

      if (!PLAID_SECRET_KEY) {
        diagnosticReport.step4_recommendations.push({
          priority: 'CRITICAL',
          action: 'ADD_SECRET_KEY',
          description: 'Add PLAID_SECRET_KEY to Supabase secrets'
        });
      }
    }

    // Add environment recommendation if missing
    if (!PLAID_ENVIRONMENT) {
      diagnosticReport.step4_recommendations.push({
        priority: 'MEDIUM',
        action: 'SET_ENVIRONMENT',
        description: 'Add PLAID_ENVIRONMENT to Supabase secrets (recommended: "production")'
      });
    }

    console.log('=== DIAGNOSTIC COMPLETE ===');
    console.log('Full Report:', JSON.stringify(diagnosticReport, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        diagnostic_report: diagnosticReport,
        summary: {
          secrets_configured: Object.values(diagnosticReport.step1_secrets_check).filter(s => s.present).length,
          total_secrets_needed: 3,
          api_test_passed: diagnosticReport.step2_api_test?.success || false,
          blockers_found: diagnosticReport.step4_recommendations.filter(r => r.priority === 'CRITICAL').length,
          next_steps: diagnosticReport.step4_recommendations.length
        },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('=== DIAGNOSTIC ERROR ===', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'DIAGNOSTIC_FAILED',
        message: error.message,
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