import { listReviewSessionsForNudge, getAttorneyEmail, getAdvisorEmailForClient } from '@/features/estate/review/store';
import { sendNudgeWithCopy } from '@/features/estate/review/nudgeSend';
import { recordReceipt } from '@/features/receipts/record';
import type { ReviewSession } from '@/features/estate/review/types';

export async function runArpNudgeWeekly(): Promise<{ ok: boolean; nudgesSent: number; errors: string[] }> {
  console.log('[Job] Starting ARP nudge weekly job');
  
  const enabled = import.meta.env.VITE_ARP_NUDGE_ENABLED === 'true';
  if (!enabled) {
    console.log('[Job] ARP nudges are disabled');
    return { ok: true, nudgesSent: 0, errors: [] };
  }
  
  try {
    const sessions = await listReviewSessionsForNudge();
    let nudgesSent = 0;
    const errors: string[] = [];
    
    console.log(`[Job] Processing ${sessions.length} sessions for nudges`);
    
    for (const session of sessions) {
      try {
        await processSessionNudge(session);
        nudgesSent++;
      } catch (error) {
        const errorMsg = `Failed to nudge session ${session.id}: ${error}`;
        errors.push(errorMsg);
        console.error(`[Job] ${errorMsg}`);
      }
    }
    
    // Log summary
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.arp_nudge.weekly.summary',
      reasons: [`nudges:${nudgesSent}`, `errors:${errors.length}`],
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`[Job] ARP nudge weekly completed: ${nudgesSent} nudges sent, ${errors.length} errors`);
    
    return { ok: true, nudgesSent, errors };
    
  } catch (error) {
    const errorMsg = `ARP nudge job failed: ${error}`;
    console.error(`[Job] ${errorMsg}`);
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.arp_nudge.weekly.error',
      reasons: [String(error)],
      created_at: new Date().toISOString()
    } as any);
    
    return { ok: false, nudgesSent: 0, errors: [errorMsg] };
  }
}

async function processSessionNudge(session: ReviewSession): Promise<void> {
  const now = new Date();
  const createdAt = new Date(session.createdAt);
  const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine nudge type and context
  let nudgeKind: 'signedNoFinal' | 'deliveredNotLatest' | 'unassigned' | null = null;
  let context: Record<string, string | number> = {
    clientName: `Client ${session.clientId}`,
    state: session.state,
    sessionId: session.id
  };
  
  // Check unassigned
  if (session.status === 'requested' && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_UNASSIGNED_DAYS || 5)) {
    nudgeKind = 'unassigned';
    context = {
      ...context,
      createdDate: createdAt.toLocaleDateString(),
      daysPending: daysSinceCreated,
      documentCount: 0 // TODO: get actual doc count
    };
  }
  
  // Check signed but no final
  else if (session.status === 'signed' && !session.finalVersions?.length && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_SIGNED_NO_FINAL_DAYS || 7)) {
    nudgeKind = 'signedNoFinal';
    context = {
      ...context,
      signedDate: createdAt.toLocaleDateString(), // TODO: get actual signed date
      daysPending: daysSinceCreated
    };
  }
  
  // Check delivered not latest
  else if (session.status === 'delivered' && session.deliveredVno !== session.currentVno && daysSinceCreated >= Number(import.meta.env.VITE_ARP_NUDGE_DELIVERED_NOT_LATEST_DAYS || 3)) {
    nudgeKind = 'deliveredNotLatest';
    context = {
      ...context,
      deliveredVersion: session.deliveredVno || 'unknown',
      currentVersion: session.currentVno || 'unknown',
      updateDate: new Date().toLocaleDateString() // TODO: get actual update date
    };
  }
  
  if (!nudgeKind) {
    console.log(`[Job] No nudge needed for session ${session.id}`);
    return;
  }
  
  // Get email addresses
  const attorneyEmail = session.attorneyUserId 
    ? await getAttorneyEmail(session.attorneyUserId)
    : undefined;
  
  const advisorEmail = await getAdvisorEmailForClient(session.clientId);
  
  if (!attorneyEmail) {
    throw new Error(`No attorney email found for session ${session.id}`);
  }
  
  // Send nudge
  const results = await sendNudgeWithCopy(nudgeKind, attorneyEmail, advisorEmail, context);
  
  console.log(`[Job] Sent ${nudgeKind} nudge for session ${session.id}: primary=${results.primary}, copy=${results.copy}`);
}