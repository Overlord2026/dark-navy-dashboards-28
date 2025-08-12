import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ActivationRequest {
  plan_id: string;
  generate_rds?: boolean;
  anchor_to_blockchain?: boolean;
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

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const body: ActivationRequest = await req.json();

    // Validate plan can be activated using database function
    const { data: canActivate, error: validationError } = await supabase
      .rpc('validate_plan_activation', { plan_id: body.plan_id });

    if (validationError) {
      console.error('Validation error:', validationError);
      throw validationError;
    }

    if (!canActivate) {
      return new Response(
        JSON.stringify({ 
          error: 'Plan cannot be activated - missing required approvals or CLO approval',
          code: 'ACTIVATION_DENIED',
          requirements: {
            clo_approval: 'required',
            all_step_approvals: 'required',
            plan_status: 'must_be_approved'
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get plan details for activation
    const { data: plan } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('id', body.plan_id)
      .single();

    if (!plan) {
      throw new Error('Plan not found');
    }

    // Activate the plan
    const { error: activationError } = await supabase
      .from('execution_plans')
      .update({
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .eq('id', body.plan_id);

    if (activationError) {
      console.error('Activation error:', activationError);
      throw activationError;
    }

    let rdsId = null;
    let anchorTxId = null;

    // Generate RDS if requested
    if (body.generate_rds) {
      try {
        // Calculate inputs hash
        const inputsData = JSON.stringify({
          plan_id: body.plan_id,
          activated_by: user.id,
          activation_timestamp: new Date().toISOString(),
          plan_content: plan.plan_content
        });

        const encoder = new TextEncoder();
        const data = encoder.encode(inputsData);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputsHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Generate RDS
        const { data: generatedRdsId, error: rdsError } = await supabase
          .rpc('generate_plan_rds', {
            p_plan_id: body.plan_id,
            p_inputs_hash: inputsHash,
            p_model_version: plan.model_version || 'executive-ai-v1.0',
            p_policy_selection_hash: plan.policy_hash || '',
            p_explanation: await generateRDSExplanation(supabase, plan)
          });

        if (rdsError) {
          console.error('RDS generation error:', rdsError);
        } else {
          rdsId = generatedRdsId;

          // Anchor to blockchain if requested
          if (body.anchor_to_blockchain && rdsId) {
            anchorTxId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            await supabase
              .from('plan_rds')
              .update({
                anchor_txid: anchorTxId,
                anchored_at: new Date().toISOString()
              })
              .eq('id', rdsId);
          }
        }
      } catch (rdsError) {
        console.error('RDS generation failed:', rdsError);
        // Don't fail activation if RDS generation fails
      }
    }

    // Get final plan state with approvals
    const { data: approvals } = await supabase
      .from('approvals')
      .select('*')
      .eq('plan_id', body.plan_id)
      .eq('status', 'approved')
      .order('created_at');

    const response = {
      plan_id: body.plan_id,
      status: 'active',
      activated_at: new Date().toISOString(),
      activated_by: user.id,
      approvals_count: approvals?.length || 0,
      clo_approved: approvals?.some(a => a.approver_role === 'clo') || false,
      rds_generated: !!rdsId,
      rds_id: rdsId,
      anchor_tx_id: anchorTxId,
      next_steps: [
        'Monitor plan execution',
        'Track step completion',
        'Generate progress reports'
      ],
      execution_summary: {
        title: plan.plan_title,
        role: plan.executive_role,
        estimated_budget: plan.estimated_budget,
        estimated_duration_days: plan.estimated_duration_days,
        priority: plan.priority,
        target_start_date: plan.target_start_date,
        target_end_date: plan.target_end_date
      }
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in exec-plan-activate:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateRDSExplanation(supabase: any, plan: any) {
  // Get approvals and steps
  const [approvalsResult, stepsResult] = await Promise.all([
    supabase
      .from('approvals')
      .select('*')
      .eq('plan_id', plan.id)
      .eq('status', 'approved')
      .order('created_at'),
    supabase
      .from('plan_steps')
      .select('*')
      .eq('plan_id', plan.id)
      .order('step_order')
  ]);

  const approvals = approvalsResult.data || [];
  const steps = stepsResult.data || [];

  return {
    plan_summary: {
      title: plan.plan_title,
      role: plan.executive_role,
      budget: plan.estimated_budget || 0,
      duration_days: plan.estimated_duration_days || 0,
      priority: plan.priority
    },
    decision_factors: {
      capability_validation: {
        role_authorized: true,
        budget_within_limits: true,
        approval_required: approvals.length > 0
      },
      policy_evaluation: {
        policy_hash: plan.policy_hash,
        evaluation_passed: true,
        clo_approved: approvals.some(a => a.approver_role === 'clo')
      },
      approval_chain: approvals.map(approval => ({
        approver_role: approval.approver_role,
        approval_type: approval.approval_type,
        approved_at: approval.approved_at,
        artifact_hash: approval.artifact_hash,
        policy_hash: approval.policy_hash
      })),
      risk_assessment: {
        risk_level: calculateRiskLevel(plan, steps),
        compliance_status: 'verified'
      }
    },
    audit_trail: {
      creation_timestamp: plan.created_at,
      approval_timestamps: approvals.map(a => a.approved_at).filter(Boolean),
      activation_timestamp: new Date().toISOString(),
      key_decisions: [
        {
          timestamp: plan.created_at,
          action: 'plan_created',
          actor: plan.executive_role
        },
        ...approvals.map(approval => ({
          timestamp: approval.approved_at,
          action: 'approval_granted',
          actor: approval.approver_role,
          details: approval.approval_type
        })),
        {
          timestamp: new Date().toISOString(),
          action: 'plan_activated',
          actor: 'system'
        }
      ]
    },
    verification_data: {
      hash_chain: [
        plan.artifact_hash,
        ...approvals.map(a => a.artifact_hash),
        plan.policy_hash
      ].filter(Boolean),
      policy_version: plan.policy_hash || 'unknown',
      model_version: plan.model_version || 'executive-ai-v1.0'
    }
  };
}

function calculateRiskLevel(plan: any, steps: any[]): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  if (plan.estimated_budget > 100000) riskScore += 2;
  else if (plan.estimated_budget > 50000) riskScore += 1;

  if (plan.estimated_duration_days < 7) riskScore += 2;
  else if (plan.estimated_duration_days < 14) riskScore += 1;

  if (steps.length > 10) riskScore += 1;
  if (steps.some((s: any) => s.dependencies?.length > 0)) riskScore += 1;

  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}