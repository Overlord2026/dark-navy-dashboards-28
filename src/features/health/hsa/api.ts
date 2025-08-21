import { recordHealthRDS } from '@/features/healthcare/receipts';

export interface HsaPlan {
  planName: string;
  hsaEligible: boolean;
  family: boolean;
  deductibleMet: boolean;
  ytdContrib: number;
  annualLimit: number;
  catchUpEligible: boolean;
}

/**
 * Get HSA plan information (mock implementation)
 */
export function getPlan(): HsaPlan {
  // Mock data - replace with actual API call
  const currentYear = new Date().getFullYear();
  const age = 58; // Mock age for catch-up eligibility
  const family = true; // Mock family coverage
  
  return {
    planName: 'High Deductible Health Plan - Family',
    hsaEligible: true,
    family,
    deductibleMet: false,
    ytdContrib: 3200, // Mock YTD contribution
    annualLimit: family ? 8550 : 4300, // 2024 IRS limits
    catchUpEligible: age >= 55
  };
}

/**
 * Plan an HSA contribution and generate Health-RDS receipt
 */
export function planContribution(amount: number) {
  const plan = getPlan();
  const inputs = {
    contribution_amount: amount,
    plan_type: plan.family ? 'family' : 'individual',
    catch_up_eligible: plan.catchUpEligible,
    annual_limit: plan.annualLimit,
    ytd_contrib: plan.ytdContrib
  };

  const newTotal = plan.ytdContrib + amount;
  const withinLimit = newTotal <= plan.annualLimit + (plan.catchUpEligible ? 1000 : 0);
  
  return recordHealthRDS(
    'plan_hsa_contribution',
    inputs,
    withinLimit ? 'allow' : 'deny',
    withinLimit ? ['within_annual_limit'] : ['exceeds_annual_limit'],
    ['contribution_plan_generated'],
    {
      hsa_eligible: true,
      estimated_cost_cents: amount * 100,
      coverage_type: plan.family ? 'family' : 'individual'
    }
  );
}

/**
 * Record an HSA claim and generate Health-RDS receipt
 */
export function recordClaim(amount: number, description: string) {
  const plan = getPlan();
  const inputs = {
    claim_amount: amount,
    claim_type: 'medical_expense',
    deductible_met: plan.deductibleMet
  };

  return recordHealthRDS(
    'record_hsa_claim',
    inputs,
    'allow',
    ['valid_medical_expense'],
    ['hsa_claim_recorded'],
    {
      hsa_eligible: true,
      estimated_cost_cents: amount * 100,
      coverage_type: plan.family ? 'family' : 'individual'
    }
  );
}

/**
 * Export HSA receipts (mock implementation)
 */
export function exportHsaReceipts() {
  const inputs = {
    export_type: 'hsa_receipts',
    export_format: 'json'
  };

  const receipt = recordHealthRDS(
    'export_hsa_receipts',
    inputs,
    'allow',
    ['authorized_export'],
    ['receipt_export_generated']
  );

  // Mock file download
  const mockData = {
    receipts: [receipt],
    exported_at: new Date().toISOString(),
    export_type: 'hsa_receipts'
  };

  const blob = new Blob([JSON.stringify(mockData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hsa-receipts-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return receipt;
}