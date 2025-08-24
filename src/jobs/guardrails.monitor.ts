import { evaluateGuardrailsForHousehold } from '@/features/roadmap/guardrails/eval';
import { recordReceipt } from '@/features/receipts/record';
import type { JobResult } from './types';

// Mock household list - replace with actual API
async function listHouseholds() {
  return [
    { id: 'household-1' },
    { id: 'household-2' },
    { id: 'household-3' }
  ];
}

export async function runGuardrailsMonitor(): Promise<JobResult> {
  try {
    const households = await listHouseholds();
    let totalAlerts = 0;
    
    for (const h of households) {
      totalAlerts += await evaluateGuardrailsForHousehold(h.id);
    }
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'job.guardrails.summary', 
      reasons: [String(totalAlerts)], 
      created_at: new Date().toISOString() 
    } as any);
    
    return { ok: true, count: totalAlerts };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0 
    };
  }
}