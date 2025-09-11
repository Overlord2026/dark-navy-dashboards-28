import * as Canonical from '@/lib/canonical';

export type AnchorRef = {
  merkle_root: string;
  cross_chain_locator?: Array<{ chain: string; txid: string }>;
  acceptance?: { threshold: string; signatures: Array<{ kid: string; sig: string }> };
};

export type LaunchTagRDS = {
  receipt_id: string;             // e.g., "rds_launch_2025-08-26T12:34:56Z"
  type: "LaunchTag-RDS";
  ts: string;                     // ISO-8601
  policy_version: string;         // e.g., "K-2025.09" or "T-2025.09"
  inputs_hash: string;            // sha256 of canonical summary json
  env: "dev" | "stage" | "prod";
  dry_run: boolean;
  checks: {
    integrity: { pass: boolean; fails?: string[] };
    anchors:   { pass: boolean; fails?: string[] };
    policy?:   { pass: boolean; fails?: string[] };
  };
  reasons: string[];              // e.g., ["integrity_ok","anchors_ok","policy_ok"]
  anchor_ref?: AnchorRef | null;
  launch_tag: string;             // human tag, e.g., "2025.09.0"
};

// Create a reproducible "launch tag" (sha256 of canonicalized payload)
export async function makeLaunchTag(payload: unknown): Promise<string> {
  const json = Canonical.canonicalJson(payload);
  const hex = await Canonical.sha256Hex(json);
  return 'sha256:' + hex;
}

export async function writeLaunchTagRDS(summary: Omit<LaunchTagRDS,"inputs_hash"|"receipt_id">) {
  const canon = Canonical.canonicalJson(summary);
  const hash = await Canonical.sha256Hex(JSON.stringify(canon));
  const rds: LaunchTagRDS = {
    ...summary,
    inputs_hash: `sha256:${hash}`,
    receipt_id: `rds_launch_${new Date().toISOString()}`
  };
  // TODO: persist to your receipts store (localStorage/IndexedDB/API)
  // receipts.record(rds)
  console.info("[launchTag] recorded", rds);
  return rds;
}