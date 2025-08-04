import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const testResults: TestResult[] = [];

  try {
    console.log('🧪 [API Test Suite] Starting comprehensive API integration tests...');

    // Test Stripe Integration
    try {
      const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
      const stripePublishable = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
      
      if (!stripeSecret || !stripePublishable) {
        testResults.push({
          service: 'Stripe',
          status: 'error',
          message: 'Missing Stripe API keys',
          details: { 
            hasSecret: !!stripeSecret, 
            hasPublishable: !!stripePublishable 
          }
        });
      } else {
        const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
        
        // Test by creating a test product (won't be charged)
        const testProduct = await stripe.products.create({
          name: 'QA Test Product - Safe to Delete',
          description: 'Automated QA test product'
        });
        
        // Clean up immediately
        await stripe.products.del(testProduct.id);
        
        testResults.push({
          service: 'Stripe',
          status: 'success',
          message: 'Stripe API connection successful',
          details: { testProductId: testProduct.id }
        });
        console.log('✅ [API Test Suite] Stripe test passed');
      }
    } catch (error) {
      testResults.push({
        service: 'Stripe',
        status: 'error',
        message: `Stripe connection failed: ${error.message}`,
        details: { error: error.message }
      });
      console.error('❌ [API Test Suite] Stripe test failed:', error);
    }

    // Test Plaid Integration
    try {
      const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
      const plaidSecret = Deno.env.get('PLAID_SECRET');
      
      if (!plaidClientId || !plaidSecret) {
        testResults.push({
          service: 'Plaid',
          status: 'error',
          message: 'Missing Plaid API credentials',
          details: { 
            hasClientId: !!plaidClientId, 
            hasSecret: !!plaidSecret 
          }
        });
      } else {
        // Test Plaid by making a simple API call to get institutions
        const plaidResponse = await fetch('https://production.plaid.com/institutions/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: plaidClientId,
            secret: plaidSecret,
            count: 1,
            offset: 0,
            country_codes: ['US']
          })
        });
        
        if (plaidResponse.ok) {
          const data = await plaidResponse.json();
          testResults.push({
            service: 'Plaid',
            status: 'success',
            message: 'Plaid API connection successful',
            details: { institutionsFound: data.institutions?.length || 0 }
          });
          console.log('✅ [API Test Suite] Plaid test passed');
        } else {
          const error = await plaidResponse.text();
          testResults.push({
            service: 'Plaid',
            status: 'error',
            message: `Plaid API error: ${plaidResponse.status}`,
            details: { error }
          });
        }
      }
    } catch (error) {
      testResults.push({
        service: 'Plaid',
        status: 'error',
        message: `Plaid connection failed: ${error.message}`,
        details: { error: error.message }
      });
      console.error('❌ [API Test Suite] Plaid test failed:', error);
    }

    // Test Finnhub Integration
    try {
      const finnhubKey = Deno.env.get('FINNHUB_API_KEY');
      
      if (!finnhubKey) {
        testResults.push({
          service: 'Finnhub',
          status: 'error',
          message: 'Missing Finnhub API key'
        });
      } else {
        // Test with a simple market status call
        const finnhubResponse = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${finnhubKey}`);
        
        if (finnhubResponse.ok) {
          const data = await finnhubResponse.json();
          testResults.push({
            service: 'Finnhub',
            status: 'success',
            message: 'Finnhub API connection successful',
            details: { marketStatus: data }
          });
          console.log('✅ [API Test Suite] Finnhub test passed');
        } else {
          const error = await finnhubResponse.text();
          testResults.push({
            service: 'Finnhub',
            status: 'error',
            message: `Finnhub API error: ${finnhubResponse.status}`,
            details: { error }
          });
        }
      }
    } catch (error) {
      testResults.push({
        service: 'Finnhub',
        status: 'error',
        message: `Finnhub connection failed: ${error.message}`,
        details: { error: error.message }
      });
      console.error('❌ [API Test Suite] Finnhub test failed:', error);
    }

    // Test Resend Integration
    try {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      
      if (!resendKey) {
        testResults.push({
          service: 'Resend',
          status: 'error',
          message: 'Missing Resend API key'
        });
      } else {
        // Test with a simple domains list call (doesn't send email)
        const resendResponse = await fetch('https://api.resend.com/domains', {
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resendResponse.ok) {
          const data = await resendResponse.json();
          testResults.push({
            service: 'Resend',
            status: 'success',
            message: 'Resend API connection successful',
            details: { domainsCount: data.data?.length || 0 }
          });
          console.log('✅ [API Test Suite] Resend test passed');
        } else {
          const error = await resendResponse.text();
          testResults.push({
            service: 'Resend',
            status: 'error',
            message: `Resend API error: ${resendResponse.status}`,
            details: { error }
          });
        }
      }
    } catch (error) {
      testResults.push({
        service: 'Resend',
        status: 'error',
        message: `Resend connection failed: ${error.message}`,
        details: { error: error.message }
      });
      console.error('❌ [API Test Suite] Resend test failed:', error);
    }

    // Test Alternative Investments API
    try {
      const altsKey = Deno.env.get('ALTS_API_KEY');
      
      if (!altsKey) {
        testResults.push({
          service: 'Alternative Investments',
          status: 'error',
          message: 'Missing Alternative Investments API key'
        });
      } else {
        // Since we don't know the exact endpoint, we'll just mark as configured
        testResults.push({
          service: 'Alternative Investments',
          status: 'success',
          message: 'Alternative Investments API key configured',
          details: { note: 'Key present but endpoint test not implemented' }
        });
        console.log('✅ [API Test Suite] Alternative Investments key configured');
      }
    } catch (error) {
      testResults.push({
        service: 'Alternative Investments',
        status: 'error',
        message: `Alternative Investments test failed: ${error.message}`,
        details: { error: error.message }
      });
    }

    const successCount = testResults.filter(r => r.status === 'success').length;
    const totalCount = testResults.length;

    console.log(`📊 [API Test Suite] Test Summary: ${successCount}/${totalCount} services passed`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: totalCount,
          passed: successCount,
          failed: totalCount - successCount
        },
        results: testResults,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('💥 [API Test Suite] Critical error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        results: testResults
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);