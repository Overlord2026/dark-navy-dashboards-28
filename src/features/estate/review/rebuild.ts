import { finalizeReviewPacket, makeFinalVersion } from './finalize';
import { recordReceipt } from '@/features/receipts/record';
import type { ReviewSession, FinalVersion } from './types';

export async function rebuildFinalPacket({
  session,
  clientId,
  letterBytes,
  packetBytes,
  footerTag,
  builtBy,
  reason,
  anchor = false
}: {
  session: ReviewSession;
  clientId: string;
  letterBytes: Uint8Array;
  packetBytes: Uint8Array;
  footerTag: string;
  builtBy: string;
  reason: string;
  anchor?: boolean;
}): Promise<ReviewSession> {
  console.log(`[ARP] Rebuilding final packet for session ${session.id}, reason: ${reason}`);

  // Build new final
  const result = await finalizeReviewPacket({
    sessionId: session.id,
    clientId,
    letterPdf: letterBytes,
    packetPdf: packetBytes,
    footerTag,
    anchor
  });

  // Append version & mark current
  const updatedSession = {
    ...session,
    finalVersions: makeFinalVersion({ 
      previous: session.finalVersions, 
      pdfId: result.finalPdfId, 
      sha256: result.sha256, 
      anchor_ref: result.anchor_ref, 
      builtBy, 
      reason 
    }),
    status: 'merged' as const
  };

  updatedSession.currentVno = updatedSession.finalVersions[updatedSession.finalVersions.length - 1].vno;

  // Receipt for rebuild
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.rebuild',
    reasons: [`session:${session.id}`, `v:${updatedSession.currentVno}`, result.sha256],
    created_at: new Date().toISOString()
  } as any);

  console.log(`[ARP] Rebuilt final packet v${updatedSession.currentVno}`);
  return updatedSession;
}

// Switch current to a prior version (admin/attorney only)
export function setCurrentVersion(session: ReviewSession, vno: number): ReviewSession | null {
  if (!session.finalVersions?.some(v => v.vno === vno)) {
    console.warn(`[ARP] Version ${vno} not found in session ${session.id}`);
    return null;
  }

  const updatedSession = {
    ...session,
    currentVno: vno
  };

  recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.version.set_current',
    reasons: [`session:${session.id}`, `v:${vno}`],
    created_at: new Date().toISOString()
  } as any);

  console.log(`[ARP] Set current version to v${vno} for session ${session.id}`);
  return updatedSession;
}