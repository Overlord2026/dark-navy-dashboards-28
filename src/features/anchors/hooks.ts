import { recordReceipt } from '@/features/receipts/record';

export async function maybeAnchor(tag: string, hash: string) {
  const on = import.meta.env.VITE_ANCHORS_ENABLED === 'true';
  if (!on) return;
  
  // TODO: call anchorBatch(hash) in production
  const anchorRef = {
    tag,
    merkle_root: hash,
    ts: new Date().toISOString(),
    chain_id: 'demo',
    batch_id: `anchor_${Date.now()}`
  };
  
  console.log(`[Anchor] Anchoring ${tag}: ${hash}`);
  
  // Record anchor receipt (content-free)
  await recordReceipt({
    type: 'Decision-RDS',
    action: `anchor.${tag}`,
    reasons: [hash.slice(0, 16), anchorRef.batch_id],
    anchor_ref: anchorRef,
    created_at: new Date().toISOString()
  } as any);
  
  return anchorRef;
}

export async function generateHash(content: string | Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const data = typeof content === 'string' ? encoder.encode(content) : content;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}