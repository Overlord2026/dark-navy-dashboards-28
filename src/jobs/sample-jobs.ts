import { registerJob } from './registry';
import type { JobResult } from './types';

/**
 * Sample Guardrails Monitor Job
 */
async function runGuardrailsMonitor(): Promise<JobResult> {
  console.log('[GuardrailsMonitor] Starting guardrails check...');
  
  try {
    // Simulate checking retirement plans for guardrail violations
    const plans = JSON.parse(localStorage.getItem('roadmap_scenarios') || '[]');
    const reviews = JSON.parse(localStorage.getItem('roadmap_reviews') || '[]');
    
    let violationCount = 0;
    
    for (const review of reviews) {
      if (review.guardrails?.triggered) {
        violationCount++;
        console.log(`[GuardrailsMonitor] Guardrail violation in scenario ${review.scenarioId}`);
      }
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      ok: true,
      count: violationCount,
    };
    
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sample Beneficiary Sync Job
 */
async function runBeneficiarySync(): Promise<JobResult> {
  console.log('[BeneficiarySync] Starting beneficiary sync...');
  
  try {
    // Simulate checking for beneficiary mismatches
    const accounts = [
      { id: 'acc_401k', beneficiary: 'Mother' },
      { id: 'acc_ira', beneficiary: 'Spouse' },
      { id: 'acc_brokerage', beneficiary: 'Trust' },
    ];
    
    let mismatchCount = 0;
    
    for (const account of accounts) {
      // Simulate checking against intent
      if (account.beneficiary === 'Mother') {
        mismatchCount++;
        console.log(`[BeneficiarySync] Mismatch found for ${account.id}`);
      }
    }

    // Simulate sync time
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      ok: true,
      count: mismatchCount,
    };
    
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Register the sample jobs
registerJob({
  key: 'guardrails-monitor',
  name: 'Guardrails Monitor',
  description: 'Monitor retirement plans for guardrail violations',
  enabledFlag: 'MONITOR_GUARDRAILS_ENABLED',
  intervalMs: 30000, // 30 seconds for demo
  run: runGuardrailsMonitor,
});

registerJob({
  key: 'beneficiary-sync',
  name: 'Beneficiary Sync',
  description: 'Check for beneficiary designation mismatches',
  enabledFlag: 'SYNC_BENEFICIARIES_ENABLED',
  intervalMs: 60000, // 1 minute for demo
  run: runBeneficiarySync,
});

console.log('[Jobs] Sample jobs registered');