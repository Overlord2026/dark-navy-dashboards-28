import { recordConsentRDS, ConsentRDS } from '@/features/healthcare/receipts';

export interface ConsentScope {
  purpose: 'care_coordination' | 'billing' | 'legal' | 'research' | 'quality_assurance';
  entities: string[];
  data_types: string[];
}

export interface ActiveConsent {
  id: string;
  scope: ConsentScope;
  consent_time: string;
  expiry?: string;
  freshness_score: number;
  proof_hash: string;
  status: 'active' | 'expired' | 'revoked';
}

/**
 * Issue a new HIPAA consent and generate Consent-RDS
 */
export function issueConsent(
  scope: ConsentScope,
  ttlDays: number = 365
): ConsentRDS {
  const hipaaScope = [
    `purpose:${scope.purpose}`,
    ...scope.entities.map(e => `entity:${e}`),
    ...scope.data_types.map(d => `data:${d}`)
  ];

  return recordConsentRDS(
    hipaaScope,
    scope.purpose,
    ttlDays
  );
}

/**
 * Revoke an existing consent and generate Consent-RDS
 */
export function revokeConsent(consentId: string, reason: string = 'user_requested'): ConsentRDS {
  const inputs = {
    consent_id: consentId,
    revocation_reason: reason,
    timestamp: new Date().toISOString()
  };

  // Create a revocation receipt using the base recordConsentRDS structure
  const now = new Date();
  const receipt: ConsentRDS = {
    type: 'Consent-RDS',
    hipaa_scope: [`revoked:${consentId}`],
    purpose_of_use: 'revocation',
    consent_time: now.toISOString(),
    freshness_score: 0.0, // Revoked = no freshness
    proof_hash: btoa(JSON.stringify(inputs)).substring(0, 16),
    inputs_hash: btoa(JSON.stringify(inputs)).substring(0, 16),
    policy_version: 'H-2025.08',
    ts: now.toISOString()
  };

  console.info('consent.revoked', {
    consent_id: consentId,
    reason,
    revoked_at: now.toISOString()
  });

  return receipt;
}

/**
 * Check if consent is valid for a specific purpose
 */
export function validateConsent(
  consent: ActiveConsent,
  requiredPurpose: string,
  requiredEntities: string[] = []
): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let valid = true;

  // Check expiry
  if (consent.expiry && new Date(consent.expiry) < new Date()) {
    reasons.push('CONSENT_EXPIRED');
    valid = false;
  }

  // Check revocation
  if (consent.status === 'revoked') {
    reasons.push('CONSENT_REVOKED');
    valid = false;
  }

  // Check freshness score (below 0.5 considered stale)
  if (consent.freshness_score < 0.5) {
    reasons.push('CONSENT_STALE');
    valid = false;
  }

  // Check purpose match
  if (consent.scope.purpose !== requiredPurpose) {
    reasons.push('PURPOSE_MISMATCH');
    valid = false;
  }

  // Check entity coverage
  const missingEntities = requiredEntities.filter(
    entity => !consent.scope.entities.includes(entity)
  );
  if (missingEntities.length > 0) {
    reasons.push('ENTITY_NOT_AUTHORIZED');
    valid = false;
  }

  if (valid) {
    reasons.push('CONSENT_VALID');
  }

  return { valid, reasons };
}

/**
 * Get mock active consents (in real app, fetch from secure storage)
 */
export function getActiveConsents(): ActiveConsent[] {
  return [
    {
      id: 'consent-001',
      scope: {
        purpose: 'care_coordination',
        entities: ['primary_physician', 'specialist', 'lab'],
        data_types: ['medical_records', 'test_results', 'medications']
      },
      consent_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      expiry: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(), // 335 days from now
      freshness_score: 0.9,
      proof_hash: 'abc123def456',
      status: 'active'
    },
    {
      id: 'consent-002',
      scope: {
        purpose: 'billing',
        entities: ['insurance_provider', 'billing_department'],
        data_types: ['claims', 'payments', 'insurance_info']
      },
      consent_time: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      expiry: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(), // 305 days from now
      freshness_score: 0.8,
      proof_hash: 'xyz789uvw012',
      status: 'active'
    },
    {
      id: 'consent-003',
      scope: {
        purpose: 'legal',
        entities: ['attorney', 'legal_counsel'],
        data_types: ['medical_records', 'disability_records']
      },
      consent_time: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
      expiry: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(), // 185 days from now
      freshness_score: 0.4, // Stale
      proof_hash: 'lmn345pqr678',
      status: 'active'
    }
  ];
}

/**
 * Calculate freshness score based on age and activity
 */
export function calculateFreshnessScore(consentTime: string, lastActivity?: string): number {
  const now = Date.now();
  const consentAge = now - new Date(consentTime).getTime();
  const daysSinceConsent = consentAge / (24 * 60 * 60 * 1000);
  
  // Freshness decreases over time
  let score = Math.max(0, 1 - (daysSinceConsent / 365));
  
  // Boost score if recent activity
  if (lastActivity) {
    const activityAge = now - new Date(lastActivity).getTime();
    const daysSinceActivity = activityAge / (24 * 60 * 60 * 1000);
    
    if (daysSinceActivity < 30) {
      score = Math.min(1, score + 0.2); // Boost for recent activity
    }
  }
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
}