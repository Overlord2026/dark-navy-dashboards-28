import { recordHealthRDS } from '@/features/healthcare/receipts';
import { ScreeningRule, ScreeningFacts, generateZKPredicates, isScreeningCovered } from './rules';

export interface ScreeningGateResult {
  screening_key: string;
  authorized: boolean;
  reasons: string[];
  health_rds: any;
  zk_predicates: Record<string, boolean>;
}

/**
 * Gate a screening request against guidelines and plan coverage
 */
export function gateScreening(
  screeningRule: ScreeningRule, 
  facts: ScreeningFacts,
  consentFresh: boolean = true
): ScreeningGateResult {
  
  const zkPredicates = generateZKPredicates(facts.age);
  const reasons: string[] = [];
  let authorized = true;
  
  // Check consent freshness
  if (!consentFresh) {
    reasons.push('CONSENT_STALE');
    authorized = false;
  }
  
  // Check ZK age eligibility
  const ageEligible = (!screeningRule.zk.ageGte || zkPredicates[`ageGte${screeningRule.zk.ageGte}`]) &&
                     (!screeningRule.zk.ageLte || zkPredicates[`ageLte${screeningRule.zk.ageLte}`]);
  
  if (ageEligible) {
    reasons.push('USPSTF_ELIGIBLE');
  } else {
    reasons.push('AGE_INELIGIBLE');
    authorized = false;
  }
  
  // Check sex requirements
  if (screeningRule.zk.sexRequired && facts.sex !== screeningRule.zk.sexRequired) {
    reasons.push('SEX_INELIGIBLE');
    authorized = false;
  } else if (screeningRule.zk.sexRequired) {
    reasons.push('SEX_ELIGIBLE');
  }
  
  // Check plan coverage
  if (isScreeningCovered(screeningRule, facts)) {
    reasons.push('COVERED');
  } else {
    reasons.push('NOT_COVERED');
    authorized = false;
  }
  
  // Check if referral required
  if (screeningRule.planCoverage.requires_referral) {
    reasons.push('REFERRAL_REQUIRED');
  }
  
  // Generate inputs hash (ZK predicates only, no actual age/DOB)
  const inputs = {
    screening_key: screeningRule.key,
    guideline: screeningRule.guideline,
    zk_predicates: zkPredicates,
    sex_eligible: !screeningRule.zk.sexRequired || facts.sex === screeningRule.zk.sexRequired,
    plan_preventive: facts.plan.preventive_coverage,
    consent_fresh: consentFresh
  };
  
  // Generate Health-RDS
  const healthRds = recordHealthRDS(
    `authorize_screening_${screeningRule.key}`,
    inputs,
    authorized ? 'allow' : 'deny',
    reasons,
    [`screening_${authorized ? 'authorized' : 'denied'}`],
    {
      estimated_cost_cents: authorized ? getEstimatedScreeningCost(screeningRule.key) : undefined,
      coverage_type: facts.plan.preventive_coverage ? 'preventive' : 'diagnostic'
    }
  );
  
  // Log analytics
  console.info('screening.gated', {
    screening: screeningRule.key,
    guideline: screeningRule.guideline,
    authorized,
    reasons_count: reasons.length,
    has_coverage: isScreeningCovered(screeningRule, facts),
    zk_age_eligible: ageEligible
  });
  
  return {
    screening_key: screeningRule.key,
    authorized,
    reasons,
    health_rds: healthRds,
    zk_predicates: zkPredicates
  };
}

/**
 * Get estimated screening cost (mock data)
 */
function getEstimatedScreeningCost(screeningKey: string): number {
  const costs: Record<string, number> = {
    colorectal: 120000, // $1,200
    mammography: 25000, // $250
    cervical: 15000,    // $150
    prostate_psa: 8000, // $80
    lung_cancer: 35000, // $350
    bone_density: 30000, // $300
    cholesterol: 12000, // $120
    diabetes: 8000     // $80
  };
  
  return costs[screeningKey] || 10000; // $100 default
}

/**
 * Schedule screening and generate Health-RDS
 */
export function scheduleScreening(
  screeningRule: ScreeningRule,
  scheduledDate: string,
  facts: ScreeningFacts
) {
  const inputs = {
    screening_key: screeningRule.key,
    scheduled_date: scheduledDate,
    guideline: screeningRule.guideline,
    zk_predicates: generateZKPredicates(facts.age)
  };
  
  return recordHealthRDS(
    `schedule_screening_${screeningRule.key}`,
    inputs,
    'allow',
    ['SCREENING_SCHEDULED', 'GUIDELINE_COMPLIANT'],
    ['screening_appointment_created'],
    {
      estimated_cost_cents: getEstimatedScreeningCost(screeningRule.key),
      coverage_type: 'preventive'
    }
  );
}

/**
 * Record screening completion and generate Health-RDS
 */
export function recordScreeningCompletion(
  screeningRule: ScreeningRule,
  completedDate: string,
  result: 'normal' | 'abnormal' | 'follow_up_needed',
  facts: ScreeningFacts
) {
  const inputs = {
    screening_key: screeningRule.key,
    completed_date: completedDate,
    result_category: result,
    guideline: screeningRule.guideline,
    zk_predicates: generateZKPredicates(facts.age)
  };
  
  const reasons = ['SCREENING_COMPLETED'];
  if (result === 'normal') {
    reasons.push('NORMAL_RESULT');
  } else if (result === 'abnormal') {
    reasons.push('ABNORMAL_RESULT');
  } else {
    reasons.push('FOLLOW_UP_NEEDED');
  }
  
  return recordHealthRDS(
    `complete_screening_${screeningRule.key}`,
    inputs,
    'allow',
    reasons,
    ['screening_result_recorded'],
    {
      estimated_cost_cents: getEstimatedScreeningCost(screeningRule.key),
      coverage_type: 'preventive'
    }
  );
}