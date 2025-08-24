import { hasConsent, type AutofillScope } from './scopes';
import { classify, normalizeName, computeHash, suggestFolderAndTags, bumpVersion, extractVersionFromName, type DocumentClass } from './classification';
import { writeAndLog } from './write';
import { recordReceipt } from '@/features/receipts/record';
import type { IngestSource, IngestPayload } from './connectors';
import { mapSignal } from '@/features/estate/checklist/mapper';

type DuplicateCheckResult = {
  exists: boolean;
  existingName: string;
  existingVersion: number;
  existingFileId?: string;
};

async function checkDuplicate(clientId: string, sha256: string, cls: DocumentClass): Promise<DuplicateCheckResult> {
  // TODO: Query actual Vault index by hash and document class
  // For now, simulate with local storage check
  
  console.log(`[Vault] Checking for duplicates: ${cls} with hash ${sha256.slice(0, 16)}...`);
  
  // Simulate checking for existing documents
  const exists = Math.random() < 0.1; // 10% chance of duplicate for demo
  
  if (exists) {
    return {
      exists: true,
      existingName: `${cls}-existing-v1.pdf`,
      existingVersion: 1,
      existingFileId: `vault://${clientId}/Estate/2024/${cls}-existing-v1.pdf`
    };
  }
  
  return {
    exists: false,
    existingName: '',
    existingVersion: 0
  };
}

export async function ingest(payload: IngestPayload) {
  console.log(`[Vault Autofill] Ingesting ${payload.fileName} from ${payload.source} for client ${payload.clientId}`);
  
  // 0) Check permissions
  const scopeMap: Record<IngestSource, AutofillScope> = {
    notary: 'estate.notary',
    review: 'estate.review', 
    erecord: 'estate.deeds',
    esign: 'estate.core',
    drive: 'estate.drive',
    email: 'estate.email',
    upload: 'estate.upload'
  };
  
  const requiredScope = scopeMap[payload.source];
  const consentOk = hasConsent(payload.clientId, requiredScope);
  
  if (!consentOk) {
    console.warn(`[Vault Autofill] Consent missing for ${payload.clientId} scope ${requiredScope}`);
    
    // TODO: Add to review queue for manual approval
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'vault.autofill.consent_missing',
      reasons: [requiredScope, payload.source],
      created_at: new Date().toISOString()
    } as any);
    
    return { 
      ok: false, 
      reason: 'consent_missing',
      requiredScope,
      message: `Permission required for ${requiredScope}. Please grant consent in your Vault settings.`
    };
  }
  
  // 1) Classify document
  const classifyMode = (import.meta.env.VITE_VAULT_AUTOFILL_CLASSIFY_MODEL as 'rule' | 'stub-ml') || 'rule';
  const cls = classify(classifyMode, payload.fileName, { ...payload.meta, source: payload.source });
  
  console.log(`[Vault Autofill] Classified as: ${cls}`);
  
  // 2) Compute hash and check for duplicates
  const sha256 = await computeHash(payload.bytes);
  const duplicate = await checkDuplicate(payload.clientId, sha256, cls);
  
  // 3) Generate normalized path
  const { folder, tags } = suggestFolderAndTags(cls, payload.meta || {});
  let normalizedPath = normalizeName(cls, payload.meta || {});
  
  if (duplicate.exists) {
    console.log(`[Vault Autofill] Duplicate detected, creating new version`);
    normalizedPath = bumpVersion(duplicate.existingName, duplicate.existingVersion);
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'vault.autofill.version_bump',
      reasons: [cls, `v${duplicate.existingVersion + 1}`, sha256.slice(0, 16)],
      created_at: new Date().toISOString()
    } as any);
  }
  
  // 4) Write to Vault with receipts and optional anchoring
  const { fileId, anchorRef } = await writeAndLog({
    clientId: payload.clientId,
    normalizedPath,
    bytes: payload.bytes,
    sha256,
    cls,
    source: payload.source,
    meta: payload.meta || {}
  });
  
  // 5) Post-ingest: Update estate checklist (content-free signal)
  try {
    await mapSignal(payload.clientId, {
      type: 'doc.ingested',
      class: cls,
      state: payload.meta?.state,
      hash: sha256,
      fileId
    });
    console.log(`[Vault Autofill] Triggered checklist update for ${cls}`);
  } catch (error) {
    console.warn(`[Vault Autofill] Checklist update failed:`, error);
  }

  if (['Will', 'RLT', 'POA', 'HC_POA', 'AD'].includes(cls)) {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'estate.checklist.update',
      reasons: [cls, 'AUTOFILL'],
      created_at: new Date().toISOString()
    } as any);
  }
  
  // 6) Success response
  console.log(`[Vault Autofill] Successfully ingested ${cls} as ${normalizedPath}`);
  
  return {
    ok: true,
    fileId,
    sha256,
    anchorRef,
    cls,
    normalizedPath,
    folder,
    tags,
    isDuplicate: duplicate.exists,
    version: duplicate.exists ? duplicate.existingVersion + 1 : 1
  };
}