import { recordReceipt } from '@/features/receipts/record';
import { sendNudgeEmail } from '@/features/estate/review/nudgeSend';

export async function bulkInviteConsent(rows: string[]) {
  let sent = 0;
  for (const id of rows) {
    // TODO: send invite consent email to clientId "id"
    sent++;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'console.bulk.invite_consent', 
    reasons: [`count:${sent}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { sent };
}

export async function bulkNudgeSignedNoFinal(rows: string[]) {
  let sent = 0;
  for (const id of rows) {
    // TODO: lookup attorney email for clientId "id" and current session; then:
    // await sendNudgeEmail('signedNoFinal', toEmail, { sessionId, vCurrent, vDelivered, days:0 });
    sent++;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'console.bulk.nudge_signed_no_final', 
    reasons: [`count:${sent}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { sent };
}

export async function bulkNudgeDeliveredNotLatest(rows: string[]) {
  let sent = 0;
  for (const id of rows) {
    // TODO: lookup attorney email for clientId "id" and current session; then:
    // await sendNudgeEmail('deliveredNotLatest', toEmail, { sessionId, vCurrent, vDelivered, days:0 });
    sent++;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'console.bulk.nudge_delivered_not_latest', 
    reasons: [`count:${sent}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { sent };
}

export async function bulkRequestDeed(rows: string[]) {
  let ok = 0;
  for (const id of rows) {
    // In UI we navigate to deed request; for bulk, you can enqueue internal tasks or just log for now:
    ok++;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'console.bulk.request_deed', 
    reasons: [`count:${ok}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { ok };
}

export async function bulkRecompute(rows: string[]) {
  let ok = 0;
  for (const id of rows) {
    // TODO: trigger checklist recompute for clientId "id"
    ok++;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'console.bulk.recompute', 
    reasons: [`count:${ok}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { ok };
}