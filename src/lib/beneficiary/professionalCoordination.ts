import { supabase } from '@/integrations/supabase/client';
import { BeneficiaryGap } from '@/types/beneficiary-management';

export interface ProfessionalAlert {
  id: string;
  alert_type: 'beneficiary_gap' | 'secure_act_review' | 'estate_tax_change' | 'trust_funding';
  priority: 'critical' | 'high' | 'medium' | 'low';
  client_id: string;
  professional_type: 'attorney' | 'cpa' | 'advisor' | 'trust_officer';
  message: string;
  action_required: string;
  due_date?: string;
  created_at: string;
  resolved: boolean;
}

export interface WorkflowTrigger {
  trigger_type: 'beneficiary_update' | 'gap_detected' | 'tax_law_change';
  conditions: Record<string, any>;
  actions: Array<{
    type: 'notify_professional' | 'schedule_meeting' | 'update_documents' | 'client_communication';
    target: string;
    message: string;
    delay_days?: number;
  }>;
}

/**
 * Coordinates beneficiary management across professional teams
 */
export class ProfessionalCoordinationService {

  /**
   * Creates alerts for professional team members based on beneficiary gaps
   */
  async createBeneficiaryGapAlerts(gaps: BeneficiaryGap[], clientId: string): Promise<ProfessionalAlert[]> {
    const alerts: ProfessionalAlert[] = [];

    for (const gap of gaps) {
      // Determine which professionals need to be alerted based on gap type
      const professionalTypes = this.getProfessionalsForGapType(gap.gap_type);

      for (const professionalType of professionalTypes) {
        const alert: ProfessionalAlert = {
          id: crypto.randomUUID(),
          alert_type: 'beneficiary_gap',
          priority: gap.severity as 'critical' | 'high' | 'medium' | 'low',
          client_id: clientId,
          professional_type: professionalType,
          message: `Beneficiary gap detected: ${gap.description}`,
          action_required: gap.recommendation,
          due_date: this.calculateDueDate(gap.severity),
          created_at: new Date().toISOString(),
          resolved: false
        };

        alerts.push(alert);
      }
    }

    // In production, would save to professional_alerts table
    console.log('Professional alerts created:', alerts);
    return alerts;
  }

  /**
   * Determines which professional types should be notified for each gap type
   */
  private getProfessionalsForGapType(gapType: string): Array<'attorney' | 'cpa' | 'advisor' | 'trust_officer'> {
    switch (gapType) {
      case 'missing_primary':
        return ['advisor', 'attorney'];
      case 'missing_contingent':
        return ['advisor'];
      case 'incomplete_percentage':
        return ['advisor'];
      case 'outdated_designation':
        return ['advisor', 'attorney', 'cpa'];
      default:
        return ['advisor'];
    }
  }

  /**
   * Calculates due date based on gap severity
   */
  private calculateDueDate(severity: string): string {
    const now = new Date();
    let daysToAdd: number;

    switch (severity) {
      case 'critical':
        daysToAdd = 7; // 1 week
        break;
      case 'high':
        daysToAdd = 30; // 1 month
        break;
      case 'medium':
        daysToAdd = 90; // 3 months
        break;
      case 'low':
        daysToAdd = 180; // 6 months
        break;
      default:
        daysToAdd = 30;
    }

    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString().split('T')[0];
  }

  /**
   * Sets up automated workflow triggers for beneficiary management
   */
  async setupBeneficiaryWorkflows(clientId: string): Promise<WorkflowTrigger[]> {
    const workflows: WorkflowTrigger[] = [
      {
        trigger_type: 'beneficiary_update',
        conditions: {
          account_type: ['401k', 'ira', 'roth_ira'],
          time_since_update: '> 2 years'
        },
        actions: [
          {
            type: 'notify_professional',
            target: 'advisor',
            message: 'Client beneficiary designations have not been reviewed in over 2 years. Consider scheduling beneficiary review.',
            delay_days: 0
          },
          {
            type: 'client_communication',
            target: 'client',
            message: 'It\'s been a while since your beneficiary designations were reviewed. Let\'s schedule a time to ensure they\'re current.',
            delay_days: 7
          }
        ]
      },
      {
        trigger_type: 'gap_detected',
        conditions: {
          gap_severity: ['critical', 'high'],
          account_value: '> 100000'
        },
        actions: [
          {
            type: 'schedule_meeting',
            target: 'advisor',
            message: 'High-priority beneficiary gap detected on significant account. Schedule client meeting within 2 weeks.',
            delay_days: 0
          },
          {
            type: 'notify_professional',
            target: 'attorney',
            message: 'Client may need estate planning document updates based on beneficiary gaps.',
            delay_days: 1
          }
        ]
      },
      {
        trigger_type: 'tax_law_change',
        conditions: {
          law_type: 'estate_tax',
          client_net_worth: '> 5000000'
        },
        actions: [
          {
            type: 'notify_professional',
            target: 'cpa',
            message: 'Estate tax law changes may impact client. Review beneficiary strategies for tax optimization.',
            delay_days: 0
          },
          {
            type: 'notify_professional',
            target: 'attorney',
            message: 'Estate tax law changes may require trust document updates.',
            delay_days: 0
          }
        ]
      }
    ];

    // In production, would save to workflow_triggers table
    console.log('Beneficiary workflows configured for client:', clientId);
    return workflows;
  }

  /**
   * Sends SECURE Act compliance alerts to professional team
   */
  async createSecureActAlerts(
    clientId: string,
    retirementAccounts: Array<{
      account_id: string;
      account_type: string;
      balance: number;
      beneficiaries_need_review: boolean;
    }>
  ): Promise<ProfessionalAlert[]> {
    const alerts: ProfessionalAlert[] = [];

    for (const account of retirementAccounts) {
      if (account.beneficiaries_need_review) {
        const alert: ProfessionalAlert = {
          id: crypto.randomUUID(),
          alert_type: 'secure_act_review',
          priority: account.balance > 500000 ? 'high' : 'medium',
          client_id: clientId,
          professional_type: 'advisor',
          message: `SECURE Act review needed for ${account.account_type} (${account.account_id})`,
          action_required: 'Review beneficiary designations for SECURE Act 10-year rule optimization and tax planning strategies',
          due_date: this.calculateDueDate('medium'),
          created_at: new Date().toISOString(),
          resolved: false
        };

        alerts.push(alert);

        // Also alert CPA for tax planning if account is large
        if (account.balance > 250000) {
          const cpAlert: ProfessionalAlert = {
            ...alert,
            id: crypto.randomUUID(),
            professional_type: 'cpa',
            message: `Tax planning opportunity: SECURE Act distribution strategy for ${account.account_type}`,
            action_required: 'Analyze tax-efficient distribution strategies for inherited retirement accounts under SECURE Act'
          };
          alerts.push(cpAlert);
        }
      }
    }

    return alerts;
  }

  /**
   * Creates cross-professional coordination tasks
   */
  async coordinateProfessionalTeam(
    clientId: string,
    taskType: 'estate_plan_update' | 'beneficiary_review' | 'tax_strategy',
    details: Record<string, any>
  ): Promise<{
    coordination_id: string;
    tasks: Array<{
      professional_type: string;
      task_description: string;
      dependencies: string[];
      estimated_completion_days: number;
    }>;
  }> {
    const coordinationId = crypto.randomUUID();
    
    let tasks: Array<{
      professional_type: string;
      task_description: string;
      dependencies: string[];
      estimated_completion_days: number;
    }> = [];

    switch (taskType) {
      case 'estate_plan_update':
        tasks = [
          {
            professional_type: 'advisor',
            task_description: 'Review current beneficiary designations and identify optimization opportunities',
            dependencies: [],
            estimated_completion_days: 7
          },
          {
            professional_type: 'attorney',
            task_description: 'Update will and trust documents to align with beneficiary designations',
            dependencies: ['advisor'],
            estimated_completion_days: 14
          },
          {
            professional_type: 'cpa',
            task_description: 'Analyze tax implications of proposed estate plan changes',
            dependencies: ['advisor'],
            estimated_completion_days: 10
          },
          {
            professional_type: 'trust_officer',
            task_description: 'Implement trust funding and beneficiary designation changes',
            dependencies: ['attorney', 'cpa'],
            estimated_completion_days: 21
          }
        ];
        break;

      case 'beneficiary_review':
        tasks = [
          {
            professional_type: 'advisor',
            task_description: 'Comprehensive beneficiary designation audit across all accounts',
            dependencies: [],
            estimated_completion_days: 5
          },
          {
            professional_type: 'attorney',
            task_description: 'Review estate planning documents for consistency with beneficiary designations',
            dependencies: ['advisor'],
            estimated_completion_days: 7
          }
        ];
        break;

      case 'tax_strategy':
        tasks = [
          {
            professional_type: 'cpa',
            task_description: 'Analyze current year tax situation and multi-year projections',
            dependencies: [],
            estimated_completion_days: 5
          },
          {
            professional_type: 'advisor',
            task_description: 'Implement investment and distribution strategies based on tax analysis',
            dependencies: ['cpa'],
            estimated_completion_days: 10
          }
        ];
        break;
    }

    // In production, would save to professional_coordination table
    console.log('Professional coordination created:', { coordinationId, tasks });

    return {
      coordination_id: coordinationId,
      tasks
    };
  }
}

export const professionalCoordination = new ProfessionalCoordinationService();