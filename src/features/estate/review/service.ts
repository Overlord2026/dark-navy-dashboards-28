import { buildReviewPacket } from './builder';
import { recordReceipt } from '@/features/receipts/record';
import type { ReviewSession } from './types';

export async function createReviewSession({
  clientId,
  state,
  docIds,
  createdBy,
  fee
}: {
  clientId: string;
  state: string;
  docIds: string[];
  createdBy: string;
  fee?: { amount: number; currency: 'USD' };
}): Promise<ReviewSession> {
  console.log(`[Review Service] Creating review session for ${clientId}`);
  
  // Build the review packet
  const packet = await buildReviewPacket(clientId, state, docIds);
  
  // TODO: Save packet bytes to Vault
  // In production: await vaultService.store(packet.bytes, { retention: 'permanent' })
  const pdfId = `vault://review_packet_${Date.now()}.pdf`;
  console.log(`[Review Service] Saved packet to ${pdfId}`);
  
  // Record fee if provided
  if (fee?.amount) {
    await recordReceipt({
      type: 'Settlement-RDS',
      purpose: 'attorney_review',
      amount: fee.amount,
      currency: fee.currency,
      created_at: new Date().toISOString()
    } as any);
  }
  
  // Record session creation
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.request',
    reasons: [state, `docs:${docIds.length}`],
    created_at: new Date().toISOString()
  } as any);
  
  const session: ReviewSession = {
    id: crypto.randomUUID(),
    clientId,
    state,
    createdBy,
    createdAt: new Date().toISOString(),
    status: 'requested',
    packet: {
      pdfId,
      sha256: packet.sha256
    },
    fee
  };
  
  console.log(`[Review Service] Created session ${session.id}`);
  return session;
}

export async function assignAttorney(sessionId: string, attorneyUserId: string): Promise<void> {
  console.log(`[Review Service] Assigning attorney ${attorneyUserId} to session ${sessionId}`);
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.assign',
    reasons: [`session:${sessionId}`, `attorney:${attorneyUserId}`],
    created_at: new Date().toISOString()
  } as any);
}

export async function updateSessionStatus(sessionId: string, status: ReviewSession['status']): Promise<void> {
  console.log(`[Review Service] Updating session ${sessionId} status to ${status}`);
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.status_update',
    reasons: [`session:${sessionId}`, status],
    created_at: new Date().toISOString()
  } as any);
}