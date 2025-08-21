import { Persona, ComplexityTier } from '@/features/personalization/types';

export interface BaseRDS {
  type: string;
  inputs_hash: string;
  policy_version: string;
  ts: string;
  anchor_ref?: string;
}

export interface HealthRDS extends BaseRDS {
  type: 'Health-RDS';
  action: string;
  reasons: string[];
  result: 'allow' | 'deny';
  disclosures: string[];
  financial?: {
    estimated_cost_cents?: number;
    coverage_type?: string;
  };
}

export interface ConsentRDS extends BaseRDS {
  type: 'Consent-RDS';
  hipaa_scope: string[];
  purpose_of_use: string;
  consent_time: string;
  expiry?: string;
  freshness_score: number; // 0-1
  proof_hash: string;
}

export interface VaultRDS extends BaseRDS {
  type: 'Vault-RDS';
  action: 'grant' | 'revoke' | 'legal_hold' | 'delete';
  doc_id?: string;
}

export type HealthcareRDS = HealthRDS | ConsentRDS | VaultRDS;

/**
 * Creates a hash of inputs without storing PHI
 */
function hashInputs(inputs: Record<string, unknown>): string {
  // Remove any potential PHI fields before hashing
  const sanitized = { ...inputs };
  delete sanitized.name;
  delete sanitized.ssn;
  delete sanitized.dob;
  delete sanitized.address;
  delete sanitized.phone;
  delete sanitized.email;
  
  // Hash the sanitized inputs
  const inputString = JSON.stringify(sanitized, Object.keys(sanitized).sort());
  return btoa(inputString).substring(0, 16); // Simple hash for demo
}

/**
 * Records a health action receipt
 */
export function recordHealthRDS(
  action: string,
  inputs: Record<string, unknown>,
  result: 'allow' | 'deny',
  reasons: string[],
  disclosures: string[] = [],
  financial?: HealthRDS['financial']
): HealthRDS {
  const receipt: HealthRDS = {
    type: 'Health-RDS',
    action,
    inputs_hash: hashInputs(inputs),
    policy_version: 'H-2025.08',
    reasons,
    result,
    disclosures,
    financial,
    ts: new Date().toISOString()
  };

  console.info('receipt.recorded', { 
    type: 'Health-RDS',
    action,
    result,
    reasons_count: reasons.length,
    has_financial: !!financial
  });

  return receipt;
}

/**
 * Records a HIPAA consent receipt
 */
export function recordConsentRDS(
  scope: string[],
  purposeOfUse: string,
  expiryDays?: number
): ConsentRDS {
  const now = new Date();
  const expiry = expiryDays ? new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000) : undefined;
  
  const inputs = {
    scope,
    purpose: purposeOfUse,
    timestamp: now.toISOString()
  };

  const receipt: ConsentRDS = {
    type: 'Consent-RDS',
    hipaa_scope: scope,
    purpose_of_use: purposeOfUse,
    consent_time: now.toISOString(),
    expiry: expiry?.toISOString(),
    freshness_score: 1.0, // New consent = fresh
    proof_hash: hashInputs(inputs),
    inputs_hash: hashInputs(inputs),
    policy_version: 'H-2025.08',
    ts: now.toISOString()
  };

  console.info('receipt.recorded', {
    type: 'Consent-RDS',
    scope_count: scope.length,
    expires: !!expiry,
    purpose: purposeOfUse
  });

  return receipt;
}

/**
 * Records a vault operation receipt
 */
export function recordVaultRDS(
  action: VaultRDS['action'],
  docId?: string,
  anchorRef?: string
): VaultRDS {
  const inputs = {
    action,
    doc_id: docId,
    timestamp: new Date().toISOString()
  };

  const receipt: VaultRDS = {
    type: 'Vault-RDS',
    action,
    doc_id: docId,
    anchor_ref: anchorRef,
    inputs_hash: hashInputs(inputs),
    policy_version: 'H-2025.08',
    ts: new Date().toISOString()
  };

  console.info('receipt.recorded', {
    type: 'Vault-RDS',
    action,
    has_doc_id: !!docId,
    has_anchor: !!anchorRef
  });

  return receipt;
}

/**
 * Store receipts (in real implementation, this would go to secure storage)
 */
export class HealthcareReceiptStore {
  private receipts: HealthcareRDS[] = [];

  store(receipt: HealthcareRDS): void {
    this.receipts.push(receipt);
    console.info('receipt.stored', { 
      type: receipt.type,
      total_receipts: this.receipts.length
    });
  }

  getByType<T extends HealthcareRDS>(type: T['type']): T[] {
    return this.receipts.filter(r => r.type === type) as T[];
  }

  getRecent(count: number = 10): HealthcareRDS[] {
    return this.receipts
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, count);
  }
}

// Global store instance
export const healthcareReceiptStore = new HealthcareReceiptStore();