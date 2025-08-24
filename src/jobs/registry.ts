import { runArpNudgeWeekly } from './arpNudgeWeekly';
import { runChecklistNightly } from './checklistNightly';
import { runConsoleScheduledRunner } from './consoleScheduledRunner';
import { runConsoleScheduledRunnerHourly } from './consoleScheduledRunnerHourly';
import type { JobDefinition } from './types';

export const jobs: JobDefinition[] = [
  {
    key: 'arp.nudge.weekly',
    enabledFlag: 'ARP_NUDGE_ENABLED',
    intervalMs: 7 * 24 * 60 * 60 * 1000, // Weekly
    run: runArpNudgeWeekly
  },
  {
    key: 'checklist.nightly',
    enabledFlag: 'CHECKLIST_NIGHTLY_RECOMPUTE',
    intervalMs: 24 * 60 * 60 * 1000, // Daily
    run: runChecklistNightly
  },
  {
    key: 'console.scheduled.runner.hourly',
    enabledFlag: 'CHECKLIST_JOBS_BRIDGE',
    intervalMs: 60 * 60 * 1000,                 // hourly
    run: runConsoleScheduledRunnerHourly
  },
  {
    key: 'console.scheduled.runner.daily',
    enabledFlag: 'CHECKLIST_JOBS_BRIDGE',
    intervalMs: 24 * 3600 * 1000,               // daily summary (optional keep)
    run: runConsoleScheduledRunner
  }
];

export async function runJob(jobKey: string): Promise<{ ok: boolean; [key: string]: any }> {
  const job = jobs.find(j => j.key === jobKey);
  if (!job) {
    throw new Error(`Job not found: ${jobKey}`);
  }
  
  const enabled = import.meta.env[`VITE_${job.enabledFlag}`] === 'true';
  if (!enabled) {
    console.log(`[Jobs] Job ${jobKey} is disabled`);
    return { ok: true, skipped: true, reason: 'disabled' };
  }
  
  console.log(`[Jobs] Running job: ${jobKey}`);
  return await job.run();
}

export async function runAllJobs(): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  for (const job of jobs) {
    try {
      results[job.key] = await runJob(job.key);
    } catch (error) {
      results[job.key] = { ok: false, error: String(error) };
      console.error(`[Jobs] Job ${job.key} failed:`, error);
    }
  }
  
  return results;
}

// Auto-start background jobs if enabled
export function startBackgroundJobs(): void {
  const enabled = import.meta.env.VITE_BACKGROUND_JOBS_ENABLED === 'true';
  if (!enabled) {
    console.log('[Jobs] Background jobs are disabled');
    return;
  }
  
  console.log('[Jobs] Starting background job scheduler');
  
  jobs.forEach(job => {
    const jobEnabled = import.meta.env[`VITE_${job.enabledFlag}`] === 'true';
    if (!jobEnabled) {
      console.log(`[Jobs] Skipping disabled job: ${job.key}`);
      return;
    }
    
    console.log(`[Jobs] Scheduling job: ${job.key} (interval: ${job.intervalMs}ms)`);
    
    // Run immediately
    runJob(job.key).catch(error => {
      console.error(`[Jobs] Initial run of ${job.key} failed:`, error);
    });
    
    // Schedule recurring runs
    setInterval(() => {
      runJob(job.key).catch(error => {
        console.error(`[Jobs] Scheduled run of ${job.key} failed:`, error);
      });
    }, job.intervalMs);
  });
}

export function getJobs() {
  return jobs;
}

export function getEnabledJobs() {
  return jobs.filter(job => import.meta.env[`VITE_${job.enabledFlag}`] === 'true');
}

export function getJob(jobKey: string) {
  return jobs.find(j => j.key === jobKey);
}

export function registerJob(job: JobDefinition) {
  jobs.push(job);
}