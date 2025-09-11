import * as Canonical from "@/lib/canonical";

export type AnchorRef = {
  merkle_root: string;
  cross_chain_locator?: Array<{ chain: string; txid: string }>;
  acceptance?: { threshold: string; signatures: Array<{ kid: string; sig: string }> };
};

export type PolicyPromotionRDS = {
  receipt_id: string;           // rds_policy_promo_<iso>
  type: "PolicyPromotion-RDS";
  ts: string;
  from_policy_version: string;
  to_policy_version: string;
  env: "dev" | "stage" | "prod";
  inputs_hash: string;          // sha256 of canonical summary
  reasons: string[];            // ["promotion_ok"] or ["promotion_denied",...]
  approved_by?: string;         // admin kid (content-free token)
  anchor_ref?: AnchorRef | null;
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

export async function writePolicyPromotionRDS(data: Omit<PolicyPromotionRDS, "inputs_hash" | "receipt_id">) {
  const canon = canonicalJson(data);
  const hash = await Canonical.sha256Hex(JSON.stringify(canon));
  const rds: PolicyPromotionRDS = {
    ...data,
    inputs_hash: `sha256:${hash}`,
    receipt_id: `rds_policy_promo_${new Date().toISOString()}`
  };
  // TODO: persist via receipts.record(rds)
  console.info("[policyPromotion] recorded", rds);
  return rds;
}