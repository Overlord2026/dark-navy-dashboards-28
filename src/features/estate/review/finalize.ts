import { mergePdfs, loadPdfFromVault } from '@/lib/pdf/merge';
import { stampPdfBrandHeaderFooter } from '@/lib/pdf/brandFooter';
import * as Canonical from '@/lib/canonical';
import { recordReceipt } from '@/features/receipts/record';
import type { FinalVersion } from './types';
import { onReviewFinalReady } from '@/features/vault/autofill/connectors';
import { mapSignal } from '@/features/estate/checklist/mapper';

export async function loadReviewPacketPdfs(session: any) {
  const letterPdf = await loadPdfFromVault(session.signedLetter?.pdfId || '');
  const packetPdf = await loadPdfFromVault(session.packet.pdfId);
  
  return { letterPdf, packetPdf };
}

export async function finalizeReviewPacket({
  sessionId,
  clientId,
  letterPdf,
  packetPdf,
  footerTag,
  anchor = false
}: {
  sessionId: string;
  clientId: string;
  letterPdf: Uint8Array;
  packetPdf: Uint8Array;
  footerTag: string;
  anchor?: boolean;
}) {
  console.log(`[ARP] Finalizing review packet for session ${sessionId}`);

  // 1) Merge Letter + Review Packet
  const merged = await mergePdfs([letterPdf, packetPdf]);

  // 2) Brand stamp with navy header + gold line + footer
  const stamped = await stampPdfBrandHeaderFooter(merged, {
    brandNavy: '#0B1E33',
    brandGold: '#D4AF37',
    footerTag
  });

  // 3) Hash for integrity and optional anchor
  const sha = await Canonical.hash(stamped);
  
  // 4) Save to Vault (WORM)
  const finalPdfId = `vault://review_final_${sessionId}_${Date.now()}.pdf`;
  // In production: await vaultService.store(stamped, { retention: 'permanent' })
  console.log(`[ARP] Saved final packet to ${finalPdfId}`);

  // 5) Log Decision-RDS for merge action
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.merged',
    reasons: [`session:${sessionId}`, sha],
    created_at: new Date().toISOString()
  } as any);

  // 6) Optional anchor
  if (anchor) {
    const anchorRef = { 
      merkle_root: sha, 
      timestamp: new Date().toISOString(),
      batch_id: `arp_${sessionId}`
    };
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'estate.review.anchor',
      reasons: [`session:${sessionId}`, sha],
      anchor_ref: anchorRef,
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`[ARP] Anchored final packet: ${sha}`);
    return { finalPdfId, sha256: sha, anchor_ref: anchorRef };
  }

  // 7) Log Vault-RDS for final packet storage
  await recordReceipt({
    type: 'Vault-RDS',
    action: 'vault_grant',
    files: [finalPdfId],
    grant_type: 'POST',
    reasons: ['meeting_artifacts'],
    created_at: new Date().toISOString()
  } as any);

  // 8) Trigger auto-populate (if enabled)
  try {
    await onReviewFinalReady(sessionId, clientId, finalPdfId);
  } catch (error) {
    console.warn('[ARP] Auto-populate failed:', error);
  }

  // 9) Trigger checklist update
  try {
    await mapSignal(clientId, {
      type: 'arp.final.created',
      hash: sha,
      fileId: finalPdfId
    });
  } catch (error) {
    console.warn('[ARP] Checklist update failed:', error);
  }

  return { finalPdfId, sha256: sha };
}

// Compute a stable hash of build-inputs for change detection
export async function computeReviewInputsHash({
  clientId,
  state,
  letterSha256,
  packetSha256,
  checklistState
}: {
  clientId: string;
  state: string;
  letterSha256: string;
  packetSha256: string;
  checklistState: any; // serialize minimal shape (IDs + pass/fail booleans, not PII)
}) {
  return await Canonical.hash({ 
    clientId, 
    state, 
    letterSha256, 
    packetSha256, 
    checklist: checklistState, 
    tsFloor: Math.floor(Date.now() / 60000) 
  });
}

// Create a new version entry
export function makeFinalVersion({
  previous,
  pdfId,
  sha256,
  anchor_ref,
  builtBy,
  reason
}: {
  previous?: FinalVersion[];
  pdfId: string;
  sha256: string;
  anchor_ref?: any;
  builtBy: string;
  reason?: string;
}): FinalVersion[] {
  const vno = (previous?.[previous.length - 1]?.vno || 0) + 1;
  const entry: FinalVersion = { 
    vno, 
    pdfId, 
    sha256, 
    anchor_ref, 
    builtAt: new Date().toISOString(), 
    builtBy, 
    reason 
  };
  return [...(previous || []), entry];
}
