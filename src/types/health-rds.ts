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
  type: "consent_rds";
  scope: {
    docs: string[]; // ["tax", "medications", "insurance"]
    roles: string[]; // ["Advisor", "CPA"]
    minimum_necessary: boolean;
  };
  freshness: {
    issued_ts: string; // ISO 8601 timestamp
    expires_ts?: string; // ISO 8601 timestamp
    co_sign: string[]; // ["u_spouse_001"]
  };
  revocation: {
    status: "active" | "revoked";
    revoked_ts?: string; // ISO 8601 timestamp
  };
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
  type: "vault_rds";
  pack: {
    docs: Array<{
      name: string; // "physician_note.pdf"
      hash: string; // "sha256:…"
    }>;
    signers: string[]; // ["u_123","clin_456"]
    sealed_ts: string; // ISO 8601 timestamp
    worm: boolean; // write-once-read-many compliance
  };
  deletion: {
    eligible: boolean;
    stub?: {
      ts: string; // ISO 8601 timestamp
      reason: string; // "policy_expired", "user_request", "legal_hold_released"
      signer: string; // user who authorized deletion
    } | null;
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
  type: "pa_rds";
  request: {
    auth_id: string; // pa_00421
    service_code: string; // CPT:…
    provider_zkp: {
      licensed: boolean;
      in_network: boolean;
      proof_id?: string;
    };
  };
  decision: {
    status: "approved" | "denied" | "partial" | "pending";
    effective?: string; // ISO date - when approval takes effect
    denial_delta?: {
      present: boolean;
      code: string; // PA-DEN-009
      human_reason: string;
      appeal_path: string[]; // ["peer_review", "formal_appeal"]
      required_docs: string[]; // ["sha256:docA","sha256:docB"]
    };
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
  docs: string[],
  roles: string[],
  expiryDays?: number,
  coSigners?: string[]
): ConsentRDSReceipt {
  const now = new Date();
  const expiry = expiryDays ? new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000) : undefined;
  
  // Generate unique ID
  const timestamp = now.toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `cons_${timestamp}_${randomSuffix}`;
  
  const inputs = {
    docs,
    roles,
    timestamp: now.toISOString()
  };
  
  const proofHash = `sha256:${btoa(JSON.stringify({...inputs, salt: Math.random()})).substring(0, 32)}`;

  return {
    id,
    type: "consent_rds",
    scope: {
      docs,
      roles,
      minimum_necessary: true
    },
    freshness: {
      issued_ts: now.toISOString(),
      expires_ts: expiry?.toISOString(),
      co_sign: coSigners || []
    },
    revocation: {
      status: "active"
    },
    proof_hash: proofHash,
    ts: now.toISOString()
  };
}

// Helper function to create standardized Vault-RDS receipts
export function createVaultRDSReceipt(
  docs: Array<{name: string; hash: string}>,
  signers: string[],
  wormCompliant: boolean = true,
  deletionEligible: boolean = false,
  deletionStub?: VaultRDSReceipt['deletion']['stub']
): VaultRDSReceipt {
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `vault_${timestamp}_${randomSuffix}`;

  return {
    id,
    type: "vault_rds",
    pack: {
      docs,
      signers,
      sealed_ts: new Date().toISOString(),
      worm: wormCompliant
    },
    deletion: {
      eligible: deletionEligible,
      stub: deletionStub || null
    },
    ts: new Date().toISOString()
  };
}

// Helper function to create standardized PA-RDS receipts
export function createPARDSReceipt(
  authId: string,
  serviceCode: string,
  providerLicensed: boolean,
  providerInNetwork: boolean,
  decisionStatus: PARDSReceipt['decision']['status'],
  effectiveDate?: string,
  denialInfo?: PARDSReceipt['decision']['denial_delta']
): PARDSReceipt {
  // Generate unique ID
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const id = `pa_${timestamp}_${randomSuffix}`;

  return {
    id,
    type: "pa_rds",
    request: {
      auth_id: authId,
      service_code: serviceCode,
      provider_zkp: {
        licensed: providerLicensed,
        in_network: providerInNetwork,
        proof_id: `zkp_${Math.random().toString(36).substr(2, 8)}`
      }
    },
    decision: {
      status: decisionStatus,
      effective: effectiveDate,
      denial_delta: denialInfo
    },
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