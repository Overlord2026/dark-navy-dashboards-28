/**
 * AI Executive Suite - Agent Capability Service
 * Manages capability tokens controlling functions per executive role
 */

import { supabase } from '@/integrations/supabase/client';

export interface AgentCapability {
  id: string;
  tenant_id: string;
  executive_role: 'cmo' | 'cfo' | 'coo' | 'clo' | 'ceo';
  capability_name: string;
  capability_config: {
    max_budget?: number;
    approval_threshold?: number;
    allowed_actions?: string[];
    restrictions?: string[];
    scope?: string;
  };
  is_enabled: boolean;
  max_budget_per_action?: number;
  requires_approval: boolean;
  approval_threshold?: number;
}

export interface CapabilityToken {
  role: string;
  capabilities: string[];
  budget_limits: Record<string, number>;
  approval_requirements: Record<string, boolean>;
  action_permissions: Record<string, string[]>;
}

export class AgentCapabilityService {
  /**
   * Get capabilities for a specific executive role
   */
  async getCapabilitiesForRole(role: string, tenantId: string): Promise<AgentCapability[]> {
    const { data, error } = await supabase
      .from('agent_capabilities')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('executive_role', role as any)
      .eq('is_enabled', true);

    if (error) throw error;
    return (data || []) as AgentCapability[];
  }

  /**
   * Generate capability token for an agent
   */
  async generateCapabilityToken(role: string, tenantId: string): Promise<CapabilityToken> {
    const capabilities = await this.getCapabilitiesForRole(role, tenantId);
    
    const token: CapabilityToken = {
      role,
      capabilities: capabilities.map(c => c.capability_name),
      budget_limits: {},
      approval_requirements: {},
      action_permissions: {}
    };

    // Build token from capabilities
    capabilities.forEach(cap => {
      if (cap.max_budget_per_action) {
        token.budget_limits[cap.capability_name] = cap.max_budget_per_action;
      }
      
      token.approval_requirements[cap.capability_name] = cap.requires_approval;
      
      if (cap.capability_config.allowed_actions) {
        token.action_permissions[cap.capability_name] = cap.capability_config.allowed_actions;
      }
    });

    return token;
  }

  /**
   * Validate if agent can perform action
   */
  async validateAgentAction(
    role: string, 
    action: string, 
    amount: number = 0,
    tenantId: string
  ): Promise<{ allowed: boolean; requires_approval: boolean; reason?: string }> {
    const capabilities = await this.getCapabilitiesForRole(role, tenantId);
    
    // Find relevant capability
    const capability = capabilities.find(cap => 
      cap.capability_config.allowed_actions?.includes(action) ||
      cap.capability_name === action
    );

    if (!capability) {
      return { 
        allowed: false, 
        requires_approval: false,
        reason: `Action '${action}' not permitted for role '${role}'`
      };
    }

    // Check budget limits
    if (capability.max_budget_per_action && amount > capability.max_budget_per_action) {
      return {
        allowed: false,
        requires_approval: false,
        reason: `Amount ${amount} exceeds budget limit ${capability.max_budget_per_action}`
      };
    }

    // Check approval requirements
    const requiresApproval = capability.requires_approval || 
      (capability.approval_threshold && amount > capability.approval_threshold);

    return {
      allowed: true,
      requires_approval: !!requiresApproval
    };
  }

  /**
   * Create default capabilities for a role
   */
  async createDefaultCapabilities(role: string, tenantId: string, createdBy: string): Promise<void> {
    const defaultCapabilities = this.getDefaultCapabilitiesForRole(role);
    
    for (const capability of defaultCapabilities) {
      await supabase.from('agent_capabilities').insert({
        tenant_id: tenantId,
        executive_role: role as any,
        capability_name: capability.name,
        capability_config: capability.config,
        is_enabled: true,
        max_budget_per_action: capability.max_budget,
        requires_approval: capability.requires_approval,
        approval_threshold: capability.approval_threshold,
        created_by: createdBy
      });
    }
  }

  /**
   * Get default capability configurations per role
   */
  private getDefaultCapabilitiesForRole(role: string) {
    const defaults: Record<string, any[]> = {
      cmo: [
        {
          name: 'create_campaign',
          config: { 
            allowed_actions: ['create_campaign', 'edit_campaign', 'pause_campaign'],
            scope: 'marketing'
          },
          max_budget: 50000,
          requires_approval: true,
          approval_threshold: 10000
        },
        {
          name: 'manage_content',
          config: { 
            allowed_actions: ['create_content', 'publish_content', 'schedule_content'],
            scope: 'content'
          },
          max_budget: 5000,
          requires_approval: false
        },
        {
          name: 'analyze_performance',
          config: { 
            allowed_actions: ['view_analytics', 'generate_report', 'export_data'],
            scope: 'analytics'
          },
          requires_approval: false
        }
      ],
      cfo: [
        {
          name: 'budget_management',
          config: { 
            allowed_actions: ['create_budget', 'modify_budget', 'approve_expense'],
            scope: 'finance'
          },
          max_budget: 1000000,
          requires_approval: true,
          approval_threshold: 100000
        },
        {
          name: 'financial_reporting',
          config: { 
            allowed_actions: ['generate_financial_report', 'audit_expenses', 'forecast'],
            scope: 'reporting'
          },
          requires_approval: false
        },
        {
          name: 'compliance_monitoring',
          config: { 
            allowed_actions: ['run_compliance_check', 'generate_tax_report'],
            scope: 'compliance'
          },
          requires_approval: false
        }
      ],
      coo: [
        {
          name: 'process_optimization',
          config: { 
            allowed_actions: ['analyze_workflow', 'optimize_process', 'implement_change'],
            scope: 'operations'
          },
          max_budget: 25000,
          requires_approval: true,
          approval_threshold: 5000
        },
        {
          name: 'resource_allocation',
          config: { 
            allowed_actions: ['assign_resources', 'schedule_tasks', 'monitor_capacity'],
            scope: 'resources'
          },
          requires_approval: false
        },
        {
          name: 'performance_monitoring',
          config: { 
            allowed_actions: ['track_kpis', 'generate_operations_report'],
            scope: 'monitoring'
          },
          requires_approval: false
        }
      ],
      clo: [
        {
          name: 'policy_evaluation',
          config: { 
            allowed_actions: ['evaluate_policy', 'approve_legal_action', 'review_compliance'],
            scope: 'legal'
          },
          requires_approval: false
        },
        {
          name: 'contract_management',
          config: { 
            allowed_actions: ['review_contract', 'approve_terms', 'flag_risk'],
            scope: 'contracts'
          },
          max_budget: 100000,
          requires_approval: true,
          approval_threshold: 10000
        },
        {
          name: 'risk_assessment',
          config: { 
            allowed_actions: ['assess_risk', 'recommend_mitigation', 'audit_compliance'],
            scope: 'risk'
          },
          requires_approval: false
        }
      ]
    };

    return defaults[role] || [];
  }

  /**
   * Update capability configuration
   */
  async updateCapability(
    capabilityId: string, 
    updates: Partial<AgentCapability>
  ): Promise<void> {
    const { error } = await supabase
      .from('agent_capabilities')
      .update(updates)
      .eq('id', capabilityId);

    if (error) throw error;
  }

  /**
   * Disable capability
   */
  async disableCapability(capabilityId: string): Promise<void> {
    await this.updateCapability(capabilityId, { is_enabled: false });
  }
}