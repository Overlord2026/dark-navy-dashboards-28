import { ProPersona } from '@/features/pro/types';
import { recordDecisionRDS, DecisionRDS } from '@/features/pro/compliance/DecisionTracker';
import { recordConsentRDS, ConsentRDS } from '@/features/pro/compliance/ConsentTracker';
import { writeAuditRDS, AuditRDS } from '@/features/receipts/audit';
import CompliancePersonaRegistry, { ComplianceConfig, GeoComplianceConfig } from './CompliancePersonaRegistry';

export interface ComplianceEvent {
  id: string;
  persona: ProPersona;
  eventType: 'ce_completion' | 'audit_action' | 'record_access' | 'communication' | 'violation';
  timestamp: Date;
  userId: string;
  metadata: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  requiresAction: boolean;
}

export interface CERecord {
  id: string;
  userId: string;
  persona: ProPersona;
  courseId: string;
  courseName: string;
  provider: string;
  hoursEarned: number;
  ethicsHours?: number;
  specialtyType?: string;
  completionDate: Date;
  expirationDate: Date;
  certificateUrl?: string;
  deliveryMethod: 'in_person' | 'online' | 'voice_ai' | 'hybrid';
  state?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface AuditAction {
  id: string;
  persona: ProPersona;
  auditType: 'internal' | 'external' | 'regulatory' | 'self';
  triggeredBy: 'schedule' | 'event' | 'manual' | 'ai_alert';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  findings: string[];
  recommendations: string[];
  followUpRequired: boolean;
  dueDate: Date;
}

export abstract class ComplianceHandler {
  protected persona: ProPersona;
  protected config: ComplianceConfig;
  protected geoConfigs: GeoComplianceConfig[];
  protected registry: CompliancePersonaRegistry;

  constructor(persona: ProPersona, state?: string, county?: string) {
    this.persona = persona;
    this.registry = CompliancePersonaRegistry.getInstance();
    this.config = this.registry.getConfig(persona)!;
    this.geoConfigs = state ? this.registry.getGeoConfig(state, county) : [];
    
    if (!this.config) {
      throw new Error(`No compliance configuration found for persona: ${persona}`);
    }
  }

  // Abstract methods that must be implemented by subclasses
  abstract validateCERequirements(userId: string): Promise<{ valid: boolean; deficiencies: string[] }>;
  abstract scheduleAudit(auditType: AuditAction['auditType']): Promise<AuditAction>;
  abstract generateComplianceReport(startDate: Date, endDate: Date): Promise<any>;

  // Common compliance methods
  async recordCECompletion(ceRecord: Omit<CERecord, 'id'>): Promise<CERecord> {
    const record: CERecord = {
      id: crypto.randomUUID(),
      ...ceRecord,
      persona: this.persona
    };

    // Record decision for CE completion
    await recordDecisionRDS({
      action: 'ce_completion',
      persona: this.persona,
      inputs_hash: this.hashObject(record),
      reasons: ['continuing_education', 'professional_development'],
      risk_level: 'low',
      metadata: {
        courseId: record.courseId,
        hoursEarned: record.hoursEarned,
        deliveryMethod: record.deliveryMethod
      }
    });

    // Emit audit trail
    await writeAuditRDS({
      type: 'Audit-RDS',
      ts: new Date().toISOString(),
      merkle_root: 'sha256:ce_completion',
      accept_n_of_m: { n: 1, m: 1, accepted: true },
      included_receipts: [record.id],
      reasons: ['ce.completed', 'professional.development'],
      env: 'prod'
    });

    return record;
  }

  async recordComplianceViolation(
    userId: string,
    violationType: string,
    severity: 'low' | 'medium' | 'high',
    details: Record<string, any>
  ): Promise<ComplianceEvent> {
    const event: ComplianceEvent = {
      id: crypto.randomUUID(),
      persona: this.persona,
      eventType: 'violation',
      timestamp: new Date(),
      userId,
      metadata: {
        violationType,
        details,
        regulatoryBodies: this.config.regulatoryBodies
      },
      riskLevel: severity,
      requiresAction: severity === 'high'
    };

    // Record decision for violation
    await recordDecisionRDS({
      action: 'compliance_violation_recorded',
      persona: this.persona,
      inputs_hash: this.hashObject(event),
      reasons: ['compliance.violation', violationType],
      result: 'approve', // Always approve recording violations
      risk_level: severity,
      metadata: details
    });

    return event;
  }

  async checkRecordRetention(recordType: keyof ComplianceConfig['recordRetention']): Promise<Date> {
    const retentionYears = this.config.recordRetention[recordType];
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - retentionYears);
    return cutoffDate;
  }

  async isAuditDue(lastAuditDate: Date, auditType: keyof ComplianceConfig['auditFrequency']): Promise<boolean> {
    const frequencyMonths = this.config.auditFrequency[auditType];
    if (!frequencyMonths) return false;

    const nextDueDate = new Date(lastAuditDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + frequencyMonths);
    
    return new Date() >= nextDueDate;
  }

  async canUseVoiceAI(feature: keyof ComplianceConfig['voiceAIFeatures']): Promise<boolean> {
    return this.config.voiceAIFeatures[feature];
  }

  async hasAccessToPremiumFeature(feature: keyof ComplianceConfig['premiumFeatures']): Promise<boolean> {
    return this.config.premiumFeatures[feature];
  }

  protected hashObject(obj: any): string {
    return btoa(JSON.stringify(obj)).slice(0, 24);
  }

  // Geo-specific compliance checks
  async getApplicableRules(action: string): Promise<string[]> {
    const baseRules = this.config.regulatoryBodies;
    const geoRules = this.geoConfigs.flatMap(config => config.additionalRequirements);
    return [...baseRules, ...geoRules];
  }

  async checkGeoExemptions(action: string): Promise<boolean> {
    return this.geoConfigs.some(config => config.exemptions.includes(action));
  }

  // Voice AI integration methods
  async requestVoiceCEDelivery(courseId: string, userId: string): Promise<{ approved: boolean; sessionId?: string }> {
    if (!await this.canUseVoiceAI('ceDelivery')) {
      return { approved: false };
    }

    const sessionId = `voice_ce_${crypto.randomUUID()}`;
    
    await recordDecisionRDS({
      action: 'voice_ce_delivery_requested',
      persona: this.persona,
      inputs_hash: this.hashObject({ courseId, userId }),
      reasons: ['voice.ai', 'ce.delivery'],
      risk_level: 'low',
      metadata: { courseId, sessionId }
    });

    return { approved: true, sessionId };
  }

  async triggerVoiceAlert(alertType: string, message: string, userId: string): Promise<void> {
    if (!await this.canUseVoiceAI('complianceAlerts')) {
      return;
    }

    await recordDecisionRDS({
      action: 'voice_alert_triggered',
      persona: this.persona,
      inputs_hash: this.hashObject({ alertType, userId }),
      reasons: ['voice.alert', 'compliance.notification'],
      risk_level: 'low',
      metadata: { alertType, message }
    });
  }
}

// Specific implementation for Financial Advisors
export class AdvisorComplianceHandler extends ComplianceHandler {
  constructor(state?: string, county?: string) {
    super('advisor', state, county);
  }

  async validateCERequirements(userId: string): Promise<{ valid: boolean; deficiencies: string[] }> {
    // Implementation specific to advisor CE requirements
    const deficiencies: string[] = [];
    
    // Check total hours
    const requiredHours = this.config.ceRequirements.hoursPerCycle;
    // TODO: Query actual CE records from database
    
    // Check ethics hours
    if (this.config.ceRequirements.ethicsHours) {
      // TODO: Check ethics hours specifically
    }

    // Check specialty requirements
    Object.entries(this.config.ceRequirements.specialtyRequirements || {}).forEach(([specialty, hours]) => {
      // TODO: Check specialty hours
    });

    return {
      valid: deficiencies.length === 0,
      deficiencies
    };
  }

  async scheduleAudit(auditType: AuditAction['auditType']): Promise<AuditAction> {
    const dueDate = new Date();
    const frequencyMonths = this.config.auditFrequency[auditType === 'regulatory' ? 'regulatory' : auditType] || 12;
    dueDate.setMonth(dueDate.getMonth() + frequencyMonths);

    const audit: AuditAction = {
      id: crypto.randomUUID(),
      persona: this.persona,
      auditType,
      triggeredBy: 'schedule',
      status: 'pending',
      findings: [],
      recommendations: [],
      followUpRequired: auditType === 'regulatory',
      dueDate
    };

    await recordDecisionRDS({
      action: 'audit_scheduled',
      persona: this.persona,
      inputs_hash: this.hashObject(audit),
      reasons: ['audit.scheduled', auditType],
      risk_level: 'low',
      metadata: { auditType, dueDate: dueDate.toISOString() }
    });

    return audit;
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    // Advisor-specific compliance report generation
    return {
      persona: this.persona,
      period: { startDate, endDate },
      ceStatus: await this.validateCERequirements('current_user'),
      auditStatus: 'current',
      regulatoryBodies: this.config.regulatoryBodies,
      // Additional advisor-specific metrics
    };
  }
}

// Factory pattern for creating handlers
export class ComplianceHandlerFactory {
  static create(persona: ProPersona, state?: string, county?: string): ComplianceHandler {
    switch (persona) {
      case 'advisor':
        return new AdvisorComplianceHandler(state, county);
      // TODO: Implement other persona handlers
      default:
        throw new Error(`No compliance handler available for persona: ${persona}`);
    }
  }
}