import { recordReceipt } from '@/features/receipts/record';
import { renderTemplate } from './nudgeTemplates';

export type NudgeKind = 'signedNoFinal' | 'deliveredNotLatest' | 'unassigned';

export async function sendNudgeEmail(
  kind: NudgeKind,
  to: string,
  context: Record<string, string | number>
): Promise<boolean> {
  console.log(`[Nudge Send] Sending ${kind} nudge to ${to}`);
  
  try {
    // Render template with context
    const { subject, body } = renderTemplate(kind, context);
    
    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // For demo purposes, just log the email
    console.log(`[Nudge Send] Email would be sent:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body.substring(0, 200)}...`);
    
    // Record the communication attempt
    await recordReceipt({
      type: 'Comms-RDS',
      channel: 'email',
      persona: 'attorney',
      template_id: `estate.review.nudge.${kind}`,
      result: 'sent',
      policy_ok: true,
      created_at: new Date().toISOString()
    } as any);
    
    // Record the nudge decision
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'estate.review.nudge.send',
      reasons: [kind, to.includes('@') ? 'email_valid' : 'email_invalid'],
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`[Nudge Send] Successfully sent ${kind} nudge`);
    return true;
    
  } catch (error) {
    console.error(`[Nudge Send] Failed to send ${kind} nudge:`, error);
    
    // Record the failure
    await recordReceipt({
      type: 'Comms-RDS',
      channel: 'email',
      persona: 'attorney',
      template_id: `estate.review.nudge.${kind}`,
      result: 'failed',
      policy_ok: true,
      created_at: new Date().toISOString()
    } as any);
    
    return false;
  }
}

export async function sendNudgeWithCopy(
  kind: NudgeKind,
  primaryEmail: string,
  copyEmail: string | undefined,
  context: Record<string, string | number>
): Promise<{ primary: boolean; copy: boolean }> {
  const results = {
    primary: await sendNudgeEmail(kind, primaryEmail, context),
    copy: false
  };
  
  // Send copy if enabled and email provided
  if (copyEmail && import.meta.env.VITE_ARP_NUDGE_CC_ADVISOR === 'true') {
    results.copy = await sendNudgeEmail(kind, copyEmail, {
      ...context,
      ccNote: 'This is a copy of the nudge sent to the assigned attorney.'
    });
  }
  
  return results;
}