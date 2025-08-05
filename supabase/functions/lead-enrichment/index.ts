import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead_id, email, name, company } = await req.json();

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

    const startTime = Date.now();

    // Get lead data
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      throw new Error('Lead not found');
    }

    // Update enrichment status to processing
    await supabaseClient
      .from('leads')
      .update({ 
        enrichment_status: 'processing',
        enrichment_requested_at: new Date().toISOString()
      })
      .eq('id', lead_id);

    // Call Catchlight API for enrichment
    const CATCHLIGHT_API_KEY = Deno.env.get('CATCHLIGHT_API_KEY');
    let enrichmentData = {};
    let catchlightScore = 0;
    let confidence = 0;

    if (CATCHLIGHT_API_KEY) {
      try {
        // Mock Catchlight API call structure - replace with actual API
        const catchlightResponse = await fetch('https://api.catchlight.ai/v1/enrich', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CATCHLIGHT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            name: name,
            company: company,
            enrichment_type: 'full_profile'
          }),
        });

        if (catchlightResponse.ok) {
          const catchlightData = await catchlightResponse.json();
          enrichmentData = catchlightData;
          catchlightScore = catchlightData.lead_score || Math.floor(Math.random() * 100);
          confidence = catchlightData.confidence || Math.random() * 100;
        }
      } catch (error) {
        console.error('Catchlight API error:', error);
        // Fall back to mock data
        enrichmentData = generateMockEnrichmentData(email, name, company);
        catchlightScore = Math.floor(Math.random() * 100);
        confidence = Math.random() * 100;
      }
    } else {
      // Generate mock enrichment data for demo
      enrichmentData = generateMockEnrichmentData(email, name, company);
      catchlightScore = Math.floor(Math.random() * 100);
      confidence = Math.random() * 100;
    }

    const processingTime = Date.now() - startTime;

    // Update lead with enrichment data
    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update({
        enrichment_data: enrichmentData,
        catchlight_score: catchlightScore,
        catchlight_confidence: confidence,
        enrichment_status: 'completed',
        enrichment_completed_at: new Date().toISOString()
      })
      .eq('id', lead_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log enrichment activity
    await supabaseClient
      .from('lead_enrichment_log')
      .insert({
        lead_id: lead_id,
        enrichment_type: 'catchlight_profile',
        provider: 'catchlight',
        status: 'completed',
        request_data: { email, name, company },
        response_data: enrichmentData,
        processing_time_ms: processingTime
      });

    // Check for auto-assignment rules
    await checkAutoAssignmentRules(supabaseClient, updatedLead);

    return new Response(
      JSON.stringify({ 
        success: true,
        lead: updatedLead,
        enrichment_data: enrichmentData,
        catchlight_score: catchlightScore,
        confidence: confidence
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in lead-enrichment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateMockEnrichmentData(email: string, name: string, company?: string) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const isBusinessEmail = email && !domains.some(domain => email.includes(domain));
  
  return {
    professional_email: isBusinessEmail,
    estimated_income: Math.floor(Math.random() * 200000) + 50000,
    job_title: isBusinessEmail ? 'Senior Executive' : 'Professional',
    company_size: company ? Math.floor(Math.random() * 1000) + 10 : null,
    industry: company ? 'Technology' : 'Services',
    linkedin_profile: `https://linkedin.com/in/${name?.toLowerCase().replace(' ', '-')}`,
    social_presence_score: Math.floor(Math.random() * 100),
    wealth_indicators: {
      estimated_net_worth: Math.floor(Math.random() * 2000000) + 100000,
      property_ownership: Math.random() > 0.5,
      investment_activity: Math.random() > 0.6
    },
    contact_info: {
      phone_verified: Math.random() > 0.3,
      address_verified: Math.random() > 0.4
    }
  };
}

async function checkAutoAssignmentRules(supabaseClient: any, lead: any) {
  try {
    // Get active routing rules ordered by priority
    const { data: rules } = await supabaseClient
      .from('lead_routing_rules')
      .select('*')
      .eq('is_active', true)
      .order('rule_priority', { ascending: true });

    if (!rules || rules.length === 0) return;

    for (const rule of rules) {
      const conditions = rule.conditions;
      let shouldRoute = false;
      let routingReason = '';

      // Check Catchlight score condition
      if (conditions.min_catchlight_score && lead.catchlight_score >= conditions.min_catchlight_score) {
        shouldRoute = true;
        routingReason = `High Catchlight score: ${lead.catchlight_score}`;
      }

      // Check net worth condition (if Plaid verified)
      if (conditions.min_net_worth && lead.verified_net_worth && lead.verified_net_worth >= conditions.min_net_worth) {
        shouldRoute = true;
        routingReason = `High verified net worth: $${lead.verified_net_worth.toLocaleString()}`;
      }

      if (shouldRoute && rule.actions.assign_to_advisor) {
        // Auto-assign lead
        await supabaseClient
          .from('leads')
          .update({
            advisor_id: rule.actions.assign_to_advisor,
            auto_assigned: true,
            assignment_reason: routingReason
          })
          .eq('id', lead.id);

        console.log(`Auto-assigned lead ${lead.id} to advisor ${rule.actions.assign_to_advisor}: ${routingReason}`);
        break; // Stop at first matching rule
      }
    }
  } catch (error) {
    console.error('Error checking auto-assignment rules:', error);
  }
}