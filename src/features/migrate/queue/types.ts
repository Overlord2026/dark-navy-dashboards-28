export type JobStatus = 'queued'|'processing'|'done'|'error'|'cancelled';

export type Job = {
  jobId: string;
  createdAt: string;
  updatedAt: string;
  persona: 'advisor'|'accountant'|'attorney'|'realtor'|'nil'|'smb';
  incumbent: string;
  submitter: string;            // userId or email (no PII logged in receipts)
  files: Array<{ name: string; vaultId?: string; size?: number }>;
  map?: any;                   // field mapping snapshot
  status: JobStatus;
  attempts: number;
  result?: { rows?: number; ok?: number; errors?: number; ids?: string[]; note?: string };
};