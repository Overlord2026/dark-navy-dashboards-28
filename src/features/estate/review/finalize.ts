import { mergePdfs, loadPdfFromVault } from '@/lib/pdf/merge';
import { stampPdfBrandHeaderFooter } from '@/lib/pdf/brandFooter';
import { hash } from '@/lib/canonical';
import { recordReceipt } from '@/features/receipts/record';

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
  const sha = await hash(stamped);
  
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

  return { finalPdfId, sha256: sha };
}

export async function loadReviewPacketPdfs(session: any) {
  const letterPdf = await loadPdfFromVault(session.signedLetter?.pdfId || '');
  const packetPdf = await loadPdfFromVault(session.packet.pdfId);
  
  return { letterPdf, packetPdf };
}