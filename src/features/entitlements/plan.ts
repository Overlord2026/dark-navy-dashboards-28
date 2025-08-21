export type Plan = 'basic' | 'premium' | 'elite';

export interface PlanDetails {
  name: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
}

const plans: Record<Plan, PlanDetails> = {
  basic: {
    name: 'Basic',
    price: 0,
    features: ['Basic Education Modules', 'Standard Disclosures', 'Simple Contracts'],
    limits: {
      offers: 5,
      consents: 10,
      contracts: 3
    }
  },
  premium: {
    name: 'Premium',
    price: 29,
    features: ['All Education Modules', 'Advanced Disclosures', 'Contract Templates', 'Split Preview'],
    limits: {
      offers: 25,
      consents: 50,
      contracts: 15
    }
  },
  elite: {
    name: 'Elite',
    price: 99,
    features: ['Everything in Premium', 'White-label Portal', 'Advanced Analytics', 'Priority Support'],
    limits: {
      offers: 999,
      consents: 999,
      contracts: 999
    }
  }
};

let currentPlan: Plan = 'basic';

export function getPlan(): Plan {
  return currentPlan;
}

export function setPlan(plan: Plan): void {
  currentPlan = plan;
  console.info('plan.changed', { plan, features: plans[plan].features });
}

export function getPlanDetails(plan: Plan): PlanDetails {
  return plans[plan];
}

export function getAllPlans(): Record<Plan, PlanDetails> {
  return plans;
}

export function canAccess(feature: string): boolean {
  const plan = getPlan();
  const details = getPlanDetails(plan);
  
  // Check feature gates
  const featureGates: Record<string, Plan> = {
    'advanced_analytics': 'premium',
    'white_label': 'elite',
    'priority_support': 'elite',
    'unlimited_offers': 'premium',
    'advanced_contracts': 'premium'
  };

  const requiredPlan = featureGates[feature];
  if (!requiredPlan) return true; // No gate for this feature
  
  const planHierarchy = { basic: 1, premium: 2, elite: 3 };
  return planHierarchy[plan] >= planHierarchy[requiredPlan];
}

export function checkLimit(resource: string, current: number): { allowed: boolean; limit: number } {
  const plan = getPlan();
  const details = getPlanDetails(plan);
  const limit = details.limits[resource] || 0;
  
  return {
    allowed: current < limit,
    limit
  };
}