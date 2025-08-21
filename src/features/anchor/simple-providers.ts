import { AnchorRef } from '../receipts/types';

export async function anchorBatch(root: string): Promise<AnchorRef> {
  return { 
    merkle_root: root, 
    cross_chain_locator: [
      {
        chain_id: 'perm-A',
        tx_ref: '0xabc',
        ts: Date.now() / 1000
      }
    ] 
  };
}

export function acceptNofM(ref: { cross_chain_locator: any[] } | null, n = 1): boolean {
  return (ref?.cross_chain_locator?.length || 0) >= n;
}

export async function anchorsToPermaweb(roots: string[]): Promise<AnchorRef[]> {
  return Promise.all(roots.map(root => anchorBatch(root)));
}

export function validateAnchorRef(ref: AnchorRef): boolean {
  if (!ref) return false;
  if (!ref.merkle_root) return false;
  if (!Array.isArray(ref.cross_chain_locator)) return false;
  
  return ref.cross_chain_locator.every(locator => 
    locator.chain_id && 
    locator.tx_ref && 
    typeof locator.ts === 'number'
  );
}

export function getLatestAnchorTimestamp(ref: AnchorRef): number | null {
  if (!ref?.cross_chain_locator?.length) return null;
  
  return Math.max(...ref.cross_chain_locator.map(loc => loc.ts));
}

export function isAnchorFresh(ref: AnchorRef, maxAgeSeconds = 3600): boolean {
  const latest = getLatestAnchorTimestamp(ref);
  if (!latest) return false;
  
  const ageSeconds = (Date.now() / 1000) - latest;
  return ageSeconds <= maxAgeSeconds;
}