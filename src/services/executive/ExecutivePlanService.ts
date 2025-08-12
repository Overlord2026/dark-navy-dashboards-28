/**
 * AI Executive Suite - Executive Plan Service
 * Manages execution plans, steps, approvals, and workflow
 */

import { supabase } from '@/integrations/supabase/client';
import { AgentCapabilityService } from './AgentCapabilityService';

export interface ExecutionPlan {
  id: string;
  tenant_id: string;
  created_by: string;
  plan_title: string;
  plan_description?: string;
  executive_role: 'cmo' | 'cfo' | 'coo' | 'clo' | 'ceo';
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'rejected' | 'archived';
  priority: number;
  estimated_budget?: number;
  estimated_duration_days?: number;
  target_start_date?: string;
  target_end_date?: string;
  plan_content: any;
  artifact_hash?: string;
  policy_hash?: string;
  model_version?: string;
  version_number: number;
  parent_plan_id?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  activated_at?: string;
  completed_at?: string;
}

export interface PlanStep {
  id: string;
  plan_id: string;
  step_order: number;
  step_title: string;
  step_description?: string;
  responsible_role?: 'cmo' | 'cfo' | 'coo' | 'clo' | 'ceo';
  assigned_to?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';
  estimated_duration_hours?: number;
  estimated_cost?: number;
  dependencies: string[];
  deliverables: string[];
  approval_required: boolean;
  step_data: any;
  started_at?: string;
  completed_at?: string;
}

export interface Approval {
  id: string;
  plan_id: string;
  step_id?: string;
  approver_id: string;
  approver_role: 'cmo' | 'cfo' | 'coo' | 'clo' | 'ceo';
  approval_type: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  artifact_hash: string;
  policy_hash: string;
  policy_evaluation?: any;
  approval_notes?: string;
  conditions: any[];
  expires_at?: string;
  approved_at?: string;
  rejected_at?: string;
}

export class ExecutivePlanService {
  private capabilityService = new AgentCapabilityService();

  /**
   * Create a new execution plan draft
   */
  async createPlanDraft(planData: {
    title: string;
    description?: string;
    role: string;
    content: any;
    estimatedBudget?: number;
    estimatedDurationDays?: number;
    targetStartDate?: string;
    targetEndDate?: string;
    priority?: number;
  }, tenantId: string, createdBy: string): Promise<string> {
    // Validate agent capability
    const validation = await this.capabilityService.validateAgentAction(
      planData.role,
      'create_plan',
      planData.estimatedBudget || 0,
      tenantId
    );

    if (!validation.allowed) {
      throw new Error(`Plan creation not allowed: ${validation.reason}`);
    }

    // Calculate artifact hash
    const artifactHash = await this.calculateArtifactHash(planData.content);

    const { data, error } = await supabase
      .from('execution_plans')
      .insert({
        tenant_id: tenantId,
        created_by: createdBy,
        plan_title: planData.title,
        plan_description: planData.description,
        executive_role: planData.role as any,
        status: 'draft',
        priority: planData.priority || 3,
        estimated_budget: planData.estimatedBudget,
        estimated_duration_days: planData.estimatedDurationDays,
        target_start_date: planData.targetStartDate,
        target_end_date: planData.targetEndDate,
        plan_content: planData.content,
        artifact_hash: artifactHash,
        model_version: 'executive-ai-v1.0'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Add steps to execution plan
   */
  async addPlanSteps(planId: string, steps: Omit<PlanStep, 'id' | 'plan_id'>[]): Promise<void> {
    const stepsWithPlanId = steps.map(step => ({
      ...step,
      plan_id: planId
    }));

    const { error } = await supabase
      .from('plan_steps')
      .insert(stepsWithPlanId);

    if (error) throw error;
  }

  /**
   * Submit plan for approval
   */
  async submitPlanForApproval(planId: string, policyHash: string): Promise<void> {
    const { error } = await supabase
      .from('execution_plans')
      .update({
        status: 'pending_approval',
        policy_hash: policyHash
      })
      .eq('id', planId);

    if (error) throw error;

    // Create required approvals
    await this.createRequiredApprovals(planId);
  }

  /**
   * Approve plan or step
   */
  async approvePlan(
    planId: string,
    approverId: string,
    approverRole: string,
    approvalType: string,
    artifactHash: string,
    policyHash: string,
    notes?: string,
    stepId?: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from('approvals')
      .insert({
        plan_id: planId,
        step_id: stepId,
        approver_id: approverId,
        approver_role: approverRole as any,
        approval_type: approvalType,
        status: 'approved',
        artifact_hash: artifactHash,
        policy_hash: policyHash,
        approval_notes: notes,
        approved_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;

    // Check if all required approvals are complete
    await this.checkPlanApprovalStatus(planId);

    return data.id;
  }

  /**
   * Reject plan or step
   */
  async rejectPlan(
    planId: string,
    approverId: string,
    approverRole: string,
    reason: string,
    stepId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('approvals')
      .insert({
        plan_id: planId,
        step_id: stepId,
        approver_id: approverId,
        approver_role: approverRole as any,
        approval_type: 'rejection',
        status: 'rejected',
        artifact_hash: 'rejected',
        policy_hash: 'rejected',
        approval_notes: reason,
        rejected_at: new Date().toISOString()
      });

    if (error) throw error;

    // Update plan status
    await supabase
      .from('execution_plans')
      .update({ status: 'rejected' })
      .eq('id', planId);
  }

  /**
   * Activate approved plan
   */
  async activatePlan(planId: string): Promise<void> {
    // Validate plan can be activated
    const { data: canActivate } = await supabase
      .rpc('validate_plan_activation', { plan_id: planId });

    if (!canActivate) {
      throw new Error('Plan cannot be activated - missing required approvals or CLO approval');
    }

    const { error } = await supabase
      .from('execution_plans')
      .update({
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .eq('id', planId);

    if (error) throw error;
  }

  /**
   * Get execution plan with steps and approvals
   */
  async getPlanDetails(planId: string): Promise<{
    plan: ExecutionPlan;
    steps: PlanStep[];
    approvals: Approval[];
  }> {
    const [planResult, stepsResult, approvalsResult] = await Promise.all([
      supabase
        .from('execution_plans')
        .select('*')
        .eq('id', planId)
        .single(),
      supabase
        .from('plan_steps')
        .select('*')
        .eq('plan_id', planId)
        .order('step_order'),
      supabase
        .from('approvals')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at')
    ]);

    if (planResult.error) throw planResult.error;
    if (stepsResult.error) throw stepsResult.error;
    if (approvalsResult.error) throw approvalsResult.error;

    return {
      plan: planResult.data,
      steps: (stepsResult.data || []) as PlanStep[],
      approvals: (approvalsResult.data || []) as Approval[]
    };
  }

  /**
   * Get plans for a role
   */
  async getPlansForRole(role: string, tenantId: string): Promise<ExecutionPlan[]> {
    const { data, error } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('executive_role', role as any)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update step status
   */
  async updateStepStatus(
    stepId: string,
    status: PlanStep['status'],
    metadata?: any
  ): Promise<void> {
    const updates: any = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    if (metadata) {
      updates.step_data = metadata;
    }

    const { error } = await supabase
      .from('plan_steps')
      .update(updates)
      .eq('id', stepId);

    if (error) throw error;
  }

  /**
   * Calculate artifact hash
   */
  private async calculateArtifactHash(content: any): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(content));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Create required approvals for a plan
   */
  private async createRequiredApprovals(planId: string): Promise<void> {
    // Get plan details
    const { data: plan } = await supabase
      .from('execution_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (!plan) return;

    // CLO approval is always required
    await supabase.from('approvals').insert({
      plan_id: planId,
      approver_id: 'system', // Will be assigned to CLO role holder
      approver_role: 'clo',
      approval_type: 'legal_review',
      status: 'pending',
      artifact_hash: plan.artifact_hash || '',
      policy_hash: plan.policy_hash || '',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    });

    // Budget approval if over threshold
    if (plan.estimated_budget && plan.estimated_budget > 50000) {
      await supabase.from('approvals').insert({
        plan_id: planId,
        approver_id: 'system',
        approver_role: 'cfo',
        approval_type: 'budget_approval',
        status: 'pending',
        artifact_hash: plan.artifact_hash || '',
        policy_hash: plan.policy_hash || '',
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
      });
    }
  }

  /**
   * Check if plan has all required approvals
   */
  private async checkPlanApprovalStatus(planId: string): Promise<void> {
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
}