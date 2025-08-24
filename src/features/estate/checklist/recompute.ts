import { getChecklist, saveChecklist, getAllChecklists } from './store';
import { applySignal, bootstrapChecklist } from './rules';
import { recordReceipt } from '@/features/receipts/record';
import type { DocSignal } from './signals';
import type { Checklist } from './types';

export async function recomputeChecklist(
  clientId: string, 
  state: string, 
  signals: DocSignal[] = []
): Promise<Checklist> {
  console.log(`[Checklist Recompute] Recomputing checklist for ${clientId} with ${signals.length} signals`);
  
  // Start fresh
  let checklist = bootstrapChecklist(clientId, state);
  
  // Apply all signals in order
  for (const signal of signals) {
    checklist = await applySignal(checklist, signal);
  }
  
  // Save the recomputed checklist
  await saveChecklist(checklist);
  
  // Log the recompute action
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.checklist.recompute',
    reasons: [clientId, checklist.hash || ''],
    created_at: new Date().toISOString()
  } as any);
  
  console.log(`[Checklist Recompute] Completed for ${clientId}, hash: ${checklist.hash}`);
  
  return checklist;
}

export async function recomputeAllChecklists(): Promise<{ processed: number; errors: string[] }> {
  console.log('[Checklist Recompute] Starting bulk recompute for all checklists');
  
  const allChecklists = await getAllChecklists();
  let processed = 0;
  const errors: string[] = [];
  
  for (const checklist of allChecklists) {
    try {
      // TODO: In production, this would fetch actual signals from vault/database
      // For now, we'll just recompute with empty signals to validate structure
      await recomputeChecklist(checklist.clientId, checklist.state || '', []);
      processed++;
    } catch (error) {
      const errorMsg = `Failed to recompute ${checklist.clientId}: ${error}`;
      errors.push(errorMsg);
      console.error(`[Checklist Recompute] ${errorMsg}`);
    }
  }
  
  // Log bulk recompute summary
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'estate.checklist.bulk_recompute',
    reasons: [`processed:${processed}`, `errors:${errors.length}`],
    created_at: new Date().toISOString()
  } as any);
  
  console.log(`[Checklist Recompute] Bulk recompute completed: ${processed} processed, ${errors.length} errors`);
  
  return { processed, errors };
}

// Helper to rebuild signals from vault data (stub for now)
export async function rebuildSignalsFromVault(clientId: string): Promise<DocSignal[]> {
  // TODO: Query vault/database for all document events for this client
  // This would include:
  // - Vault ingestion records
  // - ARP completion records  
  // - Notary completion records
  // - Deed recording records
  // - E-sign completion records
  
  console.log(`[Checklist Recompute] Rebuilding signals for ${clientId} (stub implementation)`);
  
  // Stub implementation - return empty array
  // In production, this would query actual data sources
  return [];
}