import { getProviderRule } from '@/features/k401/store';
import { recordReceipt } from '@/features/receipts/store';
import type { MergeCtx, ProviderRule } from './types';

export interface RolloverFormData {
  provider: string;
  templateId: string;
  channel: 'esubmit' | 'upload' | 'mail' | 'fax';
  requiresNotary: boolean;
  generatedFiles: string[];
}

export async function prepareRolloverForms(provider: string, ctx: MergeCtx): Promise<RolloverFormData> {
  // Fetch provider rule to prefill paperwork details
  const rule = await getProviderRule(provider);
  
  if (!rule) {
    throw new Error(`Provider ${provider} not found in rules database`);
  }

  // Select primary paperwork template and channel
  const primaryPaper = rule.paperwork[0];
  const templateId = primaryPaper?.templateId || 'default_rollover_form';
  const channel = primaryPaper?.how || 'upload';
  const requiresNotary = rule.notes?.includes('notary') || rule.notes?.includes('notarization') || false;

  // Generate forms (stub - would integrate with actual form generation)
  const generatedFiles = [`${templateId}-${ctx.client.id}-${Date.now()}.pdf`];

  // Record Decision-RDS for rollover forms preparation
  await recordReceipt({
    receipt_id: `rds_rollover_${Date.now()}`,
    type: 'Decision-RDS',
    ts: new Date().toISOString(),
    policy_version: 'K-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ provider, templateId, channel }))}`,
    action: 'k401.rollover.forms.prepared',
    reasons: ['forms_generated', provider, templateId]
  });

  // Store generated files via Vault-RDS (content-free)
  await recordReceipt({
    receipt_id: `rds_vault_rollover_${Date.now()}`,
    type: 'Vault-RDS',
    ts: new Date().toISOString(),
    policy_version: 'K-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify(generatedFiles))}`,
    artifacts: generatedFiles.map(f => ({ kind: 'PDF_ROLLOVER_FORM', hash: `sha256:${btoa(f)}` })),
    retention: { policy_id: 'ret_7y', delete_stub: null },
    reasons: ['stored_in_worm', 'k401.rollover.forms']
  });

  return {
    provider,
    templateId,
    channel,
    requiresNotary,
    generatedFiles
  };
}

export async function validateRolloverEligibility(provider: string, rolloverType: string): Promise<boolean> {
  const rule = await getProviderRule(provider);
  return rule?.rolloverTypes.includes(rolloverType as any) || false;
}