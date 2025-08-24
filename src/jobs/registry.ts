import type { Job } from './types';
import { enabled } from './flags';

/**
 * Global job registry
 * Individual job modules will push their jobs into this array
 */
export const jobs: Job[] = [];

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