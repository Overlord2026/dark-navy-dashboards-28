import type { ReviewSession } from './types';

// Simple in-memory store - in production would use database
const sessionStore = new Map<string, ReviewSession>();

export async function saveReviewSession(session: ReviewSession): Promise<void> {
  sessionStore.set(session.id, { ...session });
  console.log(`[Review Store] Saved session ${session.id}`);
}

export async function getReviewSession(sessionId: string): Promise<ReviewSession | undefined> {
  const session = sessionStore.get(sessionId);
  if (session) {
    console.log(`[Review Store] Retrieved session ${sessionId}`);
  }
  return session;
}

export async function listReviewSessions(): Promise<ReviewSession[]> {
  return Array.from(sessionStore.values());
}

export async function listReviewSessionsByClient(clientId: string): Promise<ReviewSession[]> {
  return Array.from(sessionStore.values()).filter(s => s.clientId === clientId);
}

export async function listReviewSessionsByAttorney(attorneyUserId: string): Promise<ReviewSession[]> {
  return Array.from(sessionStore.values()).filter(s => s.attorneyUserId === attorneyUserId);
}

export async function deleteReviewSession(sessionId: string): Promise<boolean> {
  const existed = sessionStore.has(sessionId);
  sessionStore.delete(sessionId);
  console.log(`[Review Store] Deleted session ${sessionId}: ${existed}`);
  return existed;
}

// Nudge-specific queries
export async function listReviewSessionsForNudge(): Promise<ReviewSession[]> {
  const sessions = Array.from(sessionStore.values());
  const now = new Date();
  
  return sessions.filter(session => {
    // Check various nudge conditions
    const createdAt = new Date(session.createdAt);
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Unassigned for too long
    if (session.status === 'requested' && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_UNASSIGNED_DAYS || 5)) {
      return true;
    }
    
    // Signed but no final packet
    if (session.status === 'signed' && !session.finalVersions?.length && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_SIGNED_NO_FINAL_DAYS || 7)) {
      return true;
    }
    
    // Delivered not latest
    if (session.status === 'delivered' && session.deliveredVno !== session.currentVno && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_DELIVERED_NOT_LATEST_DAYS || 3)) {
      return true;
    }
    
    return false;
  });
}

export async function getAttorneyEmail(userId: string): Promise<string | undefined> {
  // TODO: In production, query user database
  console.log(`[Review Store] Getting email for attorney ${userId}`);
  return `attorney.${userId}@example.com`;
}

export async function getAdvisorEmailForClient(clientId: string): Promise<string | undefined> {
  // TODO: In production, query advisor-client relationships
  console.log(`[Review Store] Getting advisor email for client ${clientId}`);
  return `advisor.${clientId}@example.com`;
}

export function getSessionCount(): number {
  return sessionStore.size;
}