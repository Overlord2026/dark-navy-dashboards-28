import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/lib/analytics';

// Tool handler interfaces
export interface ClaimIntake {
  policyNumber: string;
  incidentDate: string;
  incidentType: string;
  description: string;
  location?: string;
  witnesses?: string[];
  damages?: number;
}

export interface TaskInput {
  title: string;
  due?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface QuoteInput {
  vehicle: {
    year: number;
    make: string;
    model: string;
    vin?: string;
  };
  driver: {
    age: number;
    licenseState: string;
    yearsExperience: number;
  };
  coverage: {
    liability: boolean;
    collision: boolean;
    comprehensive: boolean;
  };
}

// Tool handler implementations
export class VoiceToolHandlers {
  static async createFNOLCase(intake: ClaimIntake): Promise<{ caseId: string; claimNumber: string }> {
    try {
      // Create claim record - using a simple object for demo
      const claim = {
        id: `claim-${Date.now()}`,
        policy_number: intake.policyNumber,
        incident_date: intake.incidentDate,
        incident_type: intake.incidentType,
        description: intake.description,
        status: 'reported',
        created_via: 'voice_assistant',
        claim_number: `CL-${Date.now().toString().slice(-8)}`
      };

      // Emit ClaimIntake-RDS receipt
      await VoiceToolHandlers.emitClaimIntakeReceipt(intake, claim.id);

      // Emit ClaimRecord-RDS receipt
      await VoiceToolHandlers.emitClaimRecordReceipt(claim);

      // Analytics
      analytics.track('voice.tool.fnol_created', {
        claimId: claim.id,
        policyNumber: intake.policyNumber,
        incidentType: intake.incidentType
      });

      return {
        caseId: claim.id,
        claimNumber: claim.claim_number || `CL-${claim.id.substring(0, 8)}`
      };

    } catch (error) {
      console.error('Failed to create FNOL case:', error);
      throw new Error('Failed to create insurance claim');
    }
  }

  static async createTask(task: TaskInput): Promise<{ taskId: string }> {
    try {
      // Create task record - using a simple object for demo
      const taskRecord = {
        id: `task-${Date.now()}`,
        title: task.title,
        due_date: task.due,
        priority: task.priority || 'medium',
        description: task.description,
        created_via: 'voice_assistant',
        status: 'pending'
      };

      // Emit Task-RDS receipt
      await VoiceToolHandlers.emitTaskReceipt(taskRecord);

      // Analytics
      analytics.track('voice.tool.task_created', {
        taskId: taskRecord.id,
        priority: task.priority || 'medium'
      });

      return { taskId: taskRecord.id };

    } catch (error) {
      console.error('Failed to create task:', error);
      throw new Error('Failed to create task');
    }
  }

  static async fetchPolicySummary(policyNo: string): Promise<{ summary: any; redacted: boolean }> {
    try {
      // Create mock policy summary for demo
      const policy = {
        policy_number: policyNo,
        policy_type: 'Auto',
        status: 'Active',
        effective_date: '2024-01-01',
        expiration_date: '2024-12-31',
        coverage_types: ['Liability', 'Collision', 'Comprehensive'],
        annual_premium: 1200,
        deductible: 500
      };

      // Create banded summary (redact sensitive info)
      const summary = {
        policyNumber: policy.policy_number,
        type: policy.policy_type,
        status: policy.status,
        effectiveDate: policy.effective_date,
        expirationDate: policy.expiration_date,
        coverageTypes: policy.coverage_types,
        premium: policy.annual_premium ? `$${Math.round(policy.annual_premium / 1000)}K range` : 'Not disclosed',
        deductible: policy.deductible ? `$${policy.deductible}` : 'Standard'
      };

      // Emit Access-RDS receipt
      await VoiceToolHandlers.emitAccessReceipt('policy_summary', policyNo, summary);

      // Analytics
      analytics.track('voice.tool.policy_fetched', {
        policyNumber: policyNo,
        policyType: policy.policy_type
      });

      return { summary, redacted: true };

    } catch (error) {
      console.error('Failed to fetch policy summary:', error);
      throw new Error('Policy not found or access denied');
    }
  }

  static async quoteAuto(input: QuoteInput): Promise<{ quoteId: string; premium: number; validUntil: string }> {
    try {
      // Generate quote (simplified calculation)
      const basePremium = 800;
      const ageFactor = input.driver.age < 25 ? 1.5 : input.driver.age > 65 ? 1.2 : 1.0;
      const experienceFactor = input.driver.yearsExperience < 3 ? 1.3 : 1.0;
      const vehicleAgeFactor = (new Date().getFullYear() - input.vehicle.year) > 10 ? 0.8 : 1.1;
      
      const estimatedPremium = Math.round(basePremium * ageFactor * experienceFactor * vehicleAgeFactor);

      // Create quote session
      const quoteSession = {
        id: `quote-${Date.now()}`,
        vehicle: input.vehicle,
        driver: input.driver,
        coverage: input.coverage,
        estimatedPremium,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        createdVia: 'voice_assistant'
      };

      // Store quote session (demo - just create object)
      const quote = { ...quoteSession };

      // Emit QuoteSession-RDS receipt
      await VoiceToolHandlers.emitQuoteSessionReceipt(quoteSession);

      // Analytics
      analytics.track('voice.tool.quote_generated', {
        quoteId: quote.id,
        vehicleYear: input.vehicle.year,
        driverAge: input.driver.age,
        estimatedPremium
      });

      return {
        quoteId: quote.id,
        premium: estimatedPremium,
        validUntil: quoteSession.validUntil
      };

    } catch (error) {
      console.error('Failed to generate quote:', error);
      throw new Error('Failed to generate auto insurance quote');
    }
  }

  // Receipt emission helpers
  private static async emitClaimIntakeReceipt(intake: ClaimIntake, claimId: string): Promise<void> {
    try {
      await supabase.functions.invoke('store-receipt', {
        body: {
          receiptType: 'ClaimIntake-RDS',
          data: {
            claimId,
            policyNumber: intake.policyNumber,
            incidentType: intake.incidentType,
            contentHash: VoiceToolHandlers.hashObject(intake),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to emit ClaimIntake-RDS receipt:', error);
    }
  }

  private static async emitClaimRecordReceipt(claim: any): Promise<void> {
    try {
      await supabase.functions.invoke('store-receipt', {
        body: {
          receiptType: 'ClaimRecord-RDS',
          data: {
            claimId: claim.id,
            claimNumber: claim.claim_number,
            status: claim.status,
            contentHash: VoiceToolHandlers.hashObject(claim),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to emit ClaimRecord-RDS receipt:', error);
    }
  }

  private static async emitTaskReceipt(task: any): Promise<void> {
    try {
      await supabase.functions.invoke('store-receipt', {
        body: {
          receiptType: 'Task-RDS',
          data: {
            taskId: task.id,
            title: task.title,
            priority: task.priority,
            contentHash: VoiceToolHandlers.hashObject(task),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to emit Task-RDS receipt:', error);
    }
  }

  private static async emitAccessReceipt(accessType: string, resourceId: string, data: any): Promise<void> {
    try {
      await supabase.functions.invoke('store-receipt', {
        body: {
          receiptType: 'Access-RDS',
          data: {
            accessType,
            resourceId,
            accessedAt: new Date().toISOString(),
            contentHash: VoiceToolHandlers.hashObject(data),
            redacted: true
          }
        }
      });
    } catch (error) {
      console.error('Failed to emit Access-RDS receipt:', error);
    }
  }

  private static async emitQuoteSessionReceipt(quoteSession: any): Promise<void> {
    try {
      await supabase.functions.invoke('store-receipt', {
        body: {
          receiptType: 'QuoteSession-RDS',
          data: {
            quoteId: quoteSession.id,
            estimatedPremium: quoteSession.estimatedPremium,
            validUntil: quoteSession.validUntil,
            contentHash: VoiceToolHandlers.hashObject(quoteSession),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to emit QuoteSession-RDS receipt:', error);
    }
  }

  private static hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}