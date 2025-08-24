import { getChecklist, saveChecklist } from './store';
import { bootstrapChecklist, applySignal } from './rules';
import { recordReceipt } from '@/features/receipts/record';
import type { DocSignal, ChecklistSignalOptions } from './signals';
import type { Checklist } from './types';

export async function mapSignal(clientId: string, signal: DocSignal): Promise<{ changed: boolean; checklist: Checklist }> {
  console.log(`[Checklist Mapper] Processing signal ${signal.type} for client ${clientId}`);
  
  // Get or create checklist
  let checklist = await getChecklist(clientId);
  if (!checklist) {
    const state = (signal as any).state; // Extract state from signal if available
    checklist = bootstrapChecklist(clientId, state);
    console.log(`[Checklist Mapper] Created new checklist for ${clientId}`);
  }
  
  const beforeHash = checklist.hash;
  
  // Apply the signal
  const updatedChecklist = await applySignal(checklist, signal);
  
  // Save the updated checklist
  await saveChecklist(updatedChecklist);
  
  const changed = beforeHash !== updatedChecklist.hash;
  
  if (changed) {
    // Log content-free Decision-RDS
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'estate.checklist.mapped',
      reasons: [signal.type, updatedChecklist.hash || ''],
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`[Checklist Mapper] Checklist updated for ${clientId}, hash: ${updatedChecklist.hash}`);
  }
  
  return { changed, checklist: updatedChecklist };
}

export async function mapMultipleSignals(options: ChecklistSignalOptions[]): Promise<Checklist[]> {
  const results: Checklist[] = [];
  
  for (const option of options) {
    const { checklist } = await mapSignal(option.clientId, option.signal);
    results.push(checklist);
  }
  
  return results;
}

export async function getChecklistWithDefaults(clientId: string, state?: string): Promise<Checklist> {
  let checklist = await getChecklist(clientId);
  if (!checklist) {
    checklist = bootstrapChecklist(clientId, state);
    await saveChecklist(checklist);
  }
  return checklist;
}