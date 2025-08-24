export interface JobResult {
  ok: boolean;
  count?: number;
  error?: string;
  duration?: number;
}

export interface Job {
  key: string;
  name: string;
  description: string;
  enabledFlag: string;
  intervalMs?: number;
  run: () => Promise<JobResult>;
}

export interface JobRun {
  jobKey: string;
  startedAt: string;
  completedAt?: string;
  result?: JobResult;
  receiptId?: string;
}