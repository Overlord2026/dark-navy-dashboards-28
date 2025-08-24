import { getEnabledJobs, getJob } from './registry';
import { enabled } from './flags';
import { recordReceipt } from '@/features/receipts/record';
import analytics from '@/lib/analytics';
import type { JobResult, JobRun } from './types';

// Track running timers
let timers: NodeJS.Timeout[] = [];
let isRunning = false;

// Track job runs in memory (for dev)
const jobRuns: JobRun[] = [];

/**
 * Start all enabled background jobs
 */
export async function startJobs(): Promise<void> {
  if (!enabled('BACKGROUND_JOBS_ENABLED')) {
    console.log('[Jobs] Background jobs disabled via flag');
    return;
  }

  if (isRunning) {
    console.log('[Jobs] Already running');
    return;
  }

  console.log('[Jobs] Starting background jobs...');
  stopJobs(); // Clean up any existing timers

  const enabledJobs = getEnabledJobs();
  console.log(`[Jobs] Found ${enabledJobs.length} enabled jobs`);

  enabledJobs.forEach(job => {
    if (job.intervalMs && job.intervalMs > 0) {
      console.log(`[Jobs] Scheduling ${job.key} every ${job.intervalMs}ms`);
      
      const timer = setInterval(async () => {
        try {
          await runJobWithTracking(job.key);
        } catch (error) {
          console.error(`[Jobs] Error running ${job.key}:`, error);
        }
      }, job.intervalMs);
      
      timers.push(timer);
    }
  });

  isRunning = true;
  console.log(`[Jobs] Started ${timers.length} scheduled jobs`);
}

/**
 * Stop all background jobs
 */
export function stopJobs(): void {
  console.log(`[Jobs] Stopping ${timers.length} jobs`);
  timers.forEach(timer => clearInterval(timer));
  timers = [];
  isRunning = false;
}

/**
 * Run a specific job manually
 */
export async function runJobNow(jobKey: string): Promise<JobResult> {
  const job = getJob(jobKey);
  if (!job) {
    throw new Error(`Job not found: ${jobKey}`);
  }

  console.log(`[Jobs] Running job manually: ${jobKey}`);
  return await runJobWithTracking(jobKey);
}

/**
 * Internal function to run a job with tracking and receipts
 */
async function runJobWithTracking(jobKey: string): Promise<JobResult> {
  const job = getJob(jobKey);
  if (!job) {
    throw new Error(`Job not found: ${jobKey}`);
  }

  const startTime = Date.now();
  const jobRun: JobRun = {
    jobKey,
    startedAt: new Date().toISOString(),
  };

  try {
    console.log(`[Jobs] Starting ${jobKey}...`);
    
    // Run the job
    const result = await job.run();
    const endTime = Date.now();
    
    jobRun.completedAt = new Date().toISOString();
    jobRun.result = {
      ...result,
      duration: endTime - startTime,
    };

    // Record receipt for successful job run
    const receipt = await recordReceipt({
      id: `job_${jobKey}_${Date.now()}`,
      type: 'Decision-RDS',
      action: 'job.run',
      policy_version: 'E-2025.08',
      inputs_hash: `sha256:${jobKey}_${startTime}`,
      reasons: [jobKey.toUpperCase(), result.ok ? 'JOB_SUCCESS' : 'JOB_FAILURE'],
      created_at: jobRun.startedAt,
    });

    jobRun.receiptId = receipt.id;

    // Track analytics
    analytics.track('job.run', {
      jobKey,
      success: result.ok,
      duration: result.duration,
      count: result.count,
    });

    console.log(`[Jobs] Completed ${jobKey} in ${result.duration}ms:`, {
      ok: result.ok,
      count: result.count,
      receiptId: receipt.id,
    });

    return result;

  } catch (error) {
    const endTime = Date.now();
    const errorResult: JobResult = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: endTime - startTime,
    };

    jobRun.completedAt = new Date().toISOString();
    jobRun.result = errorResult;

    // Record receipt for failed job run
    try {
      const receipt = await recordReceipt({
        id: `job_${jobKey}_${Date.now()}_error`,
        type: 'Decision-RDS',
        action: 'job.run',
        policy_version: 'E-2025.08',
        inputs_hash: `sha256:${jobKey}_${startTime}_error`,
        reasons: [jobKey.toUpperCase(), 'JOB_FAILURE'],
        created_at: jobRun.startedAt,
      });

      jobRun.receiptId = receipt.id;
    } catch (receiptError) {
      console.error(`[Jobs] Failed to record error receipt for ${jobKey}:`, receiptError);
    }

    console.error(`[Jobs] Failed ${jobKey} after ${errorResult.duration}ms:`, error);
    return errorResult;

  } finally {
    // Store job run for admin panel
    jobRuns.unshift(jobRun);
    
    // Keep only last 100 runs
    if (jobRuns.length > 100) {
      jobRuns.splice(100);
    }
  }
}

/**
 * Get recent job runs for admin panel
 */
export function getJobRuns(jobKey?: string): JobRun[] {
  if (jobKey) {
    return jobRuns.filter(run => run.jobKey === jobKey);
  }
  return [...jobRuns];
}

/**
 * Get job status
 */
export function getJobStatus() {
  return {
    isRunning,
    activeJobs: timers.length,
    totalRuns: jobRuns.length,
    enabledJobs: getEnabledJobs().length,
  };
}
