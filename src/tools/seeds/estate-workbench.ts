import { recordReceipt } from '@/features/receipts/record';
import analytics from '@/lib/analytics';
import { makeAuthorityGrantPdf } from '@/lib/report/authorityPdf';
import { buildBinderPack } from '@/features/estate/binder';

export async function seedEstateDemo() {
  console.log('🌱 Seeding Estate Workbench demo data...');
  
  analytics.track('demo.e2e.start', { name: 'estate-workbench' });

  // Create authority grants
  const authGrantReceipt = await recordReceipt({
    id: `demo_auth_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'authority.grant',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:auth_${Date.now()}`,
    reasons: ['AUTH_GRANT'],
    created_at: new Date().toISOString(),
  });

  // Generate authority PDF
  const poaPdf = await makeAuthorityGrantPdf({
    role: 'Power of Attorney',
    subject: 'John & Jane Doe',
    minViewUrl: `${window.location.origin}/estate/verify/${authGrantReceipt.id}`,
  });

  const trusteePdf = await makeAuthorityGrantPdf({
    role: 'Trustee',
    subject: 'Doe Family Trust',
    minViewUrl: `${window.location.origin}/estate/verify/${authGrantReceipt.id}`,
  });

  // Store PDFs to demo vault
  const vaultReceipt1 = await recordReceipt({
    id: `demo_vault_auth_${Date.now()}`,
    type: 'Vault-RDS',
    action: 'AUTHORITY_STORE',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:vault_auth_${Date.now()}`,
    reasons: ['AUTH_PDF_STORE'],
    created_at: new Date().toISOString(),
  });

  // Create beneficiary mismatch scenario
  const beneMismatchReceipt = await recordReceipt({
    id: `demo_bene_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'beneficiary.warning',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:bene_${Date.now()}`,
    reasons: ['BENEFICIARY_WARN'],
    created_at: new Date().toISOString(),
  });

  // Create beneficiary fix receipt
  const beneFixReceipt = await recordReceipt({
    id: `demo_bene_fix_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'beneficiary.fix',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:bene_fix_${Date.now()}`,
    reasons: ['BENEFICIARY_FIX'],
    created_at: new Date().toISOString(),
  });

  // Run survivorship analysis
  const survivorshipReceipt = await recordReceipt({
    id: `demo_surv_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'estate.run',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:surv_${Date.now()}`,
    reasons: ['ESTATE_RUN'],
    created_at: new Date().toISOString(),
  });

  // Build and export binder
  const { zip, manifest } = await buildBinderPack({
    clientId: 'demo-client',
  });

  const binderReceipt = await recordReceipt({
    id: `demo_binder_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'estate.binder.export',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:binder_${Date.now()}`,
    reasons: ['BINDER_EXPORT'],
    created_at: new Date().toISOString(),
  });

  const vaultBinderReceipt = await recordReceipt({
    id: `demo_vault_binder_${Date.now()}`,
    type: 'Vault-RDS',
    action: 'BINDER_STORE',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:vault_binder_${Date.now()}`,
    reasons: ['BINDER_ZIP_STORE'],
    created_at: new Date().toISOString(),
  });

  // Optional: Create anchor receipts if ANCHOR_ON_BINDER flag is enabled
  const anchorReceipt = await recordReceipt({
    id: `demo_anchor_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'anchor.batch',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:anchor_${Date.now()}`,
    reasons: ['ANCHOR_BATCH'],
    anchor_ref: {
      merkle_root: 'sha256:demo_anchor_root',
      chain_id: 'demo-chain',
      tx_ref: 'demo-tx-hash',
      timestamp: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  });

  analytics.track('demo.e2e.complete', { name: 'estate-workbench' });

  console.log('✅ Estate Workbench demo data seeded successfully');
  
  return {
    authorities: [
      { role: 'POA', receipt: authGrantReceipt },
      { role: 'Trustee', receipt: authGrantReceipt },
    ],
    beneficiaryAnalysis: {
      warningReceipt: beneMismatchReceipt,
      fixReceipt: beneFixReceipt,
    },
    survivorship: {
      analysisReceipt: survivorshipReceipt,
    },
    binder: {
      manifest,
      binderReceipt,
      vaultReceipt: vaultBinderReceipt,
      anchorReceipt,
    },
  };
}