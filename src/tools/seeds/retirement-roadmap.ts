import { recordReceipt } from '@/features/receipts/record';
import { createScenario, createReview } from '@/features/roadmap/store';
import analytics from '@/lib/analytics';
import type { Scenario, Review } from '@/features/roadmap/types';

export async function seedRoadmapDemo() {
  console.log('🌱 Seeding Retirement Roadmap demo data...');
  
  analytics.track('demo.e2e.start', { name: 'retiree-roadmap' });

  // Create base scenario
  const baseScenario: Scenario = {
    id: 'demo_base_plan',
    householdId: 'demo-household',
    name: 'Base Plan',
    createdAt: new Date().toISOString(),
    createdBy: 'demo-user',
    assumptions: {
      currentAge: 58,
      retirementAge: 65,
      currentIncome: 150000,
      savingsRate: 0.15,
      expectedReturn: 0.07,
      inflationRate: 0.025,
    },
    goals: [
      { type: 'income_replacement', target: 0.8 },
      { type: 'legacy', target: 500000 },
    ],
    income_floor: [
      { source: 'social_security', amount: 2800, startAge: 67 },
      { source: 'pension', amount: 1200, startAge: 65 },
    ],
    annuity_layers: [],
    mcParams: { nSims: 1000, horizon: 30 },
    withdrawal_policy: { 
      order: ['taxable', 'traditional', 'roth'],
      tax_rules: { roth_conversion_limit: 50000 }
    },
    notes: 'Conservative baseline plan with standard assumptions',
  };

  // Create tax-aware scenario
  const taxAwareScenario: Scenario = {
    ...baseScenario,
    id: 'demo_tax_aware',
    name: 'Tax-Aware',
    withdrawal_policy: {
      order: ['taxable', 'roth', 'traditional'],
      tax_rules: { 
        roth_conversion_limit: 100000,
        bracket_management: true 
      }
    },
    notes: 'Optimized for tax efficiency with Roth conversions',
  };

  await createScenario(baseScenario);
  await createScenario(taxAwareScenario);

  // Record planning receipts
  const planReceipt1 = await recordReceipt({
    id: `demo_plan_${Date.now()}_1`,
    type: 'Decision-RDS',
    action: 'PLAN_RUN',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:base_${Date.now()}`,
    reasons: ['PLAN_SAVED'],
    created_at: new Date().toISOString(),
  });

  const planReceipt2 = await recordReceipt({
    id: `demo_plan_${Date.now()}_2`,
    type: 'Decision-RDS',
    action: 'PLAN_RUN',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:tax_${Date.now()}`,
    reasons: ['PLAN_SAVED'],
    created_at: new Date().toISOString(),
  });

  // Create reviews with different guardrail states
  const baseReview: Review = {
    id: 'demo_review_base_1',
    scenarioId: baseScenario.id,
    runAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    runBy: 'demo-user',
    results: {
      successProb: 0.76,
      mc_percentiles: {
        '10': 750000,
        '25': 1100000,
        '50': 1450000,
        '75': 1850000,
        '90': 2400000,
      },
      income_bands: [
        { year: 2024, guaranteed: 48000, projected: 72000, upper: 88000 },
        { year: 2025, guaranteed: 49200, projected: 74160, upper: 90640 },
      ],
      tax_buckets: { taxable: 0.40, traditional: 0.45, roth: 0.15 },
      ending_values: { median: 1450000, probability_positive: 0.76 },
    },
    guardrails: {
      triggered: true,
      recommend: { type: 'spend_down', amountPct: 8 },
    },
    artifacts: {
      pdf_url: 'demo://base-plan-story.pdf',
      csv_url: 'demo://base-plan-data.csv',
    },
  };

  const taxAwareReview: Review = {
    id: 'demo_review_tax_1',
    scenarioId: taxAwareScenario.id,
    runAt: new Date().toISOString(),
    runBy: 'demo-user',
    results: {
      successProb: 0.84,
      mc_percentiles: {
        '10': 890000,
        '25': 1250000,
        '50': 1650000,
        '75': 2100000,
        '90': 2750000,
      },
      income_bands: [
        { year: 2024, guaranteed: 48000, projected: 78000, upper: 95000 },
        { year: 2025, guaranteed: 49200, projected: 80340, upper: 97850 },
      ],
      tax_buckets: { taxable: 0.35, traditional: 0.35, roth: 0.30 },
      ending_values: { median: 1650000, probability_positive: 0.84 },
    },
    guardrails: {
      triggered: false,
    },
    diffs: {
      fromScenarioId: baseScenario.id,
      changed_keys: ['withdrawal_policy.order', 'withdrawal_policy.tax_rules.roth_conversion_limit'],
    },
  };

  await createReview(baseReview);
  await createReview(taxAwareReview);

  // Record guardrail evaluation receipts
  await recordReceipt({
    id: `demo_guardrail_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'GUARDRAIL_EVAL',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:guardrail_${Date.now()}`,
    reasons: ['GUARDRAIL_TRIGGERED', 'SPEND_RECOMMENDATION'],
    created_at: new Date().toISOString(),
  });

  // Record vault receipts for artifacts
  await recordReceipt({
    id: `demo_vault_${Date.now()}`,
    type: 'Vault-RDS',
    action: 'ARTIFACT_STORE',
    policy_version: 'E-2025.08',
    inputs_hash: `sha256:vault_${Date.now()}`,
    reasons: ['PDF_EXPORT', 'CSV_EXPORT'],
    created_at: new Date().toISOString(),
  });

  analytics.track('demo.e2e.complete', { name: 'retiree-roadmap' });

  console.log('✅ Retirement Roadmap demo data seeded successfully');
  return {
    scenarios: [baseScenario, taxAwareScenario],
    reviews: [baseReview, taxAwareReview],
    receipts: [planReceipt1, planReceipt2],
  };
}