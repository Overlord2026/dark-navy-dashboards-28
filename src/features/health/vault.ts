import { recordReceipt } from '@/features/receipts/store';

export interface PREGrant {
  grant_id: string;
  scope_fields: string[];
  ttl_days: number;
  granted_at: string;
  expires_at: string;
  status: 'active' | 'expired' | 'revoked';
  disclosures: string[]; // List of document hashes disclosed under this grant
}

export interface PRERevocation {
  grant_id: string;
  revoked_at: string;
  reason: string;
}

export interface PREDisclosure {
  grant_id: string;
  doc_hash: string;
  disclosed_at: string;
  recipient: string;
}

// In-memory storage for demo
let PRE_GRANTS: Record<string, PREGrant> = {};
let PRE_REVOCATIONS: Record<string, PRERevocation> = {};
let PRE_DISCLOSURES: PREDisclosure[] = [];

/**
 * Grant PRE access with specific scope and TTL
 */
export async function grantPRE(
  scopeFields: string[],
  ttlDays: number,
  purpose: string = 'healthcare_coordination'
): Promise<PREGrant> {
  
  const grantId = `pre_grant_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
  
  const grant: PREGrant = {
    grant_id: grantId,
    scope_fields: scopeFields,
    ttl_days: ttlDays,
    granted_at: timestamp,
    expires_at: expiresAt,
    status: 'active',
    disclosures: []
  };
  
  PRE_GRANTS[grantId] = grant;
  
  // Emit Vault-RDS for the grant
  await recordReceipt({
    receipt_id: `rds_vault_grant_${Date.now()}`,
    type: 'Vault-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ scopeFields, ttlDays, purpose }))}`,
    vault_details: {
      action: 'grant',
      grant_id: grantId,
      scope_fields: scopeFields,
      ttl_days: ttlDays,
      purpose,
      expires_at: expiresAt,
      disclosures: []
    },
    reasons: ['pre_granted', 'vault_access_enabled', purpose]
  });
  
  console.log('✅ PRE grant created:', grantId);
  
  return grant;
}

/**
 * Revoke a PRE grant
 */
export async function revokePRE(
  grantId: string,
  reason: string = 'user_revoked'
): Promise<PRERevocation> {
  
  const grant = PRE_GRANTS[grantId];
  if (!grant) {
    throw new Error(`PRE grant ${grantId} not found`);
  }
  
  const timestamp = new Date().toISOString();
  
  const revocation: PRERevocation = {
    grant_id: grantId,
    revoked_at: timestamp,
    reason
  };
  
  // Update grant status
  grant.status = 'revoked';
  PRE_REVOCATIONS[grantId] = revocation;
  
  // Emit Vault-RDS for the revocation
  await recordReceipt({
    receipt_id: `rds_vault_revoke_${Date.now()}`,
    type: 'Vault-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ grantId, reason }))}`,
    vault_details: {
      action: 'revoke',
      grant_id: grantId,
      revoked_at: timestamp,
      reason,
      prior_disclosures_count: grant.disclosures.length
    },
    reasons: ['pre_revoked', 'vault_access_disabled', reason]
  });
  
  console.log('✅ PRE grant revoked:', grantId);
  
  return revocation;
}

/**
 * Record a disclosure event under a PRE grant
 */
export async function recordPREDisclosure(
  grantId: string,
  docHash: string,
  recipient: string
): Promise<PREDisclosure> {
  
  const grant = PRE_GRANTS[grantId];
  if (!grant) {
    throw new Error(`PRE grant ${grantId} not found`);
  }
  
  if (grant.status !== 'active') {
    throw new Error(`PRE grant ${grantId} is not active (status: ${grant.status})`);
  }
  
  const timestamp = new Date().toISOString();
  
  const disclosure: PREDisclosure = {
    grant_id: grantId,
    doc_hash: docHash,
    disclosed_at: timestamp,
    recipient
  };
  
  // Add to grant's disclosure list
  grant.disclosures.push(docHash);
  PRE_DISCLOSURES.push(disclosure);
  
  // Emit Vault-RDS for the disclosure
  await recordReceipt({
    receipt_id: `rds_vault_disclosure_${Date.now()}`,
    type: 'Vault-RDS',
    ts: timestamp,
    policy_version: 'HEALTH-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ grantId, docHash, recipient }))}`,
    vault_details: {
      action: 'disclose',
      grant_id: grantId,
      doc_hash: docHash,
      recipient,
      disclosure_count: grant.disclosures.length,
      grant_expires_at: grant.expires_at
    },
    reasons: ['pre_disclosure', 'document_accessed', 'audit_trail']
  });
  
  console.log('✅ PRE disclosure recorded:', { grantId, docHash, recipient });
  
  return disclosure;
}

/**
 * Check if a PRE grant is valid and active
 */
export function isPREGrantValid(grantId: string): boolean {
  const grant = PRE_GRANTS[grantId];
  if (!grant) return false;
  
  if (grant.status !== 'active') return false;
  
  const now = new Date().getTime();
  const expires = new Date(grant.expires_at).getTime();
  
  if (now > expires) {
    grant.status = 'expired';
    return false;
  }
  
  return true;
}

/**
 * Get PRE grant by ID
 */
export function getPREGrant(grantId: string): PREGrant | null {
  return PRE_GRANTS[grantId] || null;
}

/**
 * List all PRE grants
 */
export function listPREGrants(): PREGrant[] {
  return Object.values(PRE_GRANTS);
}

/**
 * List disclosures for a grant
 */
export function listPREDisclosures(grantId: string): PREDisclosure[] {
  return PRE_DISCLOSURES.filter(d => d.grant_id === grantId);
}

/**
 * Get PRE revocation by grant ID
 */
export function getPRERevocation(grantId: string): PRERevocation | null {
  return PRE_REVOCATIONS[grantId] || null;
}