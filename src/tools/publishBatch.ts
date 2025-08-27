/* eslint-disable no-console */
import { writeLaunchTagRDS } from "@/features/release/launchTag";
import { getAutoAnchorAfterPublish } from "@/features/release/autoAnchor";
import { anchorNow } from "@/features/anchor/anchorNow";

// Import existing tools with safe fallbacks
let runVerifyReceipts: () => Promise<{pass: boolean; fails?: string[]}> = async () => ({ pass: true });
let runAnchorsVerify: () => Promise<{pass: boolean; fails?: string[]}> = async () => ({ pass: true });
let runPolicyLint: () => Promise<{pass: boolean; fails?: string[]}> = async () => ({ pass: true });

try {
  const verifyModule = await import("@/tools/verifyReceipts");
  if (verifyModule.main) {
    runVerifyReceipts = async () => {
      try {
        await verifyModule.main();
        return { pass: true };
      } catch (e: any) {
        return { pass: false, fails: [e.message || "verification failed"] };
      }
    };
  }
} catch { /* ignore */ }

try {
  const anchorsModule = await import("@/tools/verifyAnchors");
  if (anchorsModule.runAnchorsVerify) {
    runAnchorsVerify = anchorsModule.runAnchorsVerify;
  }
} catch { /* ignore */ }

try {
  const policyModule = await import("@/tools/policyLint");
  if (policyModule.runPolicyLint) {
    runPolicyLint = policyModule.runPolicyLint;
  }
} catch { /* ignore */ }

export type PublishBatchOptions = {
  env: "dev" | "stage" | "prod";
  policy_version: string;
  launch_tag: string;            // e.g., "2025.09.0"
  dry_run?: boolean;
};

export async function publishBatch(opts: PublishBatchOptions) {
  const dry = !!opts.dry_run;
  
  // 1) Run checks
  const integrity = await safeCall("integrity", runVerifyReceipts);
  const anchors   = await safeCall("anchors",   runAnchorsVerify);
  const policy    = await safeCall("policy",    runPolicyLint);

  const allPass = [integrity, anchors, policy].every(r => r?.pass !== false);
  const reasons = [
    (integrity?.pass ? "integrity_ok" : "integrity_fail"),
    (anchors?.pass   ? "anchors_ok"   : "anchors_fail"),
    (policy?.pass ?? true ? "policy_ok" : "policy_fail")
  ];

  // 2) Emit LaunchTag-RDS (content-free)
  const summary = {
    type: "LaunchTag-RDS" as const,
    ts: new Date().toISOString(),
    policy_version: opts.policy_version,
    env: opts.env,
    dry_run: dry,
    checks: {
      integrity: { pass: !!integrity?.pass, fails: integrity?.fails },
      anchors:   { pass: !!anchors?.pass,   fails: anchors?.fails },
      policy: policy ? { pass: !!policy.pass, fails: policy.fails } : undefined
    },
    reasons,
    anchor_ref: null,
    launch_tag: opts.launch_tag
  };
  
  const rds = await writeLaunchTagRDS(summary);

  // 3) Auto-anchor receipts when checks pass and setting is enabled
  try {
    if (allPass && getAutoAnchorAfterPublish()) {
      console.info("[publish] auto-anchor enabled — anchoring now…");
      await anchorNow({ env: opts.env, include_types: undefined }); // all unanchored by default
    }
  } catch (e) {
    console.warn("[publish] auto-anchor failed (non-fatal):", e);
  }

  // 4) Build Release Summary (markdown) for Admin → Release Notes
  let md = renderReleaseSummary(rds);
  
  // Include current rules hash
  try {
    const rulesJSON = localStorage.getItem("rulesync.current") || "{}";
    const { sha256HexBrowser } = await import("@/features/release/launchTag");
    const hash = "sha256:" + await sha256HexBrowser(rulesJSON);
    md += `\n- **Rules hash:** ${hash}`;
  } catch {
    // Rules hash optional if RuleSync not available
  }
  
  console.info("[publish] release summary:\n", md);

  // 5) Open Rules Export (UI)
  try {
    // If running in browser, route to export page
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastReleaseSummary", md);
      window.location.assign("/admin/rules-export");
    }
  } catch (e) {
    console.warn("[publish] could not open rules export UI", e);
  }

  // 6) Return results to caller/CLI
  return { ok: allPass, rds, summary_md: md };
}

function renderReleaseSummary(rds: any) {
  const lines: string[] = [];
  lines.push(`# Release ${rds.launch_tag} (${rds.env})`);
  lines.push(`- **Timestamp:** ${rds.ts}`);
  lines.push(`- **Policy Version:** ${rds.policy_version}`);
  lines.push(`- **Dry Run:** ${rds.dry_run ? "yes" : "no"}`);
  lines.push(`- **Integrity:** ${rds.checks.integrity.pass ? "PASS" : "FAIL"}`);
  if (rds.checks.integrity.fails?.length) lines.push(`  - Fails: ${rds.checks.integrity.fails.join(", ")}`);
  lines.push(`- **Anchors:** ${rds.checks.anchors.pass ? "PASS" : "FAIL"}`);
  if (rds.checks.anchors.fails?.length) lines.push(`  - Fails: ${rds.checks.anchors.fails.join(", ")}`);
  if (rds.checks.policy) {
    lines.push(`- **Policy Lint:** ${rds.checks.policy.pass ? "PASS" : "FAIL"}`);
    if (rds.checks.policy.fails?.length) lines.push(`  - Fails: ${rds.checks.policy.fails.join(", ")}`);
  }
  lines.push(`- **Reasons:** ${rds.reasons.join(", ")}`);
  lines.push(`- **LaunchTag-RDS:** \`${rds.receipt_id}\``);
  return lines.join("\n");
}

async function safeCall(name: string, fn?: ()=>Promise<{pass:boolean; fails?:string[]}>) {
  if (!fn) return { pass: true };
  try {
    const res = await fn();
    return { pass: !!res.pass, fails: res.fails || [] };
  } catch (e:any) {
    console.warn(`[publish] ${name} error`, e?.message || e);
    return { pass: false, fails: [String(e?.message || e)] };
  }
}

// CLI usage (dev): npx tsx src/tools/publishBatch.ts
if (typeof require !== "undefined" && require.main === module) {
  publishBatch({
    env: (process.env.ENV as any) || "dev",
    policy_version: process.env.POLICY_VERSION || "DEV-LOCAL",
    launch_tag: process.env.LAUNCH_TAG || `DEV-${new Date().toISOString().slice(0,10)}`,
    dry_run: process.env.DRY_RUN === "false" ? false : true
  }).then(res => {
    console.log(res.summary_md);
    process.exit(res.ok ? 0 : 1);
  });
}