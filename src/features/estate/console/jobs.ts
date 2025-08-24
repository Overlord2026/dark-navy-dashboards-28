import { recordReceipt } from '@/features/receipts/record';
import { getCurrentTenantId } from '@/features/tenant/context';

// Lightweight job spec type
export type ConsoleJobSpec = {
  id: string;
  tenantId: string;                    // NEW
  name: string;                        // e.g., "Invite consent — consent_missing"
  kind: 'invite_consent' | 'nudge_signed_no_final' | 'nudge_delivered_not_latest' | 'request_deed' | 'recompute';
  filter: 'CONSENT_MISSING' | 'SIGNED_NO_FINAL' | 'DELIVERED_NOT_LATEST' | 'TRUST_NO_DEED' | 'HEALTH_INCOMPLETE';
  cadence: 'weekly' | 'monthly' | 'once';
  lastRunAt?: string;
  enabled: boolean;
  createdAt: string;
};

function jobsKey(tenantId: string) { return `console.jobs.v1:${tenantId}`; }

export function loadConsoleJobs(tenantId?: string): ConsoleJobSpec[] {
  const t = tenantId || getCurrentTenantId();
  try {
    return JSON.parse(localStorage.getItem(jobsKey(t)) || '[]');
  } catch {
    return [];
  }
}

export function saveConsoleJobs(v: ConsoleJobSpec[], tenantId?: string) {
  const t = tenantId || getCurrentTenantId();
  localStorage.setItem(jobsKey(t), JSON.stringify(v));
}

export function upsertConsoleJob(j: ConsoleJobSpec) {
  const arr = loadConsoleJobs(j.tenantId);
  const i = arr.findIndex(x => x.id === j.id);
  if (i >= 0) arr[i] = j;
  else arr.push(j);
  saveConsoleJobs(arr, j.tenantId);
  return arr;
}

export function removeConsoleJob(id: string, tenantId?: string) {
  const t = tenantId || getCurrentTenantId();
  saveConsoleJobs(loadConsoleJobs(t).filter(x => x.id !== id), t);
}

export async function scheduleJob(spec: ConsoleJobSpec) {
  if (!spec.tenantId) spec.tenantId = getCurrentTenantId();
  upsertConsoleJob(spec);
  // content-free receipt
  const reasons = [`tenant:${spec.tenantId}`, `kind:${spec.kind}`, `filter:${spec.filter}`, `cadence:${spec.cadence}`];
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'console.job.schedule',
    reasons,
    created_at: new Date().toISOString()
  } as any);
  return { ok: true };
}