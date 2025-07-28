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
    const { lender_id, application, action } = await req.json();
    
    console.log(`Processing ${action} for lender: ${lender_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'submit_application':
        return await submitToLender(lender_id, application, supabase);
      case 'accept_offer':
        return await acceptLenderOffer(lender_id, application, supabase);
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in external-lender-integration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});

async function submitToLender(lenderId: string, application: any, supabase: any) {
  // Log the submission
  await supabase.from('lead_routing_decisions').insert({
    loan_request_id: application.id || 'mock-loan-id',
    recommended_partner_id: lenderId,
    score: 85,
    reasoning: { external_submission: true, lender: lenderId },
    decision_factors: application
  });

  // Mock successful submission
  const response = {
    lender_id: lenderId,
    lender_name: getLenderName(lenderId),
    status: 'approved',
    interest_rate: 6.25 + Math.random() * 2,
    loan_amount: application.loan_amount,
    term_months: 360,
    monthly_payment: calculateMonthlyPayment(application.loan_amount, 6.25, 360),
    conditions: ['Property appraisal required', 'Income verification needed'],
    response_time: Math.floor(12 + Math.random() * 48),
    approval_probability: 75 + Math.random() * 20
  };

  return new Response(
    JSON.stringify(response),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function acceptLenderOffer(lenderId: string, application: any, supabase: any) {
  // Log the acceptance
  await supabase.from('loan_status_updates').insert({
    loan_id: application.id || 'mock-loan-id',
    status: 'lender_accepted',
    message: `Offer accepted from ${getLenderName(lenderId)}`,
    created_by: application.user_id
  });

  return new Response(
    JSON.stringify({ success: true, lender_id: lenderId, status: 'accepted' }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

function getLenderName(lenderId: string): string {
  const names: Record<string, string> = {
    'rocket_mortgage': 'Rocket Mortgage',
    'wells_fargo': 'Wells Fargo',
    'quicken_loans': 'Quicken Loans'
  };
  return names[lenderId] || 'Unknown Lender';
}

function calculateMonthlyPayment(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}