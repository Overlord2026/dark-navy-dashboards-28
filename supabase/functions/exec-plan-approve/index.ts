import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApprovalRequest {
  plan_id: string;
  approval_type: string;
  action: 'approve' | 'reject';
  notes?: string;
  step_id?: string;
  conditions?: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get user profile and validate role
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const body: ApprovalRequest = await req.json();

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('id', body.plan_id)
      .single();

    if (planError || !plan) {
      throw new Error('Plan not found');
    }

    // Validate user has authority to approve
    const executiveRoles = ['cmo', 'cfo', 'coo', 'clo', 'ceo'];
    const userRole = profile.role.toLowerCase();
    
    if (!executiveRoles.includes(userRole)) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient permissions for approval',
          code: 'PERMISSION_DENIED'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For CLO approvals, run policy evaluation
    let policyEvaluation = null;
    if (userRole === 'clo' && body.action === 'approve') {
      policyEvaluation = await evaluateCLOPolicy(supabase, plan, profile.tenant_id);
      
      if (policyEvaluation.decision === 'DENY') {
        return new Response(
          JSON.stringify({ 
            error: 'Policy evaluation failed - plan cannot be approved',
            code: 'POLICY_DENIED',
            policy_evaluation: policyEvaluation
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Calculate policy hash
    const policyHash = await calculatePolicyHash(plan, policyEvaluation);

    if (body.action === 'approve') {
      // Create approval record
      const { data: approval, error: approvalError } = await supabase
        .from('approvals')
        .insert({
          plan_id: body.plan_id,
          step_id: body.step_id,
          approver_id: user.id,
          approver_role: userRole,
          approval_type: body.approval_type,
          status: 'approved',
          artifact_hash: plan.artifact_hash,
          policy_hash: policyHash,
          policy_evaluation: policyEvaluation,
          approval_notes: body.notes,
          conditions: body.conditions || [],
          approved_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (approvalError) {
        console.error('Approval creation error:', approvalError);
        throw approvalError;
      }

      // Check if all required approvals are complete
      await checkAndUpdatePlanStatus(supabase, body.plan_id);

      const response = {
        approval_id: approval.id,
        status: 'approved',
        approver_role: userRole,
        approval_type: body.approval_type,
        policy_evaluation: policyEvaluation,
        artifact_hash: plan.artifact_hash,
        policy_hash: policyHash,
        timestamp: new Date().toISOString()
      };

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (body.action === 'reject') {
      // Create rejection record
      const { data: rejection, error: rejectionError } = await supabase
        .from('approvals')
        .insert({
          plan_id: body.plan_id,
          step_id: body.step_id,
          approver_id: user.id,
          approver_role: userRole,
          approval_type: body.approval_type,
          status: 'rejected',
          artifact_hash: plan.artifact_hash,
          policy_hash: policyHash,
          approval_notes: body.notes || 'Plan rejected',
          rejected_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (rejectionError) {
        console.error('Rejection creation error:', rejectionError);
        throw rejectionError;
      }

      // Update plan status to rejected
      await supabase
        .from('execution_plans')
        .update({ status: 'rejected' })
        .eq('id', body.plan_id);

      const response = {
        approval_id: rejection.id,
        status: 'rejected',
        approver_role: userRole,
        reason: body.notes || 'Plan rejected',
        timestamp: new Date().toISOString()
      };

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Error in exec-plan-approve:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function evaluateCLOPolicy(supabase: any, plan: any, tenantId: string) {
  // Get policy nodes and edges
  const [nodesResult, edgesResult] = await Promise.all([
    supabase
      .from('clo_policy_nodes')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true),
    supabase
      .from('clo_policy_edges')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
  ]);

  const nodes = nodesResult.data || [];
  const edges = edgesResult.data || [];

  // Simple policy evaluation logic
  let score = 1.0;
  const triggeredRules = [];
  const riskFactors = [];

  // Budget check
  if (plan.estimated_budget > 100000) {
    score -= 0.3;
    triggeredRules.push('high_budget');
    riskFactors.push('Budget exceeds $100k threshold');
  }

  // Timeline check
  if (plan.estimated_duration_days < 7) {
    score -= 0.2;
    triggeredRules.push('tight_timeline');
    riskFactors.push('Timeline less than 7 days');
  }

  // Determine decision
  let decision = 'ALLOW';
  if (score < 0.3) {
    decision = 'DENY';
  } else if (score < 0.6) {
    decision = 'REVIEW_REQUIRED';
  }

  return {
    decision,
    confidence_score: Math.max(0, score),
    triggered_rules: triggeredRules,
    risk_factors: riskFactors,
    recommendations: riskFactors.length > 0 ? ['Review risk factors', 'Consider plan modifications'] : [],
    evaluation_timestamp: new Date().toISOString()
  };
}

async function calculatePolicyHash(plan: any, policyEvaluation: any) {
  const policyData = JSON.stringify({
    plan_id: plan.id,
    artifact_hash: plan.artifact_hash,
    policy_evaluation: policyEvaluation,
    timestamp: new Date().toISOString()
  });

  const encoder = new TextEncoder();
  const data = encoder.encode(policyData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkAndUpdatePlanStatus(supabase: any, planId: string) {
  // Check if all required approvals are complete
  const { data: pendingApprovals } = await supabase
    .from('approvals')
    .select('*')
    .eq('plan_id', planId)
    .eq('status', 'pending');

  // If no pending approvals, mark plan as approved
  if (!pendingApprovals || pendingApprovals.length === 0) {
    await supabase
      .from('execution_plans')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', planId);
  }
}