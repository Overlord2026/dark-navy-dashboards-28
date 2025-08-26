import { sha256HexBrowser } from "@/features/release/launchTag";

export type AuditRDS = {
  receipt_id: string;                 // rds_audit_<iso>
  type: "Audit-RDS";
  ts: string;
  policy_version?: string;
  prev_audit_hash?: string | null;    // forward-secure chain
  merkle_root: string;                // sha256:...
  accept_n_of_m: { n: number; m: number; accepted: boolean };
  cross_chain_locator?: Array<{ chain: string; txid: string }>;
  acceptance?: { threshold: string; signatures: Array<{ kid: string; sig: string }>; accepted: boolean };
  included_receipts: string[];
  reasons: string[];                  // ["anchor.accepted"] etc.
  env: "dev" | "stage" | "prod";
};

function canonicalJson(obj: any) {
  if (Array.isArray(obj)) return obj.map(canonicalJson);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).sort().reduce((a: any, k) => {
      a[k] = canonicalJson(obj[k]);
      return a;
    }, {});
  }
  return obj;
}

export async function writeAuditRDS(data: Omit<AuditRDS, "receipt_id" | "prev_audit_hash">) {
  // Load previous audit for chaining (use your store if available)
  const prev = window.localStorage.getItem("lastAuditRDS");
  const prevHash = prev ? "sha256:" + await sha256HexBrowser(prev) : null;
  const rds: AuditRDS = {
    ...data,
    prev_audit_hash: prevHash,
    receipt_id: `rds_audit_${new Date().toISOString()}`
  };
  // Persist (content-free)
  window.localStorage.setItem("lastAuditRDS", JSON.stringify(canonicalJson(rds)));
  console.info("[audit] recorded", rds);
  return rds;
}