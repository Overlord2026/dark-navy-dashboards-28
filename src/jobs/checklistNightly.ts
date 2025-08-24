import { recomputeAllChecklists } from '@/features/estate/checklist/recompute';
import { recordReceipt } from '@/features/receipts/record';

export async function runChecklistNightly(): Promise<{ ok: boolean; count: number; errors: string[] }> {
  console.log('[Job] Starting nightly checklist recompute');
  
  const enabled = import.meta.env.VITE_CHECKLIST_NIGHTLY_RECOMPUTE === 'true';
  if (!enabled) {
    console.log('[Job] Checklist nightly recompute is disabled');
    return { ok: true, count: 0, errors: [] };
  }

  try {
    const result = await recomputeAllChecklists();
    
    // Log summary receipt
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.checklist_nightly.summary',
      reasons: [`count:${result.processed}`, `errors:${result.errors.length}`],
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`[Job] Nightly checklist recompute completed: ${result.processed} processed, ${result.errors.length} errors`);
    
    return { 
      ok: true, 
      count: result.processed, 
      errors: result.errors 
    };
    
  } catch (error) {
    const errorMsg = `Nightly checklist job failed: ${error}`;
    console.error(`[Job] ${errorMsg}`);
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.checklist_nightly.error',
      reasons: [String(error)],
      created_at: new Date().toISOString()
    } as any);
    
    return { 
      ok: false, 
      count: 0, 
      errors: [errorMsg] 
    };
  }
}