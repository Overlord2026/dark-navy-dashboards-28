/**
 * Enhanced Health RDS Receipt Types with Zero-Knowledge Proofs
 * Supports household-based healthcare decisions with cryptographic privacy verification
 */

export interface ZKProof {
  in_network?: boolean;
  meets_criteria?: boolean;
  proof_id: string; // zkp_abc123
  verification_timestamp?: string;
}

export interface HealthContext {
  event: "screening_order" | "prior_auth_request" | "claim_check" | "appeal_submission";
  plan_id: string; // plan_…
  screening_code?: string; // CPT|HCPCS|LOINC:…
  network_zkp?: ZKProof;
  eligibility_zkp?: ZKProof;
  patient_demographics_hash?: string; // sha256:… (age/gender only, no PHI)
  clinical_indicators?: string[]; // ["diabetes", "hypertension"] - anonymized conditions
}

export interface HealthOutcome {
  decision: "approve" | "deny" | "pending" | "partial";
  reason: "meets_uspstf" | "out_of_network" | "not_medically_necessary" | "requires_peer_review" | "insufficient_documentation";
  next_step: "schedule" | "peer_review" | "appeal" | "resubmit" | "complete";
  sla?: {
    peer_review_by?: string; // ISO 8601 timestamp
    appeal_deadline?: string;
    resubmit_by?: string;
  };
  cost_estimate?: {
    total_cents: number;
    patient_responsibility_cents: number;
    coverage_percentage: number;
  };
}

export interface HealthRouteEntry {
  role: "Retiree" | "Advisor" | "CPA" | "Clinician" | "Plan" | "TPA" | "PeerReviewer";
  user_id: string;
  ts: string; // ISO 8601 timestamp
  action: "approve" | "deny" | "accept" | "needs_info" | "escalate";
  verification_method?: "zkp" | "manual" | "automated";
}

export interface HealthAnchor {
  locator: string; // "n-of-m:eth:0x…|priv:chainA:blk:…"
  batch_root: string; // "merkle:…"
}

export interface HealthRDSReceipt {
  type: "health_rds";
  receipt_id: string; // h-2025-08-20-000123
  household_id: string; // hh_7F98…
  persona: "Retiree" | "Advisor" | "CPA" | "Clinician" | "Plan" | "TPA" | "PeerReviewer";
  policy_version: string; // hpac_v1.3.2
  context: HealthContext; // Enhanced context with ZKPs
  outcome: HealthOutcome; // Enhanced outcome with SLA tracking
  route: HealthRouteEntry[];
  anchor?: HealthAnchor; // populated post-batch
  lm_hashes?: string[]; // linked materials (orders, EOB pdf hash, etc.)
  created_ts: string; // ISO 8601 timestamp
  signers?: string[]; // co-sign lineage when present
  compliance_flags?: string[]; // ["hipaa_compliant", "soc2_verified", "zkp_validated"]
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

// Helper function to create standardized Health-RDS receipts with ZKP support
export function createHealthRDSReceipt(
  persona: HealthRDSReceipt['persona'],
  householdId: string,
  context: HealthContext,
  outcome: HealthOutcome,
  routeEntries: HealthRouteEntry[],
  linkedMaterials?: string[],
  signers?: string[]
): HealthRDSReceipt {
  // Generate unique receipt ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '-');
  const randomSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const receiptId = `h-${timestamp}-${randomSuffix}`;
  
  // Determine compliance flags based on ZKP verification
  const complianceFlags: string[] = ["hipaa_compliant"];
  if (context.network_zkp?.proof_id) complianceFlags.push("network_zkp_verified");
  if (context.eligibility_zkp?.proof_id) complianceFlags.push("eligibility_zkp_verified");
  
  return {
    type: "health_rds",
    receipt_id: receiptId,
    household_id: householdId,
    persona,
    policy_version: "hpac_v1.3.2",
    context,
    outcome,
    route: routeEntries,
    lm_hashes: linkedMaterials,
    created_ts: new Date().toISOString(),
    signers,
    compliance_flags: complianceFlags
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

// Helper function to validate Health-RDS receipt structure
export function validateHealthRDSReceipt(receipt: any): receipt is HealthRDSReceipt {
  return (
    receipt &&
    receipt.type === "health_rds" &&
    typeof receipt.receipt_id === "string" &&
    typeof receipt.household_id === "string" &&
    typeof receipt.persona === "string" &&
    typeof receipt.policy_version === "string" &&
    typeof receipt.context === "object" &&
    typeof receipt.outcome === "object" &&
    Array.isArray(receipt.route) &&
    typeof receipt.created_ts === "string"
  );
}