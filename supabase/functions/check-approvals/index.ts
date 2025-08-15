import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface CheckApprovalsRequest {
  resource_type: string;
  action_type: string;
  resource_id: string;
  request_data?: Record<string, any>;
  requester_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: CheckApprovalsRequest = await req.json();
    
    // Find matching approval rule
    const { data: approvalRule, error: ruleError } = await supabase
      .from("approval_rules")
      .select("*")
      .eq("resource_type", body.resource_type)
      .eq("action_type", body.action_type)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (ruleError || !approvalRule) {
      console.log('No approval rule found for:', body.resource_type, body.action_type);
      return new Response(
        JSON.stringify({ 
          requires_approval: false, 
          reason: 'no_rule_found',
          can_proceed: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if conditions match (basic implementation)
    let conditionsMatch = true;
    if (approvalRule.conditions && Object.keys(approvalRule.conditions).length > 0) {
      // Simple condition matching - can be expanded for complex logic
      const conditions = approvalRule.conditions as Record<string, any>;
      const requestData = body.request_data || {};
      
      for (const [key, value] of Object.entries(conditions)) {
        if (requestData[key] !== value) {
          conditionsMatch = false;
          break;
        }
      }
    }

    if (!conditionsMatch) {
      return new Response(
        JSON.stringify({ 
          requires_approval: false, 
          reason: 'conditions_not_met',
          can_proceed: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing approval request
    const { data: existingRequest } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("resource_type", body.resource_type)
      .eq("resource_id", body.resource_id)
      .eq("action_type", body.action_type)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      return new Response(
        JSON.stringify({
          requires_approval: true,
          approval_request_id: existingRequest.id,
          status: existingRequest.status,
          current_approvals: existingRequest.current_approvals,
          required_approvals: existingRequest.required_approvals,
          can_proceed: false,
          reason: 'approval_pending'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new approval request
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (approvalRule.timeout_hours || 24));

    const { data: newRequest, error: requestError } = await supabase
      .from("approval_requests")
      .insert({
        request_title: `${body.action_type} approval for ${body.resource_type}`,
        resource_type: body.resource_type,
        resource_id: body.resource_id,
        action_type: body.action_type,
        requester_id: body.requester_id,
        approval_rule_id: approvalRule.id,
        request_data: body.request_data || {},
        required_approvals: approvalRule.required_approvers,
        approval_threshold: approvalRule.approval_threshold,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating approval request:', requestError);
      throw requestError;
    }

    // Emit domain event
    await supabase.functions.invoke('emit-receipt', {
      body: {
        event_type: 'approval_request_created',
        aggregate_id: newRequest.id,
        aggregate_type: 'approval_request',
        event_data: {
          request_id: newRequest.id,
          resource_type: body.resource_type,
          action_type: body.action_type,
          requester_id: body.requester_id,
          required_approvals: approvalRule.required_approvers
        }
      }
    });

    return new Response(
      JSON.stringify({
        requires_approval: true,
        approval_request_id: newRequest.id,
        status: 'pending',
        current_approvals: 0,
        required_approvals: approvalRule.required_approvers,
        approval_threshold: approvalRule.approval_threshold,
        expires_at: expiresAt.toISOString(),
        approver_roles: approvalRule.approver_roles,
        can_proceed: false,
        reason: 'approval_required'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('Check approvals error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});