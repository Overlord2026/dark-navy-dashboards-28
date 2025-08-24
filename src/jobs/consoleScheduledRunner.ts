import { loadConsoleJobs, upsertConsoleJob, ConsoleJobSpec } from '@/features/estate/console/jobs';
import { recordReceipt } from '@/features/receipts/record';
import analytics from '@/lib/analytics';
import { bulkInviteConsent, bulkNudgeSignedNoFinal, bulkNudgeDeliveredNotLatest, bulkRecompute, bulkRequestDeed } from '@/features/estate/console/bulk';

type FilterKey = 'CONSENT_MISSING'|'SIGNED_NO_FINAL'|'DELIVERED_NOT_LATEST'|'TRUST_NO_DEED'|'HEALTH_INCOMPLETE';

// Stub portfolio data - replace with real data source
async function listPortfolio() {
  return [
    { clientId: 'client1', flags: { consentMissing: true } as Record<string, boolean> },
    { clientId: 'client2', flags: { signedNoFinal: true } as Record<string, boolean> },
    { clientId: 'client3', flags: { deliveredNotLatest: true } as Record<string, boolean> },
    { clientId: 'client4', flags: { trustWithoutDeed: true } as Record<string, boolean> },
    { clientId: 'client5', flags: { healthIncomplete: true } as Record<string, boolean> },
  ];
}

function daysSince(iso?: string) { 
  return iso ? Math.floor((Date.now() - Date.parse(iso)) / (24*3600*1000)) : Infinity; 
}

function isDue(job: ConsoleJobSpec) {
  const age = daysSince(job.lastRunAt);
  if (job.cadence === 'weekly') return age >= 7;
  if (job.cadence === 'monthly') return age >= 28;
  if (job.cadence === 'once') return !job.lastRunAt;
  return false;
}

function pickByFilter(rows: Awaited<ReturnType<typeof listPortfolio>>, f: FilterKey) {
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

async function runJob(spec: ConsoleJobSpec) {
  const rows = await listPortfolio();
  const cohort = pickByFilter(rows, spec.filter as FilterKey);
  if (!cohort.length) return { ran: false, count: 0 };

  let result: any = null;
  if (spec.kind === 'invite_consent') result = await bulkInviteConsent(cohort);
  else if (spec.kind === 'nudge_signed_no_final') result = await bulkNudgeSignedNoFinal(cohort);
  else if (spec.kind === 'nudge_delivered_not_latest') result = await bulkNudgeDeliveredNotLatest(cohort);
  else if (spec.kind === 'recompute') result = await bulkRecompute(cohort);
  else if (spec.kind === 'request_deed') result = await bulkRequestDeed(cohort);

  return { ran: true, count: (result?.ok ?? result?.sent ?? 0) || cohort.length };
}

export async function runConsoleScheduledRunner() {
  const jobs = loadConsoleJobs().filter(j => j.enabled !== false);
  if (!jobs.length) return { ok: true, ran: 0, updated: 0 };

  let ran = 0, updated = 0;
  for (const j of jobs) {
    const due = isDue(j);
    if (!due) continue;

    const res = await runJob(j);
    ran += res.ran ? 1 : 0;

    // update lastRunAt only if we ran (even with empty cohort, we consider it ran)
    j.lastRunAt = new Date().toISOString();
    upsertConsoleJob(j);
    updated++;

    // content-free summary per job
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.console.scheduled.run',
      reasons: [`job:${j.id}`, `kind:${j.kind}`, `filter:${j.filter}`, `cadence:${j.cadence}`, `count:${res.count}`],
      created_at: new Date().toISOString()
    } as any);

    analytics.track('job.console.scheduled.run', { 
      jobId: j.id, 
      kind: j.kind, 
      filter: j.filter, 
      cadence: j.cadence, 
      count: res.count 
    });
  }

  // overall summary
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'job.console.scheduled.summary', 
    reasons: [`ran:${ran}`, `updated:${updated}`], 
    created_at: new Date().toISOString() 
  } as any);

  return { ok: true, ran, updated };
}