import * as Canonical from "@/lib/canonical";
import { listUnanchoredReceipts, updateReceiptAnchorRef } from "@/features/receipts/store";
import { writeAuditRDS } from "@/features/receipts/audit";

export type AnchorRef = {
  merkle_root: string;
  cross_chain_locator?: Array<{ chain: string; txid: string }>;
  acceptance?: { threshold: string; signatures: Array<{ kid: string; sig: string }> };
};

type AnchorProviderResult = {
  merkle_root: string;
  cross_chain_locator: Array<{ chain: string; txid: string }>;
  acceptance: { threshold: string; signatures: Array<{ kid: string; sig: string }>; accepted: boolean };
};

function canonicalJson(obj: any) {
  if (Array.isArray(obj)) return obj.map(canonicalJson);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).sort().reduce((acc: any, k) => {
      acc[k] = canonicalJson(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}

async function merkleRootHex(docHashes: string[]) {
  // Simple pairwise combine using sha256(left + right) hex concatenation (browser-safe)
  if (docHashes.length === 0) return await Canonical.sha256Hex("");
  let layer = [...docHashes];
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const L = layer[i];
      const R = layer[i + 1] ?? L;
      const combined = await Canonical.sha256Hex(L + R);
      next.push(combined);
    }
    layer = next;
  }
  return layer[0];
}

async function anchorProviderSubmit(rootHex: string, opts?: { env?: "dev" | "stage" | "prod" }): Promise<AnchorProviderResult> {
  // STUB: in prod connect to your provider(s)
  const accepted = true;
  const threshold = "2-of-3";
  const signatures = [
    { kid: "validatorA", sig: "base64:A..." },
    { kid: "validatorB", sig: "base64:B..." }
  ];
  const cross_chain_locator = (opts?.env === "prod")
    ? [{ chain: "eth", txid: "0xdeadbeef..." }]
    : [{ chain: "perm", txid: "demo:local" }];
  return {
    merkle_root: `sha256:${rootHex}`,
    cross_chain_locator,
    acceptance: { threshold, signatures, accepted }
  };
}

export type AnchorNowOptions = {
  env: "dev" | "stage" | "prod";
  policy_prefix?: string;             // e.g., "K-" or "T-"
  include_types?: string[];           // e.g., ["LaunchTag-RDS","PolicyPromotion-RDS","RevertTag-RDS"]
  max_batch?: number;                 // safety cap
};

export async function anchorNow(opts: AnchorNowOptions) {
  const types = opts.include_types?.length ? opts.include_types : ["LaunchTag-RDS", "PolicyPromotion-RDS", "RevertTag-RDS", "Advice-RDS", "Trade-RDS", "TLH-RDS", "Location-RDS", "Reconciliation-RDS", "Settlement-RDS", "Audit-RDS"];
  const maxN = opts.max_batch ?? 500;

  // 1) Gather unanchored
  const receipts = (await listUnanchoredReceipts(types)).slice(0, maxN);

  if (receipts.length === 0) {
    return { ok: true, message: "No unanchored receipts found.", count: 0 };
  }

  // 2) Canonicalize and hash each doc to a leaf hash (sha256 of canonical JSON string)
  const leaves: string[] = [];
  for (const r of receipts) {
    const canon = Canonical.canonicalJson(r);
    const h = await Canonical.sha256Hex(JSON.stringify(canon));
    leaves.push(h);
  }

  // 3) Compute Merkle root, call provider, accept K-of-N
  const root = await merkleRootHex(leaves);
  const anchor = await anchorProviderSubmit(root, { env: opts.env });

  // 4) Update each receipt with anchor_ref
  const anchor_ref: AnchorRef = {
    merkle_root: anchor.merkle_root,
    cross_chain_locator: anchor.cross_chain_locator,
    acceptance: { threshold: anchor.acceptance.threshold, signatures: anchor.acceptance.signatures }
  };

  for (const r of receipts) {
    await updateReceiptAnchorRef(r.receipt_id, anchor_ref);
  }

  // 5) Emit Audit-RDS (forward-secure chain handled in writeAuditRDS)
  const audit = await writeAuditRDS({
    type: "Audit-RDS",
    ts: new Date().toISOString(),
    merkle_root: anchor.merkle_root,
    cross_chain_locator: anchor.cross_chain_locator,
    acceptance: anchor.acceptance,
    included_receipts: receipts.map(r => r.receipt_id),
    env: opts.env,
    reasons: [anchor.acceptance.accepted ? "anchor.accepted" : "anchor.rejected"],
    accept_n_of_m: { n: 2, m: 3, accepted: anchor.acceptance.accepted }
  });

  return { ok: anchor.acceptance.accepted, count: receipts.length, merkle_root: anchor.merkle_root, audit_receipt_id: audit.receipt_id };
}