import type { Job } from './types';
import { enabled } from './flags';

/**
 * Global job registry
 * Individual job modules will push their jobs into this array
 */
export const jobs: Job[] = [];

// Register guardrails monitor job
import { runGuardrailsMonitor } from './guardrails.monitor';
jobs.push({ 
  key: 'guardrails.monitor', 
  name: 'Guardrails Monitor',
  description: 'Monitor retirement roadmap scenarios for out-of-band success probabilities',
  enabledFlag: 'MONITOR_GUARDRAILS_ENABLED', 
  intervalMs: 24 * 60 * 60 * 1000, // 24 hours
  run: runGuardrailsMonitor 
});

// Register beneficiary sync job
import { runBeneficiarySync } from './beneficiary.sync';
jobs.push({
  key: 'beneficiary.sync',
  name: 'Beneficiary Sync',
  description: 'Sync estate intents vs account beneficiaries and detect mismatches',
  enabledFlag: 'SYNC_BENEFICIARIES_ENABLED',
  intervalMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  run: runBeneficiarySync
});

/**
 * Register a job with the system
 */
export function registerJob(job: Job): void {
  // Remove existing job with same key
  const existingIndex = jobs.findIndex(j => j.key === job.key);
  if (existingIndex >= 0) {
    jobs.splice(existingIndex, 1);
  }
  
  jobs.push(job);
  console.log(`[Jobs] Registered job: ${job.key}`);
}

/**
 * Get all registered jobs
 */
export function getJobs(): Job[] {
  return [...jobs];
}

/**
 * Get a specific job by key
 */
export function getJob(key: string): Job | undefined {
  return jobs.find(j => j.key === key);
}

/**
 * Get all enabled jobs
 */
export function getEnabledJobs(): Job[] {
  return jobs.filter(job => enabled(job.enabledFlag));
}

/**
 * Check if job system is enabled
 */
export { enabled };