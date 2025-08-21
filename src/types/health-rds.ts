export interface HealthRDSReceipt {
  id: string; // rds_2025_08_21_0001
  type: "Health-RDS";
  action: "authorize" | "order" | "share" | "publish" | "pay" | "takedown";
  subject_id?: string; // did:patient:abc123 - optional DID/VC pointer; no raw PHI
  actor_id?: string; // did:app:mybfocfo - who executed the gate
  inputs_hash: string; // sha256:... - hash of canonical summary (FHIR redacted)
  policy_version: string; // H-2025.08 - frozen ruleset ID
  reasons: string[]; // ["USPSTF_ELIGIBLE", "COVERED"] - explainable codes
  result: "approve" | "deny"; // approve|deny
  disclosures: string[]; // ["minimum-necessary", "purpose:care_coordination"]
  financial?: {
    hsa_eligible?: boolean;
    est_oop?: number; // estimated out of pocket
    deductibleMet?: boolean;
    estimated_cost_cents?: number;
    coverage_type?: string;
  };
  linked?: { // cross-references; all optional
    consent_rds_id?: string;
    vault_rds_id?: string;
    pa_rds_id?: string;
    settlement_rds_id?: string;
  };
  anchor_ref?: {
    merkle_root: string; // 0xROOT
    cross_chain_locator: Array<{
      chain_id: string; // "perm-A", "pub-B"
      tx_ref: string; // "0x..."
      ts: number; // Unix timestamp
      anchor_epoch: number;
    }>;
  };
  ts: string; // ISO 8601 timestamp
}

export interface ConsentRDSReceipt {
  id: string; // cons_2025_08_21_0099
  type: "Consent-RDS";
  purpose_of_use: "care_coordination" | "billing" | "legal";
  scope: {
    minimum_necessary?: boolean;
    recipient_role?: "provider" | "advisor" | "cpa" | "attorney" | string;
    resources?: string[]; // ["claims_summary", "lab_summary"]
    [key: string]: any;
  };
  consent_time: string;
  expiry?: string;
  freshness_score: number; // 0-1
  co_sign_routes?: Array<{
    route: string; // "guardian_A"
    ts: string;
    ok: boolean;
  }>;
  zk_predicates?: Array<{ // proof hashes only; no raw DOB/labs
    predicate: string; // "age>=50", "in_network"
    ok: boolean;
    proof_hash: string; // "sha256:..."
  }>;
  result: "approve" | "deny";
  reason: "CONSENT_STALE" | "SCOPE_MISMATCH" | "OK" | string;
  proof_hash: string; // "sha256:consent_proof_redacted"
  inputs_hash?: string;
  policy_version?: string;
  anchor_ref?: HealthRDSReceipt['anchor_ref'] | null;
  ts: string;
}

export interface VaultRDSReceipt {
  id: string; // vault_2025_08_21_0100
  type: "Vault-RDS";
  action: "grant" | "revoke" | "legal_hold" | "delete" | "export";
  doc_id: string; // pack:0xABCDEF - evidence pack identifier (hash, not content)
  grant_id?: string; // grant_7_days_provider - optional
  recipient_role?: string; // provider
  ttl_days?: number; // 7
  anchor_ref?: {
    merkle_root: string; // 0x...
    cross_chain_locator: Array<{
      chain_id: string; // "perm-A", "pub-B"
      tx_ref: string; // "0x..."
      ts: number; // Unix timestamp
      anchor_epoch: number;
    }>;
  };
  proof_of_key_shred?: string | null; // sha256:... - present only for delete
  ts: string; // ISO 8601 timestamp
}

export interface SettlementRDSReceipt {
  id: string; // settlement_2025_08_21_0200
  type: "Settlement-RDS";
  offer_lock: {
    navigator_id: string;
    service_type: string; // "second_opinion" | "care_navigation" | "specialist_referral"
    locked_rate: number; // cents
    lock_expiry: string; // ISO timestamp
  };
  attribution_hash: string; // sha256:... - hash of contribution/work proof
  split_tree_hash: string; // sha256:... - deterministic payout split calculation
  approvals: Array<{
    approver_role: string; // "patient" | "provider" | "platform_admin"
    approval_hash: string; // sha256:...
    timestamp: string;
    signature?: string; // optional cryptographic signature
  }>;
  escrow_state: {
    total_amount_cents: number;
    disbursed_amount_cents: number;
    pending_amount_cents: number;
    escrow_account_id: string;
    release_conditions: string[];
  };
  anchor_ref?: {
    merkle_root: string; // 0xROOT
    cross_chain_locator: Array<{
      chain_id: string; // "perm-A", "pub-B"
      tx_ref: string; // "0x..."
      ts: number; // Unix timestamp
      anchor_epoch: number;
    }>;
  };
  ts: string; // ISO 8601 timestamp
}

export interface PARDSReceipt {
  id: string; // pa_2025_08_21_0010
  type: "PA-RDS";
  action: "authorize" | "resubmit" | "appeal" | "withdraw";
  inputs_hash: string; // sha256:... - canonical plan/procedure summary hash
  policy_version: string; // H-2025.08
  result: "approve" | "deny";
  reasons: string[]; // ["EVIDENCE_INCOMPLETE"] - e.g., NOT_COVERED|OUT_OF_NETWORK|EVIDENCE_INCOMPLETE
  missingEvidence?: string[]; // ["last colonoscopy report (CPT 45378)", "GI consult note"]
  disclosures: string[]; // ["minimum-necessary", "purpose:prior_auth"]
  anchor_ref?: {
    merkle_root: string; // 0xROOT
    cross_chain_locator: Array<{
      chain_id: string; // "perm-A", "pub-B"
      tx_ref: string; // "0x..."
      ts: number; // Unix timestamp
      anchor_epoch: number;
    }>;
  };
  ts: string; // ISO 8601 timestamp
}


export type HealthcareReceipt = HealthRDSReceipt | ConsentRDSReceipt | VaultRDSReceipt | PARDSReceipt | SettlementRDSReceipt;

// Helper function to create standardized Health-RDS receipts
export function createHealthRDSReceipt(
  action: HealthRDSReceipt['action'],
  inputs: Record<string, any>,
  result: HealthRDSReceipt['result'],
  reasons: string[],
  disclosures: string[] = [],
  subjectId?: string,
  actorId?: string,
  financial?: HealthRDSReceipt['financial'],
  linked?: HealthRDSReceipt['linked'],
  anchorRef?: HealthRDSReceipt['anchor_ref']
): HealthRDSReceipt {
  // Sanitize inputs to remove PHI
  const sanitizedInputs = { ...inputs };
  delete sanitizedInputs.name;
  delete sanitizedInputs.ssn;
  delete sanitizedInputs.dob;
  delete sanitizedInputs.address;
  delete sanitizedInputs.phone;
  delete sanitizedInputs.email;
  
  // Create SHA256 hash of sanitized inputs
  const inputString = JSON.stringify(sanitizedInputs, Object.keys(sanitizedInputs).sort());
  const inputs_hash = `sha256:${btoa(inputString).substring(0, 16)}`;
  
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `rds_${timestamp}_${randomSuffix}`;
  
  return {
    id,
    type: "Health-RDS",
    action,
    subject_id: subjectId,
    actor_id: actorId,
    inputs_hash,
    policy_version: "H-2025.08",
    reasons,
    result,
    disclosures,
    financial,
    linked,
    anchor_ref: anchorRef,
    ts: new Date().toISOString()
  };
}

// Helper function to create standardized PA-RDS receipts
export function createPARDSReceipt(
  action: PARDSReceipt['action'],
  inputs: Record<string, any>,
  result: PARDSReceipt['result'],
  reasons: string[],
  disclosures: string[] = [],
  missingEvidence?: string[],
  anchorRef?: PARDSReceipt['anchor_ref']
): PARDSReceipt {
  // Sanitize inputs to remove PHI
  const sanitizedInputs = { ...inputs };
  delete sanitizedInputs.name;
  delete sanitizedInputs.ssn;
  delete sanitizedInputs.dob;
  delete sanitizedInputs.address;
  delete sanitizedInputs.phone;
  delete sanitizedInputs.email;
  
  // Create SHA256 hash of sanitized inputs
  const inputString = JSON.stringify(sanitizedInputs, Object.keys(sanitizedInputs).sort());
  const inputs_hash = `sha256:${btoa(inputString).substring(0, 16)}`;
  
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `pa_${timestamp}_${randomSuffix}`;
  
  return {
    id,
    type: "PA-RDS",
    action,
    inputs_hash,
    policy_version: "H-2025.08",
    result,
    reasons,
    missingEvidence,
    disclosures,
    anchor_ref: anchorRef,
    ts: new Date().toISOString()
  };
}

// Helper function to create standardized Consent-RDS receipts
export function createConsentRDSReceipt(
  purposeOfUse: ConsentRDSReceipt['purpose_of_use'],
  scope: ConsentRDSReceipt['scope'],
  result: ConsentRDSReceipt['result'],
  reason: ConsentRDSReceipt['reason'],
  freshnessScore: number = 1.0,
  expiryDays?: number,
  coSignRoutes?: ConsentRDSReceipt['co_sign_routes'],
  zkPredicates?: ConsentRDSReceipt['zk_predicates'],
  anchorRef?: ConsentRDSReceipt['anchor_ref']
): ConsentRDSReceipt {
  const now = new Date();
  const expiry = expiryDays ? new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000) : undefined;
  
  // Generate unique ID
  const timestamp = now.toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `cons_${timestamp}_${randomSuffix}`;
  
  // Generate proof hash
  const proofData = {
    purpose: purposeOfUse,
    scope,
    timestamp: now.toISOString(),
    zk_predicates: zkPredicates
  };
  const proof_hash = `sha256:${btoa(JSON.stringify(proofData)).substring(0, 16)}`;
  
  return {
    id,
    type: "Consent-RDS",
    purpose_of_use: purposeOfUse,
    scope,
    consent_time: now.toISOString(),
    expiry: expiry?.toISOString(),
    freshness_score: freshnessScore,
    co_sign_routes: coSignRoutes,
    zk_predicates: zkPredicates,
    result,
    reason,
    proof_hash,
    anchor_ref: anchorRef,
    ts: now.toISOString()
  };
}

// Helper function to create standardized Vault-RDS receipts
export function createVaultRDSReceipt(
  action: VaultRDSReceipt['action'],
  docId: string,
  grantId?: string,
  recipientRole?: string,
  ttlDays?: number,
  proofOfKeyShred?: string | null,
  anchorRef?: VaultRDSReceipt['anchor_ref']
): VaultRDSReceipt {
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `vault_${timestamp}_${randomSuffix}`;
  
  return {
    id,
    type: "Vault-RDS",
    action,
    doc_id: docId,
    grant_id: grantId,
    recipient_role: recipientRole,
    ttl_days: ttlDays,
    proof_of_key_shred: proofOfKeyShred,
    anchor_ref: anchorRef,
    ts: new Date().toISOString()
  };
}

// Helper function to create standardized Settlement-RDS receipts
export function createSettlementRDSReceipt(
  offerLock: SettlementRDSReceipt['offer_lock'],
  attributionHash: string,
  splitTreeHash: string,
  approvals: SettlementRDSReceipt['approvals'],
  escrowState: SettlementRDSReceipt['escrow_state'],
  anchorRef?: SettlementRDSReceipt['anchor_ref']
): SettlementRDSReceipt {
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `settlement_${timestamp}_${randomSuffix}`;
  
  return {
    id,
    type: "Settlement-RDS",
    offer_lock: offerLock,
    attribution_hash: attributionHash,
    split_tree_hash: splitTreeHash,
    approvals,
    escrow_state: escrowState,
    anchor_ref: anchorRef,
    ts: new Date().toISOString()
  };
}

// Helper function to validate receipt structure
export function validateHealthRDSReceipt(receipt: any): receipt is HealthRDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "Health-RDS" &&
    typeof receipt.action === "string" &&
    typeof receipt.inputs_hash === "string" &&
    receipt.inputs_hash.startsWith("sha256:") &&
    typeof receipt.policy_version === "string" &&
    Array.isArray(receipt.reasons) &&
    typeof receipt.result === "string" &&
    ["approve", "deny"].includes(receipt.result) &&
    Array.isArray(receipt.disclosures) &&
    typeof receipt.ts === "string"
  );
}

// Helper function to validate PA-RDS receipt structure
export function validatePARDSReceipt(receipt: any): receipt is PARDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "PA-RDS" &&
    typeof receipt.action === "string" &&
    typeof receipt.inputs_hash === "string" &&
    receipt.inputs_hash.startsWith("sha256:") &&
    typeof receipt.policy_version === "string" &&
    Array.isArray(receipt.reasons) &&
    typeof receipt.result === "string" &&
    ["approve", "deny"].includes(receipt.result) &&
    Array.isArray(receipt.disclosures) &&
    typeof receipt.ts === "string"
  );
}

// Helper function to validate Vault-RDS receipt structure
export function validateVaultRDSReceipt(receipt: any): receipt is VaultRDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "Vault-RDS" &&
    typeof receipt.action === "string" &&
    ["grant", "revoke", "legal_hold", "delete", "export"].includes(receipt.action) &&
    typeof receipt.doc_id === "string" &&
    typeof receipt.ts === "string"
  );
}

// Helper function to validate Consent-RDS receipt structure
export function validateConsentRDSReceipt(receipt: any): receipt is ConsentRDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "Consent-RDS" &&
    typeof receipt.purpose_of_use === "string" &&
    ["care_coordination", "billing", "legal"].includes(receipt.purpose_of_use) &&
    typeof receipt.scope === "object" &&
    typeof receipt.consent_time === "string" &&
    typeof receipt.freshness_score === "number" &&
    typeof receipt.result === "string" &&
    ["approve", "deny"].includes(receipt.result) &&
    typeof receipt.reason === "string" &&
    typeof receipt.proof_hash === "string" &&
    receipt.proof_hash.startsWith("sha256:") &&
    typeof receipt.ts === "string"
  );
}

// Helper function to validate Settlement-RDS receipt structure
export function validateSettlementRDSReceipt(receipt: any): receipt is SettlementRDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "Settlement-RDS" &&
    typeof receipt.offer_lock === "object" &&
    typeof receipt.offer_lock.navigator_id === "string" &&
    typeof receipt.offer_lock.service_type === "string" &&
    typeof receipt.offer_lock.locked_rate === "number" &&
    typeof receipt.offer_lock.lock_expiry === "string" &&
    typeof receipt.attribution_hash === "string" &&
    receipt.attribution_hash.startsWith("sha256:") &&
    typeof receipt.split_tree_hash === "string" &&
    receipt.split_tree_hash.startsWith("sha256:") &&
    Array.isArray(receipt.approvals) &&
    typeof receipt.escrow_state === "object" &&
    typeof receipt.escrow_state.total_amount_cents === "number" &&
    typeof receipt.escrow_state.escrow_account_id === "string" &&
    Array.isArray(receipt.escrow_state.release_conditions) &&
    typeof receipt.ts === "string"
  );
}