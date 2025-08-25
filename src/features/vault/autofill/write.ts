import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor } from '@/features/anchors/hooks';

async function saveToVault(clientId: string, path: string, bytes: Uint8Array): Promise<{ fileId: string }> {
  // TODO: Integrate with actual Vault service (Keep-Safe/WORM)
  const fileId = `vault://${clientId}/${path}`;
  console.log(`[Vault] Saving ${bytes.length} bytes to ${fileId}`);
  
  // In production, this would write to WORM storage
  // await vaultService.writeWORM(fileId, bytes, { retention: 'permanent' });
  
  return { fileId };
}

async function anchorIfEnabled(sha: string): Promise<any | undefined> {
  const enabled = import.meta.env.VITE_VAULT_AUTOFILL_ANCHOR_ON_IMPORT === 'true';
  if (!enabled) return undefined;
  
  // TODO: Integrate with actual anchoring service
  // return await anchorBatch(sha);
  
  const anchorRef = {
    merkle_root: sha,
    timestamp: new Date().toISOString(),
    chain_id: 'demo',
    batch_id: `autofill_${Date.now()}`
  };
  
  console.log(`[Vault] Anchoring ${sha}`);
  return anchorRef;
}

export async function writeAndLog({
  clientId,
  normalizedPath,
  bytes,
  sha256,
  cls,
  source,
  meta
}: {
  clientId: string;
  normalizedPath: string;
  bytes: Uint8Array;
  sha256: string;
  cls: string;
  source: string;
  meta: any;
}) {
  console.log(`[Vault] Writing ${cls} document for client ${clientId}`);
  
  // Save to Vault
  const { fileId } = await saveToVault(clientId, normalizedPath, bytes);
  
  // Log Vault-RDS (content-free)
  await recordReceipt({
    type: 'Vault-RDS',
    action: 'vault_grant',
    files: [fileId],
    grant_type: 'POST',
    reasons: ['file_stored'],
    created_at: new Date().toISOString()
  } as any);
  
  // Log Decision-RDS for ingest (content-free)
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'vault.autofill.ingest',
    reasons: [cls, source, sha256.slice(0, 16)],
    created_at: new Date().toISOString()
  } as any);
  
  // Optional anchoring
  const anchorRef = await maybeAnchor('vault.autofill', sha256);
  
  console.log(`[Vault] Successfully stored ${fileId}${anchorRef ? ' (anchored)' : ''}`);
  
  return { fileId, anchorRef };
}
