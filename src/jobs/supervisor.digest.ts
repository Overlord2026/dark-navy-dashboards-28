import { getAllSupervisorPrefs } from '@/features/compliance/supervisor/prefs';
import { makeSupervisorDigest, renderDigestTemplate } from '@/features/compliance/supervisor/digest';
import { sendEmail } from '@/features/comms/send';
import { recordReceipt } from '@/features/receipts/record';
import type { JobResult } from './types';

export async function runSupervisorDigest(): Promise<JobResult> {
  try {
    const allPrefs = await getAllSupervisorPrefs();
    const currentHour = new Date().getUTCHours();
    let sent = 0;
    
    // Filter prefs for current hour and enabled
    const activePrefs = allPrefs.filter(pref => 
      pref.enabled && pref.hourUtc === currentHour
    );
    
    const sendEmpty = localStorage.getItem('SUPERVISOR_DIGEST_SEND_EMPTY') === 'true';
    
    for (const pref of activePrefs) {
      // Build digest counts
      const counts = await makeSupervisorDigest(pref.firmId, pref.personas);
      
      // Skip if empty and not configured to send empty
      const isEmpty = counts.exceptions_total === 0 && 
                     counts.guardrails_alerts === 0 && 
                     counts.beneficiary_mismatches === 0;
      
      if (isEmpty && !sendEmpty && !pref.sendEmpty) {
        continue;
      }
      
      // Check throttle (max 1 per 20 hours)
      const lastSentKey = `supervisor_digest_last_${pref.userId}_${pref.firmId}`;
      const lastSent = localStorage.getItem(lastSentKey);
      const twentyHoursAgo = Date.now() - (20 * 60 * 60 * 1000);
      
      if (lastSent && parseInt(lastSent) > twentyHoursAgo) {
        // Log throttled attempt
        await recordReceipt({
          type: 'Comms-RDS',
          channel: 'email',
          template_id: 'supervisor.digest.daily',
          result: 'denied',
          policy_ok: false,
          reasons: ['throttled'],
          created_at: new Date().toISOString()
        } as any);
        continue;
      }
      
      // Render email content
      const date = new Date().toLocaleDateString();
      const subject = `Supervisor Daily Digest — ${date}`;
      const markdown = renderDigestTemplate(counts, date);
      
      // Send email
      const result = await sendEmail({
        to: `supervisor-${pref.userId}@example.com`, // Mock email
        subject,
        markdown
      });
      
      if (result.ok) {
        sent++;
        
        // Update throttle timestamp
        localStorage.setItem(lastSentKey, Date.now().toString());
        
        // Log successful send
        await recordReceipt({
          type: 'Comms-RDS',
          channel: 'email',
          persona: 'supervisor',
          template_id: 'supervisor.digest.daily',
          result: 'sent',
          policy_ok: true,
          created_at: new Date().toISOString()
        } as any);
      }
    }
    
    // Log job summary
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.supervisor.digest.summary',
      reasons: [String(sent)],
      created_at: new Date().toISOString()
    } as any);
    
    return { ok: true, count: sent };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0
    };
  }
}