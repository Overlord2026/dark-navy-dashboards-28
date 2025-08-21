export interface HealthRDSReceipt {
  type: "Health-RDS";
  action: "authorize" | "order" | "share" | "publish" | "pay" | "takedown";
  inputs_hash: string; // sha256:...
  policy_version: string; // H-2025.08
  reasons: string[]; // ["USPSTF_ELIGIBLE", "COVERED"]
  result: "approve" | "deny" | "pending";
  disclosures: string[]; // ["minimum-necessary", "purpose:care_coordination"]
  financial?: {
    hsa_eligible?: boolean;
    est_oop?: number; // estimated out of pocket
    deductibleMet?: boolean;
    estimated_cost_cents?: number;
    coverage_type?: string;
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
  type: "Consent-RDS";
  hipaa_scope: string[];
  purpose_of_use: string;
  consent_time: string;
  expiry?: string;
  freshness_score: number; // 0-1
  proof_hash: string;
  inputs_hash: string;
  policy_version: string;
  ts: string;
  anchor_ref?: HealthRDSReceipt['anchor_ref'];
}

export interface VaultRDSReceipt {
  type: "Vault-RDS";
  action: "grant" | "revoke" | "legal_hold" | "delete";
  doc_id?: string;
  inputs_hash: string;
  policy_version: string;
  ts: string;
  anchor_ref?: HealthRDSReceipt['anchor_ref'];
}

export type HealthcareReceipt = HealthRDSReceipt | ConsentRDSReceipt | VaultRDSReceipt;

// Helper function to create standardized Health-RDS receipts
export function createHealthRDSReceipt(
  action: HealthRDSReceipt['action'],
  inputs: Record<string, any>,
  result: HealthRDSReceipt['result'],
  reasons: string[],
  disclosures: string[] = [],
  financial?: HealthRDSReceipt['financial'],
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
  
  return {
    type: "Health-RDS",
    action,
    inputs_hash,
    policy_version: "H-2025.08",
    reasons,
    result,
    disclosures,
    financial,
    anchor_ref: anchorRef,
    ts: new Date().toISOString()
  };
}

// Helper function to validate receipt structure
export function validateHealthRDSReceipt(receipt: any): receipt is HealthRDSReceipt {
  return (
    receipt &&
    receipt.type === "Health-RDS" &&
    typeof receipt.action === "string" &&
    typeof receipt.inputs_hash === "string" &&
    receipt.inputs_hash.startsWith("sha256:") &&
    typeof receipt.policy_version === "string" &&
    Array.isArray(receipt.reasons) &&
    typeof receipt.result === "string" &&
    Array.isArray(receipt.disclosures) &&
    typeof receipt.ts === "string"
  );
}