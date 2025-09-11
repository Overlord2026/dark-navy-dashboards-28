import { listScenarios } from '@/features/roadmap/store';
import { runScenario } from '@/features/roadmap/engine';
import { recordReceipt } from '@/features/receipts/record';
import * as Canonical from '@/lib/canonical';
import { guardrailsCfg } from './policy';

export async function evaluateGuardrailsForHousehold(householdId: string) {
  const scenarios = await listScenarios(householdId);
  let alerts = 0;
  
  for (const s of scenarios) {
    const res = runScenario(s);
    const within = res.successProb >= guardrailsCfg.lower && res.successProb <= guardrailsCfg.upper;
    const state = within ? 'GUARDRAIL_OK' : (res.successProb < guardrailsCfg.lower ? 'GUARDRAIL_WARN' : 'GUARDRAIL_WARN');
    
    const inputs_hash = await Canonical.hash({
      householdId, 
      scenarioId: s.id, 
      assumptions: s.assumptions
    });
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'GUARDRAIL_EVAL',
      policy_version: 'E-2025.08',
      inputs_hash,
      reasons: [state],
      created_at: new Date().toISOString()
    } as any);
    
    if (!within) {
      alerts++;
      // TODO: create task/nudge entity and optional Comms below
    }
  }
  
  return alerts;
}