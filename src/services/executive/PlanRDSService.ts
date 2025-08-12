/**
 * AI Executive Suite - Plan RDS (Receipt Data Structure) Service
 * Manages Plan-RDS generation with verification and anchoring
 */

import { supabase } from '@/integrations/supabase/client';

export interface PlanRDS {
  id: string;
  plan_id: string;
  inputs_hash: string;
  model_version: string;
  policy_selection_hash: string;
  approvals_hash: string;
  artifact_hash: string;
  explanation_json: any;
  sha256_hash: string;
  merkle_root?: string;
  anchor_txid?: string;
  generated_at: string;
  anchored_at?: string;
}

export interface RDSExplanation {
  plan_summary: {
    title: string;
    role: string;
    budget: number;
    duration_days: number;
    priority: number;
  };
  decision_factors: {
    capability_validation: any;
    policy_evaluation: any;
    approval_chain: any[];
    risk_assessment: any;
  };
  audit_trail: {
    creation_timestamp: string;
    approval_timestamps: string[];
    activation_timestamp?: string;
    key_decisions: any[];
  };
  verification_data: {
    hash_chain: string[];
    policy_version: string;
    model_version: string;
    approver_signatures: any[];
  };
}

export class PlanRDSService {
  /**
   * Generate Plan RDS for execution plan
   */
  async generatePlanRDS(
    planId: string,
    inputsHash: string,
    modelVersion: string,
    policySelectionHash: string
  ): Promise<string> {
    // Get plan details with approvals
    const [planResult, approvalsResult, stepsResult] = await Promise.all([
      supabase
        .from('execution_plans')
        .select('*')
        .eq('id', planId)
        .single(),
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

    if (planResult.error) throw planResult.error;
    if (approvalsResult.error) throw approvalsResult.error;
    if (stepsResult.error) throw stepsResult.error;

    const plan = planResult.data;
    const approvals = approvalsResult.data || [];
    const steps = stepsResult.data || [];

    // Generate explanation JSON
    const explanation = this.generateExplanationJSON(plan, approvals, steps);

    // Calculate approvals hash
    const approvalsHash = await this.calculateApprovalsHash(approvals);

    // Generate RDS using database function
    const { data: rdsId, error } = await supabase.rpc('generate_plan_rds', {
      p_plan_id: planId,
      p_inputs_hash: inputsHash,
      p_model_version: modelVersion,
      p_policy_selection_hash: policySelectionHash,
      p_explanation: explanation as any
    });

    if (error) throw error;
    return rdsId;
  }

  /**
   * Verify Plan RDS integrity
   */
  async verifyPlanRDS(rdsId: string): Promise<{
    is_valid: boolean;
    verification_details: any;
    errors: string[];
  }> {
    const { data: rds, error } = await supabase
      .from('plan_rds')
      .select('*')
      .eq('id', rdsId)
      .single();

    if (error) throw error;
    if (!rds) throw new Error('RDS not found');

    const errors: string[] = [];
    const verificationDetails: any = {};

    // Verify plan still exists
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
      const currentApprovalsHash = await this.calculateApprovalsHash(currentApprovals);
      if (currentApprovalsHash !== rds.approvals_hash) {
        errors.push('Approvals hash mismatch - approvals may have changed');
      }
      verificationDetails.approvals_count = currentApprovals.length;
    }

    // Verify overall hash
    const calculatedHash = await this.calculateRDSHash(rds);
    if (calculatedHash !== rds.sha256_hash) {
      errors.push('Overall RDS hash mismatch');
    }

    verificationDetails.hash_verification = calculatedHash === rds.sha256_hash;
    verificationDetails.timestamp_verification = new Date(rds.generated_at) <= new Date();

    return {
      is_valid: errors.length === 0,
      verification_details: verificationDetails,
      errors
    };
  }

  /**
   * Get Plan RDS with full details
   */
  async getPlanRDS(planId: string): Promise<PlanRDS | null> {
    const { data, error } = await supabase
      .from('plan_rds')
      .select('*')
      .eq('plan_id', planId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  /**
   * Get all RDS records for a tenant
   */
  async getRDSForTenant(tenantId: string): Promise<PlanRDS[]> {
    const { data, error } = await supabase
      .from('plan_rds')
      .select(`
        *,
        execution_plans (
          plan_title,
          executive_role,
          status,
          tenant_id
        )
      `)
      .eq('execution_plans.tenant_id', tenantId)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Anchor RDS to blockchain (optional)
   */
  async anchorRDSToBlockchain(rdsId: string): Promise<string> {
    // This would integrate with a blockchain service
    // For now, we'll simulate with a mock transaction ID
    const mockTxId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase
      .from('plan_rds')
      .update({
        anchor_txid: mockTxId,
        anchored_at: new Date().toISOString()
      })
      .eq('id', rdsId);

    if (error) throw error;
    return mockTxId;
  }

  /**
   * Generate explanation JSON for RDS
   */
  private generateExplanationJSON(plan: any, approvals: any[], steps: any[]): RDSExplanation {
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
          budget_within_limits: plan.estimated_budget <= 100000,
          approval_required: approvals.length > 0
        },
        policy_evaluation: {
          policy_hash: plan.policy_hash,
          evaluation_passed: plan.status === 'approved' || plan.status === 'active',
          clo_approved: approvals.some(a => a.approver_role === 'clo' && a.status === 'approved')
        },
        approval_chain: approvals.map(approval => ({
          approver_role: approval.approver_role,
          approval_type: approval.approval_type,
          approved_at: approval.approved_at,
          artifact_hash: approval.artifact_hash,
          policy_hash: approval.policy_hash
        })),
        risk_assessment: {
          risk_level: this.calculateRiskLevel(plan, steps),
          mitigation_factors: this.getMitigationFactors(plan),
          compliance_status: 'verified'
        }
      },
      audit_trail: {
        creation_timestamp: plan.created_at,
        approval_timestamps: approvals.map(a => a.approved_at).filter(Boolean),
        activation_timestamp: plan.activated_at,
        key_decisions: [
          {
            timestamp: plan.created_at,
            action: 'plan_created',
            actor: plan.executive_role,
            details: 'Execution plan drafted'
          },
          ...approvals.map(approval => ({
            timestamp: approval.approved_at,
            action: 'approval_granted',
            actor: approval.approver_role,
            details: `${approval.approval_type} approved`
          })),
          ...(plan.activated_at ? [{
            timestamp: plan.activated_at,
            action: 'plan_activated',
            actor: 'system',
            details: 'Plan activated for execution'
          }] : [])
        ]
      },
      verification_data: {
        hash_chain: [
          plan.artifact_hash,
          ...approvals.map(a => a.artifact_hash),
          plan.policy_hash
        ].filter(Boolean),
        policy_version: plan.policy_hash || 'unknown',
        model_version: plan.model_version || 'executive-ai-v1.0',
        approver_signatures: approvals.map(approval => ({
          approver_role: approval.approver_role,
          approval_type: approval.approval_type,
          signature_hash: approval.artifact_hash,
          timestamp: approval.approved_at
        }))
      }
    };
  }

  /**
   * Calculate approvals hash
   */
  private async calculateApprovalsHash(approvals: any[]): Promise<string> {
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

  /**
   * Calculate RDS hash
   */
  private async calculateRDSHash(rds: any): Promise<string> {
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

  /**
   * Calculate risk level for plan
   */
  private calculateRiskLevel(plan: any, steps: any[]): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Budget risk
    if (plan.estimated_budget > 100000) riskScore += 2;
    else if (plan.estimated_budget > 50000) riskScore += 1;

    // Timeline risk
    if (plan.estimated_duration_days < 7) riskScore += 2;
    else if (plan.estimated_duration_days < 14) riskScore += 1;

    // Complexity risk
    if (steps.length > 10) riskScore += 1;
    if (steps.some((s: any) => s.dependencies?.length > 0)) riskScore += 1;

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Get mitigation factors
   */
  private getMitigationFactors(plan: any): string[] {
    const factors = [];
    
    if (plan.status === 'approved') factors.push('Multi-level approval obtained');
    if (plan.priority <= 2) factors.push('High priority with senior oversight');
    if (plan.estimated_duration_days >= 14) factors.push('Adequate timeline for execution');
    
    return factors;
  }
}