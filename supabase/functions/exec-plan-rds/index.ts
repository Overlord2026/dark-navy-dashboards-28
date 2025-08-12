import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

    // Parse URL to get plan ID
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const planId = pathParts[pathParts.length - 2]; // Assumes /exec/plan/{id}/rds

    if (!planId) {
      throw new Error('Plan ID not provided');
    }

    // Verify user has access to this plan
    const { data: plan, error: planError } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('id', planId)
      .eq('tenant_id', profile.tenant_id)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ 
          error: 'Plan not found or access denied',
          code: 'PLAN_NOT_FOUND'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Plan RDS
    const { data: rds, error: rdsError } = await supabase
      .from('plan_rds')
      .select('*')
      .eq('plan_id', planId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rdsError) {
      console.error('RDS query error:', rdsError);
      throw rdsError;
    }

    if (!rds) {
      return new Response(
        JSON.stringify({ 
          error: 'Plan RDS not found - plan may not be activated yet',
          code: 'RDS_NOT_FOUND',
          suggestion: 'Activate the plan to generate RDS'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify RDS integrity
    const verification = await verifyRDSIntegrity(supabase, rds);

    // Get related data for complete RDS view
    const [approvalsResult, stepsResult] = await Promise.all([
      supabase
        .from('approvals')
        .select('*')
        .eq('plan_id', planId)
        .eq('status', 'approved')
        .order('created_at'),
      supabase
        .from('plan_steps')
        .select('*')
        .eq('plan_id', planId)
        .order('step_order')
    ]);

    const approvals = approvalsResult.data || [];
    const steps = stepsResult.data || [];

    const response = {
      rds_id: rds.id,
      plan_id: rds.plan_id,
      verification: verification,
      rds_data: {
        inputs_hash: rds.inputs_hash,
        model_version: rds.model_version,
        policy_selection_hash: rds.policy_selection_hash,
        approvals_hash: rds.approvals_hash,
        artifact_hash: rds.artifact_hash,
        sha256_hash: rds.sha256_hash,
        merkle_root: rds.merkle_root,
        anchor_txid: rds.anchor_txid,
        generated_at: rds.generated_at,
        anchored_at: rds.anchored_at
      },
      explanation: rds.explanation_json,
      related_data: {
        plan: {
          title: plan.plan_title,
          role: plan.executive_role,
          status: plan.status,
          created_at: plan.created_at,
          activated_at: plan.activated_at
        },
        approvals: approvals.map(approval => ({
          id: approval.id,
          approver_role: approval.approver_role,
          approval_type: approval.approval_type,
          approved_at: approval.approved_at,
          artifact_hash: approval.artifact_hash,
          policy_hash: approval.policy_hash
        })),
        steps: steps.map(step => ({
          id: step.id,
          order: step.step_order,
          title: step.step_title,
          responsible_role: step.responsible_role,
          status: step.status,
          approval_required: step.approval_required
        }))
      },
      audit_trail: {
        hash_verification: verification.is_valid,
        blockchain_anchored: !!rds.anchor_txid,
        anchor_transaction: rds.anchor_txid,
        verification_timestamp: new Date().toISOString(),
        verification_method: 'sha256_hash_chain'
      }
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in exec-plan-rds:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function verifyRDSIntegrity(supabase: any, rds: any) {
  const errors: string[] = [];
  const verificationDetails: any = {};

  try {
    // Verify plan still exists and matches
    const { data: plan } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('id', rds.plan_id)
      .single();

    if (!plan) {
      errors.push('Referenced plan no longer exists');
    } else {
      verificationDetails.plan_status = plan.status;
      
      // Verify artifact hash matches
      if (plan.artifact_hash !== rds.artifact_hash) {
        errors.push('Artifact hash mismatch');
      }
    }

    // Verify approvals hash
    const { data: currentApprovals } = await supabase
      .from('approvals')
      .select('*')
      .eq('plan_id', rds.plan_id)
      .eq('status', 'approved')
      .order('created_at');

    if (currentApprovals) {
      const currentApprovalsHash = await calculateApprovalsHash(currentApprovals);
      if (currentApprovalsHash !== rds.approvals_hash) {
        errors.push('Approvals hash mismatch - approvals may have changed');
      }
      verificationDetails.approvals_count = currentApprovals.length;
    }

    // Verify overall RDS hash
    const calculatedHash = await calculateRDSHash(rds);
    if (calculatedHash !== rds.sha256_hash) {
      errors.push('Overall RDS hash mismatch');
    }

    verificationDetails.hash_verification = calculatedHash === rds.sha256_hash;
    verificationDetails.timestamp_verification = new Date(rds.generated_at) <= new Date();

  } catch (error) {
    errors.push(`Verification error: ${error.message}`);
  }

  return {
    is_valid: errors.length === 0,
    verification_details: verificationDetails,
    errors,
    verified_at: new Date().toISOString()
  };
}

async function calculateApprovalsHash(approvals: any[]): Promise<string> {
  if (approvals.length === 0) return '';
  
  const approvalsData = approvals
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(a => `${a.artifact_hash}${a.policy_hash}${a.approver_role}${a.approved_at}`)
    .join('');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(approvalsData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function calculateRDSHash(rds: any): Promise<string> {
  const hashData = [
    rds.inputs_hash,
    rds.model_version,
    rds.policy_selection_hash,
    rds.approvals_hash,
    rds.artifact_hash,
    JSON.stringify(rds.explanation_json)
  ].join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(hashData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}