import { setK401Flags } from "@/features/k401/flags";
import { recordReceipt } from "@/features/receipts/store";
import * as Canonical from "@/lib/canonical";

const API_BASE = (import.meta.env.VITE_K401_PDF_BASE || "http://localhost:4000");

function isoNow() { return new Date().toISOString(); }

async function downloadPdfByUrl(url: string, downloadName: string) {
  const resp = await fetch(url);
  const buf  = await resp.arrayBuffer();
  const blob = new Blob([buf], { type: "application/pdf" });
  const a    = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = downloadName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function generateCompliancePack(policyVersion: string) {
  // 1) call server to generate 2 PDFs
  const resp = await fetch(`${API_BASE}/api/k401/pdf/compliance`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ policy_version: policyVersion, brand: { title: "Boutique Family Office" } })
  });
  const json = await resp.json();
  if (!json?.ok) throw new Error(json?.error || "PDF server error");

  // 2) download PDFs (optional convenience for admins)
  for (const art of json.artifacts) {
    await downloadPdfByUrl(`${API_BASE}${art.url}`, `${art.kind}_${policyVersion}.pdf`);
  }

  // 3) record Vault-RDS for artifacts (content-free)
  await recordReceipt({
    receipt_id: `rds_vault_k401_${isoNow()}`,
    type: "Vault-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: `sha256:${await Canonical.sha256Hex(JSON.stringify(json.artifacts))}`,
    artifacts: json.artifacts.map((a: any) => ({ kind: a.kind, hash: a.hash })),
    retention: { policy_id: "ret_7y", delete_stub: null },
    reasons: ["stored_in_worm","k401.compliance.pack.pdf"]
  });

  // 4) record Decision-RDS (generated)
  await recordReceipt({
    receipt_id: `rds_dec_k401_${isoNow()}`,
    type: "Decision-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: "sha256:k401.compliance.pack.pdf",
    action: "k401.compliance.pack.generated",
    reasons: ["ok","pdf"]
  });

  // 5) flag
  setK401Flags({ compliance_pack: true });
}

export async function generateBrokerDemoPack(policyVersion: string) {
  const resp = await fetch(`${API_BASE}/api/k401/pdf/broker`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ policy_version: policyVersion, brand: { title: "Boutique Family Office" } })
  });
  const json = await resp.json();
  if (!json?.ok) throw new Error(json?.error || "PDF server error");

  for (const art of json.artifacts) {
    await downloadPdfByUrl(`${API_BASE}${art.url}`, `${art.kind}_${policyVersion}.pdf`);
  }

  await recordReceipt({
    receipt_id: `rds_vault_k401_demo_${isoNow()}`,
    type: "Vault-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: `sha256:${await Canonical.sha256Hex(JSON.stringify(json.artifacts))}`,
    artifacts: json.artifacts.map((a: any) => ({ kind: a.kind, hash: a.hash })),
    retention: { policy_id: "ret_7y", delete_stub: null },
    reasons: ["stored_in_worm","k401.broker.demo.pdf"]
  });

  await recordReceipt({
    receipt_id: `rds_dec_k401_demo_${isoNow()}`,
    type: "Decision-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: "sha256:k401.broker.demo.pack",
    action: "k401.broker.demo.pack.generated",
    reasons: ["ok","pdf"]
  });

  setK401Flags({ broker_demo_pack: true });
}