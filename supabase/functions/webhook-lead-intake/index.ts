import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-zapier-webhook-id, x-make-webhook-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  source: string;
  campaign_source?: string;
  lead_score?: number;
  tags?: string[];
  custom_fields?: Record<string, any>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface WebhookPayload {
  lead: LeadData;
  source_type: 'zapier' | 'make' | 'webhook';
  routing_preferences?: {
    preferred_advisor_id?: string;
    priority?: 'low' | 'medium' | 'high';
    assignment_method?: 'round_robin' | 'location_based' | 'campaign_based' | 'manual';
  };
  webhook_metadata?: {
    zap_id?: string;
    make_scenario_id?: string;
    webhook_id?: string;
    triggered_at?: string;
  };
}

serve(async (req: Request) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing webhook payload...');
    
    // Parse the webhook payload
    let payload: WebhookPayload;
    try {
      const rawPayload = await req.json();
      console.log('Raw payload received:', JSON.stringify(rawPayload, null, 2));
      
      // Handle different webhook formats
      payload = normalizeWebhookPayload(rawPayload, req.headers);
    } catch (parseError) {
      console.error('Error parsing payload:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON payload', 
          details: parseError.message 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate required fields
    const validation = validateLeadData(payload.lead);
    if (!validation.valid) {
      console.error('Validation failed:', validation.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Check for duplicate leads
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, email, created_at')
      .eq('email', payload.lead.email)
      .single();

    if (existingLead) {
      console.log('Duplicate lead found:', existingLead.id);
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Lead with this email already exists',
          existing_lead_id: existingLead.id,
          created_at: existingLead.created_at
        }),
        { 
          status: 409, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Create the lead
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert([{
        first_name: payload.lead.first_name,
        last_name: payload.lead.last_name,
        email: payload.lead.email,
        phone: payload.lead.phone,
        company: payload.lead.company,
        location: payload.lead.location,
        source: payload.lead.source,
        campaign_source: payload.lead.campaign_source,
        lead_score: payload.lead.lead_score || 0,
        status: 'new',
        tags: payload.lead.tags || [],
        custom_fields: {
          ...payload.lead.custom_fields,
          utm_source: payload.lead.utm_source,
          utm_medium: payload.lead.utm_medium,
          utm_campaign: payload.lead.utm_campaign,
          utm_term: payload.lead.utm_term,
          utm_content: payload.lead.utm_content,
          webhook_metadata: payload.webhook_metadata
        }
      }])
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create lead', 
          details: leadError.message 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Lead created successfully:', newLead.id);

    // Apply automatic routing
    let assignmentResult = null;
    try {
      assignmentResult = await applyLeadRouting(supabase, newLead, payload.routing_preferences);
      console.log('Lead routing applied:', assignmentResult);
    } catch (routingError) {
      console.error('Error in lead routing:', routingError);
      // Continue even if routing fails - lead is still created
    }

    // Log the webhook activity
    try {
      await supabase
        .from('webhook_activity_log')
        .insert([{
          webhook_type: payload.source_type,
          lead_id: newLead.id,
          payload_data: payload,
          processing_status: 'success',
          assignment_result: assignmentResult
        }]);
    } catch (logError) {
      console.error('Error logging webhook activity:', logError);
      // Continue - logging failure shouldn't fail the main process
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead created and processed successfully',
        lead: {
          id: newLead.id,
          email: newLead.email,
          name: `${newLead.first_name} ${newLead.last_name}`,
          source: newLead.source,
          status: newLead.status
        },
        assignment: assignmentResult,
        created_at: newLead.created_at
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});

function normalizeWebhookPayload(rawPayload: any, headers: Headers): WebhookPayload {
  const zapierWebhookId = headers.get('x-zapier-webhook-id');
  const makeWebhookId = headers.get('x-make-webhook-id');
  
  // Detect source type
  let sourceType: 'zapier' | 'make' | 'webhook' = 'webhook';
  if (zapierWebhookId) sourceType = 'zapier';
  else if (makeWebhookId) sourceType = 'make';

  // Handle different payload structures
  let leadData: LeadData;
  
  if (rawPayload.lead) {
    // Direct format with lead object
    leadData = rawPayload.lead;
  } else if (rawPayload.first_name || rawPayload.email) {
    // Flat format - common from Zapier
    leadData = {
      first_name: rawPayload.first_name || rawPayload.firstName || rawPayload['First Name'] || '',
      last_name: rawPayload.last_name || rawPayload.lastName || rawPayload['Last Name'] || '',
      email: rawPayload.email || rawPayload.emailAddress || rawPayload['Email'] || '',
      phone: rawPayload.phone || rawPayload.phoneNumber || rawPayload['Phone'] || rawPayload.mobile,
      company: rawPayload.company || rawPayload.companyName || rawPayload['Company'],
      location: rawPayload.location || rawPayload.city || rawPayload.state || rawPayload.country,
      source: rawPayload.source || rawPayload.lead_source || determineSourceFromPayload(rawPayload),
      campaign_source: rawPayload.campaign_source || rawPayload.campaign || rawPayload.utm_campaign,
      lead_score: rawPayload.lead_score || rawPayload.score || 0,
      tags: rawPayload.tags || [],
      utm_source: rawPayload.utm_source,
      utm_medium: rawPayload.utm_medium,
      utm_campaign: rawPayload.utm_campaign,
      utm_term: rawPayload.utm_term,
      utm_content: rawPayload.utm_content,
      custom_fields: rawPayload.custom_fields || {}
    };
  } else {
    throw new Error('Invalid payload structure - missing required lead data');
  }

  // Ensure required fields have values
  if (!leadData.first_name && !leadData.last_name) {
    // Try to split full name if provided
    const fullName = rawPayload.name || rawPayload.fullName || rawPayload['Full Name'] || '';
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
      leadData.first_name = nameParts[0];
      leadData.last_name = nameParts.slice(1).join(' ');
    }
  }

  return {
    lead: leadData,
    source_type: sourceType,
    routing_preferences: rawPayload.routing_preferences || {},
    webhook_metadata: {
      zap_id: zapierWebhookId,
      make_scenario_id: makeWebhookId,
      webhook_id: rawPayload.webhook_id,
      triggered_at: new Date().toISOString()
    }
  };
}

function determineSourceFromPayload(payload: any): string {
  // Try to determine source from various fields
  if (payload.form_name) return `Web Form - ${payload.form_name}`;
  if (payload.page_url) return `Website - ${new URL(payload.page_url).hostname}`;
  if (payload.utm_source) return payload.utm_source;
  if (payload.referrer) return `Referral - ${payload.referrer}`;
  return 'Webhook Integration';
}

function validateLeadData(lead: LeadData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!lead.email || !isValidEmail(lead.email)) {
    errors.push('Valid email is required');
  }

  if (!lead.first_name && !lead.last_name) {
    errors.push('At least first name or last name is required');
  }

  if (!lead.source) {
    errors.push('Lead source is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function applyLeadRouting(supabase: any, lead: any, preferences: any = {}) {
  console.log('Applying lead routing for lead:', lead.id);

  // Get routing rules
  const { data: routingRules } = await supabase
    .from('lead_routing_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (!routingRules || routingRules.length === 0) {
    console.log('No active routing rules found');
    return null;
  }

  // Find matching rule
  let matchingRule = null;
  for (const rule of routingRules) {
    if (isRuleMatch(rule, lead)) {
      matchingRule = rule;
      break;
    }
  }

  if (!matchingRule) {
    console.log('No matching routing rule found');
    return null;
  }

  console.log('Found matching rule:', matchingRule.id);

  // Get available advisors for this rule
  const { data: advisors } = await supabase
    .from('advisor_profiles')
    .select('id, name, current_clients, client_capacity, location')
    .in('id', matchingRule.advisor_ids || [])
    .eq('is_active', true);

  if (!advisors || advisors.length === 0) {
    console.log('No available advisors for routing rule');
    return null;
  }

  // Select advisor based on rule criteria
  const selectedAdvisor = selectAdvisorByRule(advisors, matchingRule, lead);

  if (!selectedAdvisor) {
    console.log('No suitable advisor found');
    return null;
  }

  // Create lead assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('lead_assignments')
    .insert([{
      lead_id: lead.id,
      advisor_id: selectedAdvisor.id,
      assignment_method: matchingRule.assignment_method,
      assigned_by_rule: matchingRule.id,
      is_active: true,
      priority: preferences.priority || 'medium'
    }])
    .select()
    .single();

  if (assignmentError) {
    console.error('Error creating assignment:', assignmentError);
    return null;
  }

  // Create routing decision record
  await supabase
    .from('lead_routing_decisions')
    .insert([{
      lead_id: lead.id,
      rule_id: matchingRule.id,
      assigned_advisor_id: selectedAdvisor.id,
      decision_factors: {
        rule_criteria: matchingRule.rule_criteria,
        advisor_selection_reason: getAdvisorSelectionReason(selectedAdvisor, matchingRule),
        available_advisors: advisors.length
      }
    }]);

  console.log('Lead assigned to advisor:', selectedAdvisor.id);

  return {
    advisor_id: selectedAdvisor.id,
    advisor_name: selectedAdvisor.name,
    assignment_method: matchingRule.assignment_method,
    rule_applied: matchingRule.id
  };
}

function isRuleMatch(rule: any, lead: any): boolean {
  const criteria = rule.rule_criteria || {};
  
  // Check location criteria
  if (criteria.locations && criteria.locations.length > 0) {
    const leadLocation = lead.location?.toLowerCase() || '';
    const matchesLocation = criteria.locations.some((loc: string) => 
      leadLocation.includes(loc.toLowerCase())
    );
    if (!matchesLocation) return false;
  }

  // Check source criteria
  if (criteria.sources && criteria.sources.length > 0) {
    if (!criteria.sources.includes(lead.source)) return false;
  }

  // Check campaign criteria
  if (criteria.campaigns && criteria.campaigns.length > 0) {
    if (!lead.campaign_source || !criteria.campaigns.includes(lead.campaign_source)) return false;
  }

  // Check lead score criteria
  if (criteria.min_score && lead.lead_score < criteria.min_score) return false;
  if (criteria.max_score && lead.lead_score > criteria.max_score) return false;

  return true;
}

function selectAdvisorByRule(advisors: any[], rule: any, lead: any): any {
  const availableAdvisors = advisors.filter(advisor => 
    advisor.current_clients < advisor.client_capacity
  );

  if (availableAdvisors.length === 0) return null;

  switch (rule.assignment_method) {
    case 'round_robin':
      // Simple round robin - could be enhanced with persistent state
      return availableAdvisors[Math.floor(Math.random() * availableAdvisors.length)];
    
    case 'location_based':
      // Find advisor in same location
      const leadLocation = lead.location?.toLowerCase() || '';
      const localAdvisor = availableAdvisors.find(advisor => 
        advisor.location?.toLowerCase().includes(leadLocation) || 
        leadLocation.includes(advisor.location?.toLowerCase())
      );
      return localAdvisor || availableAdvisors[0];
    
    case 'capacity_based':
      // Assign to advisor with lowest current client count
      return availableAdvisors.sort((a, b) => a.current_clients - b.current_clients)[0];
    
    default:
      return availableAdvisors[0];
  }
}

function getAdvisorSelectionReason(advisor: any, rule: any): string {
  switch (rule.assignment_method) {
    case 'round_robin':
      return 'Selected via round-robin distribution';
    case 'location_based':
      return `Selected based on location match: ${advisor.location}`;
    case 'capacity_based':
      return `Selected based on capacity: ${advisor.current_clients}/${advisor.client_capacity} clients`;
    default:
      return 'Selected as available advisor';
  }
}