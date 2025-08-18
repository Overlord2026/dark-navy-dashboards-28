export type Plan = 'basic' | 'premium' | 'elite';
export const PLAN_ORDER: Plan[] = ['basic','premium','elite'];

export const FEATURE_MATRIX = {
  calculators_basic: { minPlan: 'basic' as Plan },
  calculators_advanced: { minPlan: 'premium' as Plan }, // Monte Carlo, RMD reports
  secure_vault: { minPlan: 'premium' as Plan },
  custody_router: { minPlan: 'elite' as Plan },
  nil_booking: { minPlan: 'basic' as Plan },
  
  // Family Office Features
  accounts_overview: { minPlan: 'basic' as Plan },
  goal_tracking: { minPlan: 'basic' as Plan },
  document_vault: { minPlan: 'basic' as Plan },
  cash_transfers: { minPlan: 'basic' as Plan },
  vault_advanced: { minPlan: 'premium' as Plan },
  properties: { minPlan: 'premium' as Plan },
  estate_advanced: { minPlan: 'premium' as Plan },
  tax_advanced: { minPlan: 'premium' as Plan },
  e_sign_ron_ipen: { minPlan: 'elite' as Plan },
  concierge: { minPlan: 'elite' as Plan },
  
  // Quick Actions
  link_accounts: { minPlan: 'basic' as Plan },
  upload_doc: { minPlan: 'basic' as Plan },
  create_goal: { minPlan: 'basic' as Plan },
  run_swag: { minPlan: 'premium' as Plan },
  run_monte_carlo: { minPlan: 'premium' as Plan },
  invite_pro: { minPlan: 'basic' as Plan },

  // Features from familiesEntitlements.ts
  education_access: { minPlan: 'basic' as Plan },
  account_link: { minPlan: 'basic' as Plan },
  doc_upload_basic: { minPlan: 'basic' as Plan },
  goals_basic: { minPlan: 'basic' as Plan },
  invite_pros: { minPlan: 'basic' as Plan },
  swag_lite: { minPlan: 'basic' as Plan },
  monte_carlo_lite: { minPlan: 'basic' as Plan },
  doc_upload_pro: { minPlan: 'premium' as Plan },
  rmd_planner: { minPlan: 'premium' as Plan },
  reports: { minPlan: 'premium' as Plan },
  esign_basic: { minPlan: 'premium' as Plan },
  goals_pro: { minPlan: 'premium' as Plan },
  advisor_collab: { minPlan: 'premium' as Plan },
  esign_pro: { minPlan: 'elite' as Plan },
  governance: { minPlan: 'elite' as Plan },
  multi_entity: { minPlan: 'elite' as Plan },
  reports_pro: { minPlan: 'elite' as Plan },
  beneficiaries_review: { minPlan: 'premium' as Plan }
} as const;

export type FeatureKey = keyof typeof FEATURE_MATRIX;

export function canUse(plan: Plan, featureKey: FeatureKey): boolean {
  const featureConfig = FEATURE_MATRIX[featureKey];
  if (!featureConfig) {
    console.warn(`Feature key '${featureKey}' not found in FEATURE_MATRIX`);
    return false; // Default to no access for unknown features
  }
  const need = featureConfig.minPlan;
  return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(need);
}

export function getRequiredPlan(featureKey: FeatureKey): Plan {
  return FEATURE_MATRIX[featureKey].minPlan;
}

export function getPlanFeatures(plan: Plan): FeatureKey[] {
  return Object.keys(FEATURE_MATRIX).filter(key => 
    canUse(plan, key as FeatureKey)
  ) as FeatureKey[];
}

export function getUpgradeTarget(currentPlan: Plan, featureKey: FeatureKey): Plan | null {
  const requiredPlan = getRequiredPlan(featureKey);
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  const requiredIndex = PLAN_ORDER.indexOf(requiredPlan);
  
  if (currentIndex >= requiredIndex) return null; // Already has access
  return requiredPlan;
}