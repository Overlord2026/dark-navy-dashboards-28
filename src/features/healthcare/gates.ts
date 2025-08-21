import { Persona, ComplexityTier } from '@/features/personalization/types';

export interface HealthcareContext {
  persona: Persona;
  tier: ComplexityTier;
  hipaaConsentValid?: boolean;
  lastConsentDate?: Date;
  hasDataAccess?: boolean;
  requestedScope?: string[];
  userAge?: number;
  medicareEligible?: boolean;
}

export interface GateResult {
  allow: boolean;
  reasons: string[];
  requiredActions?: ('consent' | 'upgrade' | 'verification')[];
  disclosures?: string[];
}

/**
 * Healthcare gate for PHI access and operations
 * Ensures HIPAA compliance and appropriate access controls
 */
export function healthcareGate(action: string, context: HealthcareContext): GateResult {
  console.info('gate.evaluate', { action, persona: context.persona, tier: context.tier });

  const result: GateResult = {
    allow: false,
    reasons: [],
    requiredActions: [],
    disclosures: []
  };

  // Base consent requirement
  if (!context.hipaaConsentValid) {
    result.reasons.push('HIPAA_CONSENT_REQUIRED');
    result.requiredActions?.push('consent');
    result.disclosures?.push('HIPAA Privacy Notice must be acknowledged');
  }

  // Consent freshness check (90 days)
  if (context.lastConsentDate) {
    const daysSinceConsent = Math.floor(
      (Date.now() - context.lastConsentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceConsent > 90) {
      result.reasons.push('CONSENT_STALE');
      result.requiredActions?.push('consent');
    }
  }

  // Action-specific gates
  switch (action) {
    case 'health.data.view':
      if (context.tier === 'foundational' && context.requestedScope?.includes('sensitive')) {
        result.reasons.push('TIER_INSUFFICIENT');
        result.requiredActions?.push('upgrade');
      }
      break;

    case 'health.fhir.connect':
      if (!context.hasDataAccess) {
        result.reasons.push('DATA_ACCESS_REQUIRED');
        result.requiredActions?.push('verification');
      }
      break;

    case 'health.medicare.planning':
      if (context.persona === 'aspiring' && (context.userAge || 0) < 62) {
        result.reasons.push('AGE_REQUIREMENT_NOT_MET');
      }
      break;

    case 'health.vault.store':
      result.disclosures?.push('Documents stored with client-side encryption');
      break;
  }

  // Allow if no blocking reasons
  result.allow = result.reasons.length === 0;

  console.info('gate.result', { 
    action, 
    allow: result.allow, 
    reasons: result.reasons,
    persona: context.persona,
    tier: context.tier
  });

  return result;
}

/**
 * Simplified gate check for common healthcare operations
 */
export function checkHealthcareAccess(
  persona: Persona, 
  tier: ComplexityTier, 
  hasConsent: boolean = false
): boolean {
  const context: HealthcareContext = {
    persona,
    tier,
    hipaaConsentValid: hasConsent,
    lastConsentDate: hasConsent ? new Date() : undefined
  };

  const result = healthcareGate('health.data.view', context);
  return result.allow;
}