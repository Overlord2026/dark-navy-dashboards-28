import { runRules, createProofSlip, type Rule, type RuleResult, type ProofSlip } from './dsl';
import { recordReceipt } from '@/features/receipts/record';

// Proof slip store (in production, this would be a database)
let PROOF_SLIPS: ProofSlip[] = [];

export async function executeDecisionEngine(
  rules: Rule[], 
  context: any, 
  options?: {
    generateProofSlips?: boolean;
    logReceipts?: boolean;
    namespace?: string;
  }
): Promise<{
  results: RuleResult[];
  proofSlips: ProofSlip[];
}> {
  const { generateProofSlips = true, logReceipts = true, namespace = 'decision' } = options || {};
  
  // Run the rules
  const results = runRules(rules, context);
  
  // Generate proof slips
  const proofSlips: ProofSlip[] = [];
  if (generateProofSlips) {
    for (const result of results) {
      const slip = createProofSlip(result);
      proofSlips.push(slip);
      PROOF_SLIPS.push(slip);
    }
  }
  
  // Log content-free receipts
  if (logReceipts) {
    for (const result of results) {
      await recordReceipt({
        type: 'Decision-RDS',
        action: `${namespace}.${result.action}`,
        reasons: result.reasons,
        created_at: new Date().toISOString()
      } as any);
    }
  }
  
  console.log(`[Decision Engine] Executed ${rules.length} rules, generated ${results.length} actions, ${proofSlips.length} proof slips`);
  
  return { results, proofSlips };
}

export function getProofSlips(filters?: {
  ruleId?: string;
  action?: string;
  since?: string;
}): ProofSlip[] {
  let filtered = PROOF_SLIPS;
  
  if (filters?.ruleId) {
    filtered = filtered.filter(slip => slip.ruleId === filters.ruleId);
  }
  
  if (filters?.action) {
    filtered = filtered.filter(slip => slip.action === filters.action);
  }
  
  if (filters?.since) {
    const sinceDate = new Date(filters.since);
    filtered = filtered.filter(slip => new Date(slip.timestamp) >= sinceDate);
  }
  
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function verifyProofSlip(slip: ProofSlip): boolean {
  // Verify proof slip integrity
  const expectedHash = generateHash({
    ruleId: slip.ruleId,
    action: slip.action,
    reasons: slip.reasons,
    context: slip.context,
    timestamp: slip.timestamp
  });
  
  return slip.hash === expectedHash;
}

function generateHash(data: any): string {
  const str = JSON.stringify(data, Object.keys(data).sort());
  return btoa(str).slice(0, 16);
}

export function clearProofSlips(): void {
  PROOF_SLIPS = [];
  console.log('[Decision Engine] Proof slips cleared');
}

export function getProofSlipStats(): {
  total: number;
  byAction: Record<string, number>;
  byRule: Record<string, number>;
} {
  const stats = {
    total: PROOF_SLIPS.length,
    byAction: {} as Record<string, number>,
    byRule: {} as Record<string, number>
  };
  
  PROOF_SLIPS.forEach(slip => {
    stats.byAction[slip.action] = (stats.byAction[slip.action] || 0) + 1;
    stats.byRule[slip.ruleId] = (stats.byRule[slip.ruleId] || 0) + 1;
  });
  
  return stats;
}