import * as Canonical from "@/lib/canonical";

export type RevertTagRDS = {
  receipt_id: string;           // rds_revert_<iso>
  type: "RevertTag-RDS";
  ts: string;
  env: "dev" | "stage" | "prod";
  from_launch_tag: string;      // current tag (before revert)
  to_launch_tag: string;        // tag restored (target snapshot)
  restored_rules_hash: string;  // sha256 of rules JSON after restore
  inputs_hash: string;          // sha256 of canonical summary
  reasons: string[];            // ["revert_ok"] or ["revert_fail",...]
  anchor_ref?: import("./policyPromotion").AnchorRef | null;
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

export async function writeRevertTagRDS(data: Omit<RevertTagRDS, "inputs_hash" | "receipt_id">) {
  const canon = canonicalJson(data);
  const hash = await Canonical.sha256Hex(JSON.stringify(canon));
  const rds: RevertTagRDS = {
    ...data,
    inputs_hash: `sha256:${hash}`,
    receipt_id: `rds_revert_${new Date().toISOString()}`
  };
  // TODO: persist via receipts.record(rds)
  console.info("[revertTag] recorded", rds);
  return rds;
}