import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, ssn_last_4, dob, address } = await req.json();
    
    console.log(`Credit score check initiated for user: ${user_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate required fields
    if (!user_id || !ssn_last_4 || !dob) {
      throw new Error('Missing required fields: user_id, ssn_last_4, dob');
    }

    // Mock Experian API integration (replace with real API)
    const experianApiKey = Deno.env.get('EXPERIAN_API_KEY');
    
    let creditData;
    if (experianApiKey) {
      // Real Experian API call would go here
      console.log('Using real Experian API');
      creditData = await callExperianAPI(experianApiKey, { ssn_last_4, dob, address });
    } else {
      // Mock credit score data
      console.log('Using mock credit score data');
      creditData = {
        credit_score: 720 + Math.floor(Math.random() * 80), // 720-800
        score_range: 'Good to Excellent',
        factors: [
          'Payment history: Excellent',
          'Credit utilization: Good',
          'Length of credit history: Fair'
        ],
        eligibility: {
          conventional_loan: true,
          fha_loan: true,
          va_loan: true,
          jumbo_loan: true
        },
        estimated_rates: {
          conventional: 6.5 + Math.random() * 1.5,
          fha: 6.0 + Math.random() * 1.5,
          va: 5.8 + Math.random() * 1.5
        }
      };
    }

    // Log the credit check
    const { error: logError } = await supabase
      .from('kyc_verifications')
      .insert({
        user_id,
        verification_type: 'credit_check',
        status: 'completed',
        verification_data: {
          credit_score: creditData.credit_score,
          score_range: creditData.score_range,
          check_timestamp: new Date().toISOString()
        }
      });

    if (logError) {
      console.error('Error logging credit check:', logError);
    }

    // Create compliance audit trail
    const { error: auditError } = await supabase
      .from('compliance_audit_trail')
      .insert({
        entity_type: 'user',
        entity_id: user_id,
        action_type: 'credit_score_check',
        performed_by: user_id,
        details: {
          credit_score: creditData.credit_score,
          eligibility_results: creditData.eligibility,
          timestamp: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('Error creating audit trail:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        credit_data: creditData,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Error in credit-score-check:', error);
    
    // Log error for monitoring
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase
      .from('compliance_audit_trail')
      .insert({
        entity_type: 'system',
        entity_id: 'credit-score-check',
        action_type: 'error',
        performed_by: 'system',
        details: {
          error_message: error.message,
          timestamp: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});

async function callExperianAPI(apiKey: string, data: any) {
  // Real Experian API integration would go here
  // This is a placeholder for the actual implementation
  console.log('Calling Experian API with data:', data);
  
  // Mock response structure based on Experian API
  return {
    credit_score: 750,
    score_range: 'Excellent',
    factors: [
      'Payment history: Excellent',
      'Credit utilization: Good',
      'Length of credit history: Very Good'
    ],
    eligibility: {
      conventional_loan: true,
      fha_loan: true,
      va_loan: true,
      jumbo_loan: true
    },
    estimated_rates: {
      conventional: 6.25,
      fha: 5.75,
      va: 5.50
    }
  };
}