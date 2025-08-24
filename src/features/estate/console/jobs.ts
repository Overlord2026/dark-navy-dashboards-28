import { recordReceipt } from '@/features/receipts/record';

// Lightweight job spec type
export type ConsoleJobSpec = {
  id: string;
  name: string;                    // e.g., "Invite consent — consent_missing"
  kind: 'invite_consent' | 'nudge_signed_no_final' | 'nudge_delivered_not_latest' | 'request_deed' | 'recompute';
  filter: 'CONSENT_MISSING' | 'SIGNED_NO_FINAL' | 'DELIVERED_NOT_LATEST' | 'TRUST_NO_DEED' | 'HEALTH_INCOMPLETE';
  cadence: 'weekly' | 'monthly' | 'once';
  lastRunAt?: string;
  enabled: boolean;
  createdAt: string;
};

const KEY = 'console.jobs.v1';

export function loadConsoleJobs(): ConsoleJobSpec[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveConsoleJobs(v: ConsoleJobSpec[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function upsertConsoleJob(j: ConsoleJobSpec) {
  const arr = loadConsoleJobs();
  const i = arr.findIndex(x => x.id === j.id);
  if (i >= 0) arr[i] = j;
  else arr.push(j);
  saveConsoleJobs(arr);
  return arr;
}

export function removeConsoleJob(id: string) {
  saveConsoleJobs(loadConsoleJobs().filter(x => x.id !== id));
}

export async function scheduleJob(spec: ConsoleJobSpec) {
  upsertConsoleJob(spec);
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'console.job.schedule',
    reasons: [`kind:${spec.kind}`, `filter:${spec.filter}`, `cadence:${spec.cadence}`],
    created_at: new Date().toISOString()
  } as any);
  return { ok: true };
}