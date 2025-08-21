/**
 * Enhanced Health RDS Receipt Types with updated structure
 * Supports household-based healthcare decisions with multi-persona routing
 */

export interface HealthRouteEntry {
  role: "Retiree" | "Advisor" | "CPA" | "Clinician" | "Plan" | "TPA";
  user_id: string;
  ts: string; // ISO 8601 timestamp
  action: "approve" | "deny" | "accept" | "needs_info";
}

export interface HealthAnchor {
  locator: string; // "n-of-m:eth:0x…|priv:chainA:blk:…"
  batch_root: string; // "merkle:…"
}

export interface HealthRDSReceipt {
  receipt_id: string; // h-2025-08-20-000123
  household_id: string; // hh_7F98…
  persona: "Retiree" | "Advisor" | "CPA" | "Clinician" | "Plan" | "TPA";
  policy_version: string; // hpac_v1.3.2
  inputs_hash: string; // sha256:… (normalized inputs, no raw PHI)
  route: HealthRouteEntry[];
  decision: "approve" | "deny" | "needs_info";
  anchor?: HealthAnchor; // populated post-batch
  lm_hashes?: string[]; // linked materials (orders, EOB pdf hash, etc.)
  created_ts: string; // ISO 8601 timestamp
  signers?: string[]; // co-sign lineage when present
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
    role: string;
    required: boolean;
    signed: boolean;
    timestamp?: string;
  }>;
  proof_hash: string; // sha256:...
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

export interface VaultRDSReceipt {
  id: string; // vault_2025_08_21_0100
  type: "Vault-RDS";
  action: "grant" | "revoke" | "legal_hold" | "delete" | "export";
  doc_id: string; // pack:0xABCDEF - evidence pack identifier (hash, not content)
  grant_id?: string; // grant_7_days_provider
  recipient_role?: string; // provider
  ttl_days?: number; // 7
  anchor_ref?: {
    merkle_root: string; // 0xROOT
    cross_chain_locator: Array<{
      chain_id: string; // "perm-A", "pub-B"
      tx_ref: string; // "0x..."
      ts: number; // Unix timestamp
      anchor_epoch: number;
    }>;
  };
  proof_of_key_shred?: string; // sha256:... (present only for delete action)
  ts: string; // ISO 8601 timestamp
}

export interface PARDSReceipt {
  id: string; // pa_2025_08_21_0010
  type: "PA-RDS";
  request_type: "prior_authorization" | "appeal" | "urgent_review";
  medical_necessity: {
    icd_codes: string[];
    cpt_codes: string[];
    clinical_rationale: string;
    supporting_evidence_hashes: string[];
  };
  decision: "approved" | "denied" | "partial" | "pending";
  decision_rationale: string[];
  review_timeline: {
    submitted_at: string;
    reviewed_at?: string;
    decision_at?: string;
    appeal_deadline?: string;
  };
  financial_impact: {
    estimated_cost_cents: number;
    patient_responsibility_cents: number;
    coverage_determination: string;
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

export type HealthcareReceipt = HealthRDSReceipt | ConsentRDSReceipt | VaultRDSReceipt | PARDSReceipt | SettlementRDSReceipt;

// Helper function to create standardized Health-RDS receipts
export function createHealthRDSReceipt(
  persona: HealthRDSReceipt['persona'],
  householdId: string,
  inputsHash: string,
  routeEntries: HealthRouteEntry[],
  decision: HealthRDSReceipt['decision'],
  linkedMaterials?: string[],
  signers?: string[]
): HealthRDSReceipt {
  // Generate unique receipt ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '-');
  const randomSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const receiptId = `h-${timestamp}-${randomSuffix}`;
  
  return {
    receipt_id: receiptId,
    household_id: householdId,
    persona,
    policy_version: "hpac_v1.3.2",
    inputs_hash: inputsHash,
    route: routeEntries,
    decision,
    lm_hashes: linkedMaterials,
    created_ts: new Date().toISOString(),
    signers
  };
}

// Helper function to create standardized Consent-RDS receipts
export function createConsentRDSReceipt(
  scope: string[],
  purposeOfUse: ConsentRDSReceipt['purpose_of_use'],
  expiryDays?: number,
  coSigner?: string
): ConsentRDSReceipt {
  const now = new Date();
  const expiry = expiryDays ? new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000) : undefined;
  
  // Generate unique ID
  const timestamp = now.toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `cons_${timestamp}_${randomSuffix}`;
  
  const inputs = {
    scope,
    purpose: purposeOfUse,
    timestamp: now.toISOString()
  };
  
  const proofHash = `sha256:${btoa(JSON.stringify({...inputs, salt: Math.random()})).substring(0, 32)}`;

  return {
    id,
    type: "Consent-RDS",
    purpose_of_use: purposeOfUse,
    scope: {
      minimum_necessary: true,
      recipient_role: "provider",
      resources: scope
    },
    consent_time: now.toISOString(),
    expiry: expiry?.toISOString(),
    freshness_score: 1.0, // New consent = fresh
    proof_hash: proofHash,
    ts: now.toISOString(),
    co_sign_routes: coSigner ? [{
      role: coSigner,
      required: true,
      signed: false
    }] : undefined
  };
}

// Helper function to create standardized Vault-RDS receipts
export function createVaultRDSReceipt(
  action: VaultRDSReceipt['action'],
  docId: string,
  grantId?: string,
  recipientRole?: string,
  ttlDays?: number,
  anchorRef?: VaultRDSReceipt['anchor_ref'],
  proofOfKeyShred?: string
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
    anchor_ref: anchorRef,
    proof_of_key_shred: proofOfKeyShred,
    ts: new Date().toISOString()
  };
}

// Helper function to create standardized PA-RDS receipts
export function createPARDSReceipt(
  requestType: PARDSReceipt['request_type'],
  medicalNecessity: PARDSReceipt['medical_necessity'],
  decision: PARDSReceipt['decision'],
  decisionRationale: string[],
  financialImpact: PARDSReceipt['financial_impact'],
  anchorRef?: PARDSReceipt['anchor_ref']
): PARDSReceipt {
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `pa_${timestamp}_${randomSuffix}`;

  const now = new Date();
  const reviewTimeline = {
    submitted_at: now.toISOString(),
    reviewed_at: decision !== 'pending' ? now.toISOString() : undefined,
    decision_at: decision !== 'pending' ? now.toISOString() : undefined,
    appeal_deadline: decision === 'denied' ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
  };

  return {
    id,
    type: "PA-RDS",
    request_type: requestType,
    medical_necessity: medicalNecessity,
    decision,
    decision_rationale: decisionRationale,
    review_timeline: reviewTimeline,
    financial_impact: financialImpact,
    anchor_ref: anchorRef,
    ts: now.toISOString()
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

// Helper function to validate Health-RDS receipt structure
export function validateHealthRDSReceipt(receipt: any): receipt is HealthRDSReceipt {
  return (
    receipt &&
    typeof receipt.receipt_id === "string" &&
    typeof receipt.household_id === "string" &&
    typeof receipt.persona === "string" &&
    typeof receipt.policy_version === "string" &&
    typeof receipt.inputs_hash === "string" &&
    receipt.inputs_hash.startsWith("sha256:") &&
    Array.isArray(receipt.route) &&
    typeof receipt.decision === "string" &&
    typeof receipt.created_ts === "string"
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
    receipt.freshness_score >= 0 && receipt.freshness_score <= 1 &&
    typeof receipt.proof_hash === "string" &&
    receipt.proof_hash.startsWith("sha256:") &&
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

// Helper function to validate PA-RDS receipt structure
export function validatePARDSReceipt(receipt: any): receipt is PARDSReceipt {
  return (
    receipt &&
    typeof receipt.id === "string" &&
    receipt.type === "PA-RDS" &&
    typeof receipt.request_type === "string" &&
    ["prior_authorization", "appeal", "urgent_review"].includes(receipt.request_type) &&
    typeof receipt.medical_necessity === "object" &&
    Array.isArray(receipt.medical_necessity.icd_codes) &&
    Array.isArray(receipt.medical_necessity.cpt_codes) &&
    typeof receipt.decision === "string" &&
    ["approved", "denied", "partial", "pending"].includes(receipt.decision) &&
    Array.isArray(receipt.decision_rationale) &&
    typeof receipt.review_timeline === "object" &&
    typeof receipt.financial_impact === "object" &&
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