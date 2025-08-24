import { buildReviewPacket } from './builder';
import { recordReceipt } from '@/features/receipts/record';
import type { ReviewSession } from './types';

export async function createReviewSession(options: {
  clientId: string;
  state: string;
  docIds: string[];
  createdBy: string;
  fee?: { amount: number; currency: 'USD' };
}): Promise<ReviewSession> {
  const { clientId, state, docIds, createdBy, fee } = options;

  // Build the review packet PDF
  const packet = await buildReviewPacket(clientId, state, docIds);
  
  // Save PDF to Vault (simplified - in real implementation would use actual vault service)
  const pdfId = `vault://review_packet_${Date.now()}.pdf`;
  
  // Log Settlement-RDS for fee (if applicable)
  if (fee?.amount) {
    await recordReceipt({
      type: 'Settlement-RDS',
      purpose: 'attorney_review',
      amount: fee.amount,
      currency: fee.currency,
      created_at: new Date().toISOString()
    } as any);
  }
  
  // Log Decision-RDS for review request
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.request',
    reasons: [state, `docCount:${docIds.length}`],
    created_at: new Date().toISOString()
  } as any);

  // Create session record
  const session: ReviewSession = {
    id: crypto.randomUUID(),
    clientId,
    state,
    createdBy,
    createdAt: new Date().toISOString(),
    status: 'requested',
    packet: { pdfId, sha256: packet.sha256 },
    fee
  };

  // Store session (simplified - would use actual persistence layer)
  storeReviewSession(session);

  return session;
}

export async function assignReviewSession(
  sessionId: string, 
  attorneyUserId: string
): Promise<void> {
  const session = getReviewSession(sessionId);
  if (!session) throw new Error('Review session not found');

  session.status = 'assigned';
  session.attorneyUserId = attorneyUserId;
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.assign',
    reasons: [session.state, attorneyUserId],
    created_at: new Date().toISOString()
  } as any);

  storeReviewSession(session);
}

export async function signReviewLetter(options: {
  sessionId: string;
  attorneyUserId: string;
  letterPdfId: string;
  letterSha256: string;
}): Promise<void> {
  const { sessionId, attorneyUserId, letterPdfId, letterSha256 } = options;
  const session = getReviewSession(sessionId);
  if (!session) throw new Error('Review session not found');

  session.status = 'signed';
  session.signedLetter = { pdfId: letterPdfId, sha256: letterSha256 };

  // Log Vault-RDS for signed letter
  await recordReceipt({
    type: 'Vault-RDS',
    action: 'store',
    resource_type: 'signed_attorney_letter',
    sha256: letterSha256,
    created_at: new Date().toISOString()
  } as any);

  // Log Decision-RDS for signature
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.sign',
    reasons: [session.state, attorneyUserId],
    created_at: new Date().toISOString()
  } as any);

  storeReviewSession(session);
}

export async function deliverReviewPacket(options: {
  sessionId: string;
  familyUserId: string;
  signedPdfId?: string;
  mergedPdfId?: string;
}): Promise<void> {
  const { sessionId, familyUserId, signedPdfId, mergedPdfId } = options;
  const deliverId = mergedPdfId || signedPdfId;
  const session = getReviewSession(sessionId);
  if (!session) throw new Error('Review session not found');

  // Log Consent-RDS for PRE share
  await recordReceipt({
    type: 'Consent-RDS',
    scope: { 'estate_review_packet': ['pdf'] },
    result: 'approve',
    created_at: new Date().toISOString()
  } as any);

  // Log Comms-RDS for notification
  await recordReceipt({
    type: 'Comms-RDS',
    channel: 'email',
    persona: 'family',
    template_id: 'estate.review.deliver',
    result: 'sent',
    policy_ok: true,
    created_at: new Date().toISOString()
  } as any);

  // Log Decision-RDS for delivery
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.review.deliver',
    reasons: [sessionId, familyUserId],
    created_at: new Date().toISOString()
  } as any);

  session.status = 'delivered';
  const currentVersion = session.finalVersions?.find(v => v.vno === session.currentVno);
  const finalPdfId = currentVersion?.pdfId || signedPdfId;
  session.finalVersions = session.finalVersions || [];

  storeReviewSession(session);
}

// Simplified storage functions (would be replaced with actual database operations)
const reviewSessions = new Map<string, ReviewSession>();

function storeReviewSession(session: ReviewSession): void {
  reviewSessions.set(session.id, { ...session });
}

function getReviewSession(sessionId: string): ReviewSession | null {
  return reviewSessions.get(sessionId) || null;
}

export function getAllReviewSessions(): ReviewSession[] {
  return Array.from(reviewSessions.values());
}

export function getReviewSessionsByStatus(status: ReviewSession['status']): ReviewSession[] {
  return Array.from(reviewSessions.values()).filter(s => s.status === status);
}

export function getStaleReviewSessions(daysOld: number = 10): ReviewSession[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return Array.from(reviewSessions.values()).filter(session => {
    const createdAt = new Date(session.createdAt);
    return createdAt < cutoffDate && session.status !== 'delivered' && session.status !== 'cancelled';
  });
}