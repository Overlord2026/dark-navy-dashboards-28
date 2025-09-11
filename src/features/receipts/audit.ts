import * as Canonical from "@/lib/canonical";

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

const KEY_AUDIT_LIST = "audit.rds.list";       // LIST of summary JSONs
const KEY_AUDIT_LAST = "audit.rds.last";       // fully canonical last JSON

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

export function listAuditRDS(): AuditRDS[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_AUDIT_LIST) || "[]");
  } catch {
    return [];
  }
}

function saveAuditList(list: AuditRDS[]) {
  localStorage.setItem(KEY_AUDIT_LIST, JSON.stringify(list));
}

export async function writeAuditRDS(data: Omit<AuditRDS, "receipt_id" | "prev_audit_hash">) {
  // Load previous audit for chaining (use your store if available)
  const prev = window.localStorage.getItem(KEY_AUDIT_LAST);
  const prevHash = prev ? "sha256:" + await Canonical.sha256Hex(prev) : null;
  const rds: AuditRDS = {
    ...data,
    prev_audit_hash: prevHash,
    receipt_id: `rds_audit_${new Date().toISOString()}`
  };

  // Persist "last" (canonical JSON)
  window.localStorage.setItem(KEY_AUDIT_LAST, JSON.stringify(canonicalJson(rds)));

  // Append to list (top)
  const list = listAuditRDS();
  list.unshift(rds);
  saveAuditList(list);

  console.info("[audit] recorded", rds);
  return rds;
}

export function clearAuditRDS() {
  localStorage.removeItem(KEY_AUDIT_LAST);
  localStorage.removeItem(KEY_AUDIT_LIST);
}