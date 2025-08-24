import { getAllSupervisorPrefs } from '@/features/compliance/supervisor/prefs';
import { buildAndSendMonthlyReport } from '@/features/compliance/supervisor/monthlySend';
import { recordReceipt } from '@/features/receipts/record';
import type { JobResult } from './types';

function isMonthlyWindow(day: number, hour: number, prefDay?: number, prefHour?: number): boolean {
  const targetDay = typeof prefDay === 'number' ? prefDay : 1; // Default to 1st day of month
  const targetHour = typeof prefHour === 'number' ? prefHour : 13; // Default to 13:00 UTC
  return day === targetDay && hour === targetHour;
}

export async function runSupervisorMonthly(): Promise<JobResult> {
  try {
    const now = new Date();
    const day = now.getUTCDate();
    const hour = now.getUTCHours();
    
    // Get flag values
    const monthlyDay = parseInt(localStorage.getItem('SUPERVISOR_MONTHLY_DAY_UTC') || '1');
    const monthlyHour = parseInt(localStorage.getItem('SUPERVISOR_MONTHLY_HOUR_UTC') || '13');
    const attachEvidence = localStorage.getItem('SUPERVISOR_MONTHLY_ATTACH_EVIDENCE') === 'true';
    const anchorReports = localStorage.getItem('ANCHOR_ON_MONTHLY_REPORT') === 'true';
    
    let sent = 0;
    
    // Only run on the configured day and hour
    if (!isMonthlyWindow(day, hour, monthlyDay, monthlyHour)) {
      return { ok: true, count: 0 };
    }
    
    const prefs = await getAllSupervisorPrefs();
    
    for (const pref of prefs) {
      // Only send to supervisors who have digest enabled (indicates engagement)
      if (!pref.enabled) continue;
      
      const personas = pref.personas?.length ? pref.personas : 
        ['advisor', 'cpa', 'attorney', 'insurance', 'medicare', 'healthcare', 'realtor'];
      
      // Mock supervisor email (in real app, would get from user profile)
      const to = [`supervisor-${pref.userId}@example.com`];
      
      const result = await buildAndSendMonthlyReport({
        firmId: pref.firmId,
        personas,
        attachEvidence,
        anchor: anchorReports,
        to
      });
      
      sent += result.ok ? result.sent : 0;
    }
    
    // Log job summary
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.supervisor.monthly.summary',
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