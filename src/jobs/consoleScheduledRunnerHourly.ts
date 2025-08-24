import { listAllTenantIds } from '@/features/tenant/context';
import { loadConsoleJobs, upsertConsoleJob, ConsoleJobSpec } from '@/features/estate/console/jobs';
import { listPortfolio } from '@/features/estate/console/data';
import { recordReceipt } from '@/features/receipts/record';
import analytics from '@/lib/analytics';
import { bulkInviteConsent, bulkNudgeSignedNoFinal, bulkNudgeDeliveredNotLatest, bulkRecompute, bulkRequestDeed } from '@/features/estate/console/bulk';

type FilterKey = 'CONSENT_MISSING'|'SIGNED_NO_FINAL'|'DELIVERED_NOT_LATEST'|'TRUST_NO_DEED'|'HEALTH_INCOMPLETE';

function minutesSince(iso?: string) { 
  return iso ? Math.floor((Date.now() - Date.parse(iso)) / (60*1000)) : Infinity; 
}

function dueByCadence(j: ConsoleJobSpec) {
  const mins = minutesSince(j.lastRunAt);
  if (j.cadence === 'weekly') return mins >= 7*24*60;
  if (j.cadence === 'monthly') return mins >= 28*24*60;
  if (j.cadence === 'once') return !j.lastRunAt;
  return false;
}

function pickByFilter(rows: any[], f: FilterKey) {
  return rows.filter(r => {
    const fl = r.flags || {};
    if (f === 'CONSENT_MISSING') return !!fl.consentMissing;
    if (f === 'SIGNED_NO_FINAL') return !!fl.signedNoFinal;
    if (f === 'DELIVERED_NOT_LATEST') return !!fl.deliveredNotLatest;
    if (f === 'TRUST_NO_DEED') return !!fl.trustWithoutDeed;
    if (f === 'HEALTH_INCOMPLETE') return !!fl.healthIncomplete;
    return false;
  }).map(r => r.clientId);
}

async function runTenantJobs(tenantId: string) {
  const jobs = loadConsoleJobs(tenantId).filter(j => j.enabled !== false);
  if (!jobs.length) return { ran: 0, updated: 0 };
  const rows = await listPortfolio(tenantId);

  let ran = 0, updated = 0;
  for (const j of jobs) {
    if (!dueByCadence(j)) continue;
    const cohort = pickByFilter(rows, j.filter as FilterKey);
    let count = 0;
    if (cohort.length) {
      if (j.kind === 'invite_consent') count = (await bulkInviteConsent(cohort)).sent ?? cohort.length;
      else if (j.kind === 'nudge_signed_no_final') count = (await bulkNudgeSignedNoFinal(cohort)).sent ?? cohort.length;
      else if (j.kind === 'nudge_delivered_not_latest') count = (await bulkNudgeDeliveredNotLatest(cohort)).sent ?? cohort.length;
      else if (j.kind === 'recompute') count = (await bulkRecompute(cohort)).ok ?? cohort.length;
      else if (j.kind === 'request_deed') count = (await bulkRequestDeed(cohort)).ok ?? cohort.length;
    }
    // Update lastRunAt even if cohort is empty
    j.lastRunAt = new Date().toISOString();
    upsertConsoleJob(j);
    ran++; updated++;
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.console.scheduled.hourly.run',
      reasons: [`tenant:${tenantId}`, `job:${j.id}`, `kind:${j.kind}`, `filter:${j.filter}`, `cadence:${j.cadence}`, `count:${count}`],
      created_at: new Date().toISOString()
    } as any);
    analytics.track('job.console.scheduled.hourly.run', { 
      tenantId, 
      jobId: j.id, 
      kind: j.kind, 
      filter: j.filter, 
      cadence: j.cadence, 
      count 
    });
  }
  return { ran, updated };
}

export async function runConsoleScheduledRunnerHourly() {
  const tenants = await listAllTenantIds();
  let totalRan = 0, totalUpdated = 0;
  for (const t of tenants) {
    const res = await runTenantJobs(t);
    totalRan += res.ran; 
    totalUpdated += res.updated;
  }
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'job.console.scheduled.hourly.summary', 
    reasons: [`ran:${totalRan}`, `updated:${totalUpdated}`], 
    created_at: new Date().toISOString() 
  } as any);
  return { ok: true, ran: totalRan, updated: totalUpdated };
}