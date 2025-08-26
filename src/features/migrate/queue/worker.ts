import { getAdapter } from '@/features/migrate/registry';
import { getJob, setJobStatus, incJobAttempts } from './store';
import { recordReceipt } from '@/features/receipts/record';
import { sendEmail } from '@/features/migrate/email/sender';
import type { Job } from './types';

async function fetchFiles(job: Job): Promise<any[]> {
  // TODO: download file bytes via Vault reference; here we stub as []
  return [];
}

export async function processJob(jobId: string): Promise<void> {
  const job = getJob(jobId); 
  if (!job) return;
  
  try {
    setJobStatus(jobId, 'processing'); 
    incJobAttempts(jobId);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'migrate.queue.start', 
      reasons: [job.persona, job.incumbent], 
      created_at: new Date().toISOString() 
    } as any);

    const adapter = getAdapter(job.incumbent as any); 
    if (!adapter) throw new Error('adapter_missing');
    
    const files = await fetchFiles(job);
    const rows = await adapter.read(files, {});
    const map = job.map || (adapter.defaultMapping ? adapter.defaultMapping() : {});
    const dry = await adapter.dryRun(rows, map);

    if (dry.errors && dry.errors.length) {
      setJobStatus(jobId, 'error', { 
        rows: dry.rows, 
        ok: dry.ok, 
        errors: dry.errors.length, 
        note: 'dryrun_errors' 
      });
      
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'migrate.queue.error', 
        reasons: [jobId, 'dryrun_errors'], 
        created_at: new Date().toISOString() 
      } as any);
      return;
    }

    const commit = await adapter.commit(rows, map);
    setJobStatus(jobId, 'done', { rows: commit.rows, ids: commit.ids });

    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'migrate.queue.done', 
      reasons: [jobId, `rows:${commit.rows}`], 
      created_at: new Date().toISOString() 
    } as any);

    // Notify submitter (if you have user email on file)
    if (job.submitter?.includes('@')) {
      await sendEmail({ 
        to: job.submitter, 
        subject: 'Migration complete', 
        text: `Your import job ${jobId} completed.`,
        template_id: 'migration.complete'
      });
    }
  } catch (e: any) {
    setJobStatus(jobId, 'error', { note: e?.message || 'error' });
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'migrate.queue.error', 
      reasons: [jobId, e?.message || 'error'], 
      created_at: new Date().toISOString() 
    } as any);
  }
}

export async function retryJob(jobId: string): Promise<void> {
  const job = getJob(jobId); 
  if (!job) return;
  if (job.attempts >= 3) return; // backoff policy
  
  await processJob(jobId);
}