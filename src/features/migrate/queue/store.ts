import type { Job, JobStatus } from './types';

let JOBS: Record<string, Job> = {};

export function addJob(j: Job): Job { 
  JOBS[j.jobId] = j; 
  return j; 
}

export function getJob(id: string): Job | undefined { 
  return JOBS[id]; 
}

export function listJobs(status?: JobStatus): Job[] { 
  return Object.values(JOBS)
    .filter(j => !status || j.status === status)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); 
}

export function setJobStatus(id: string, status: JobStatus, result?: Job['result']): void { 
  if (JOBS[id]) { 
    JOBS[id].status = status; 
    JOBS[id].result = result; 
    JOBS[id].updatedAt = new Date().toISOString(); 
  } 
}

export function incJobAttempts(id: string): void { 
  if (JOBS[id]) { 
    JOBS[id].attempts++; 
    JOBS[id].updatedAt = new Date().toISOString(); 
  } 
}