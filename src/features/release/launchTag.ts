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

function canonicalJson(obj: any) {
  // string-safe canonicalizer (keys sorted)
  if (Array.isArray(obj)) return obj.map(canonicalJson);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).sort().reduce((acc: any, k: string) => {
      acc[k] = canonicalJson(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}

export async function sha256HexBrowser(data: string): Promise<string> {
  // Web Crypto for browser; node fallback if needed
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder().encode(data);
    const dig = await window.crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(dig)].map(b => b.toString(16).padStart(2,"0")).join("");
  } else {
    const { createHash } = await import("node:crypto");
    return createHash("sha256").update(data, "utf8").digest("hex");
  }
}

export async function writeLaunchTagRDS(summary: Omit<LaunchTagRDS,"inputs_hash"|"receipt_id">) {
  const canon = canonicalJson(summary);
  const hash = await sha256HexBrowser(JSON.stringify(canon));
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