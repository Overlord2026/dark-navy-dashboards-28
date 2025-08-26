import { recordReceipt } from '@/features/receipts/record';

async function saveToVault(path: string, blob: Blob) {
  // TODO: call your Vault upload API; this stub forces a download for now
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = path.split('/').pop() || 'doc.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  
  // Log a Vault-RDS pointer (content-free)
  await recordReceipt({ 
    type: 'Vault-RDS', 
    bucket: 'Keep-Safe', 
    file_id: `vault://${path}`, 
    created_at: new Date().toISOString() 
  } as any);
  
  return { fileId: `vault://${path}` };
}

export async function generateCompliancePack(org = 'BFO') {
  const now = new Date().toISOString().slice(0, 10);

  // Page 1: ERISA/PTE 2020-02 Overview (text → PDF later)
  const erisaText = [
    `${org} — ERISA & PTE 2020-02 (Rollovers) — Overview`,
    '',
    'Roles: ERISA §3(21) (advice) and §3(38) (discretion).',
    'PTE 2020-02 requirements: best interest; disclose services/conflicts/costs; document prudence; adopt mitigation policies; retrospective review.',
    'How platform helps: Rollover Studio → Fee/Service Comparison; Advice Summary PDF; provider forms; WORM Vault; optional anchors; IPS & cost gates.',
    'Audit Kit: single export with Advice Summary, receipts list (hashes), no PII.',
    'Advisor checklist: appointment & IPS in Vault; fee compare + rationale; disclosures; submit forms; supervisory checks; annual review; content-free receipts.'
  ].join('\n');
  
  const erisaBlob = new Blob([erisaText], { type: 'text/plain' });
  const erisaPath = `Compliance/${now}/K401_ERISA_PTE2002.txt`;
  const { fileId: erisaFileId } = await saveToVault(erisaPath, erisaBlob);

  // Page 2: Crypto Policy Memo (text → PDF later)
  const cryptoText = [
    `${org} — Crypto Policy Memo (custody, suitability, estate, tax, controls)`,
    '',
    'Custody tracks: custodial/CEX (scoped APIs) and self-custody (watch-only). No private keys stored.',
    'Suitability: high volatility; stablecoin/counterparty risk; income products flagged; disclosures; asset whitelist; USD caps; 2-of-N approvals; address allowlists.',
    'Estate: directives map wallets/sub-accounts; executor runbook in Vault; Include-in-estate button.',
    'Tax: cost-basis/8949; staking/yield flagged. Receipts: content-free; Vault WORM; optional anchors.'
  ].join('\n');
  
  const cryptoBlob = new Blob([cryptoText], { type: 'text/plain' });
  const cryptoPath = `Compliance/${now}/Crypto_Policy_Memo.txt`;
  const { fileId: cryptoFileId } = await saveToVault(cryptoPath, cryptoBlob);

  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'compliance.pack.generated', 
    reasons: [erisaPath, cryptoPath], 
    created_at: new Date().toISOString() 
  } as any);

  // mark flag for checklist auto-detection
  localStorage.setItem('k401.compliancePack.ready', 'true');
  localStorage.setItem('k401.compliancePack.date', now);

  return { erisaFileId, cryptoFileId };
}

export async function generateBrokerDemoPack(org = 'BFO') {
  const now = new Date().toISOString().slice(0, 10);
  const demoScript = [
    `${org} — 30-Min Broker Demo Script`,
    '1) Opening: Control Plane (Connect · Optimize · Advise · Trade · Rollover · Audit).',
    '2) Pain: fragmented plans, under-match, fee drag, stalled rollovers.',
    '3) Family view: link plan; full-match guardrail; Roadmap probability.',
    '4) Advisor book: risk flags; bulk nudges; receipts (content-free).',
    '5) Rollover Studio: PTE 2020-02 Fee/Service Comparison + Advice Summary + forms → Vault; optional anchors.',
    '6) SDBA (optional): explainable model, policy gates.',
    '7) KPIs: match capture ↑; fee drag ↓; rollover cycle ↓; success probability ↑.',
    '8) Close: schedule pilot; 2-week proof-of-value.'
  ].join('\n');

  const demoBlob = new Blob([demoScript], { type: 'text/plain' });
  const demoPath = `Broker/${now}/Broker_Demo_30min.txt`;
  const { fileId: demoFileId } = await saveToVault(demoPath, demoBlob);

  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'broker.demo.pack', 
    reasons: [demoPath], 
    created_at: new Date().toISOString() 
  } as any);

  // mark flag for checklist auto-detection
  localStorage.setItem('k401.brokerDemoPack.ready', 'true');
  localStorage.setItem('k401.brokerDemoPack.date', now);

  return { demoFileId };
}