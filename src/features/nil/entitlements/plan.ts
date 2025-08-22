type Plan = 'basic' | 'pro' | 'enterprise';

interface PlanFeatures {
  maxOffers: number;
  advancedAnalytics: boolean;
  customContracts: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
}

const planFeatures: Record<Plan, PlanFeatures> = {
  basic: {
    maxOffers: 3,
    advancedAnalytics: false,
    customContracts: false,
    prioritySupport: false,
    apiAccess: false
  },
  pro: {
    maxOffers: 25,
    advancedAnalytics: true,
    customContracts: true,
    prioritySupport: true,
    apiAccess: false
  },
  enterprise: {
    maxOffers: -1, // unlimited
    advancedAnalytics: true,
    customContracts: true,
    prioritySupport: true,
    apiAccess: true
  }
};

let currentPlan: Plan = 'basic';

export function getPlan(): Plan {
  return currentPlan;
}

export function setPlan(plan: Plan): void {
  currentPlan = plan;
  console.info('plan.updated', { plan });
}

export function getPlanFeatures(plan?: Plan): PlanFeatures {
  return planFeatures[plan || currentPlan];
}

export function hasFeature(feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures();
  return features[feature] === true;
}

export function canCreateOffer(): boolean {
  const features = getPlanFeatures();
  if (features.maxOffers === -1) return true;
  
  // In a real implementation, this would check current offer count
  // For demo purposes, simulate limit reached for basic plan
  const currentOffers = 0; // This would come from actual data
  return currentOffers < features.maxOffers;
}

export function getBlockedFeatureMessage(feature: string): string {
  const plan = getPlan();
  
  switch (feature) {
    case 'offers':
      return `Upgrade to Pro to create more offers. Current plan: ${plan}`;
    case 'analytics':
      return `Advanced analytics available in Pro and Enterprise plans. Current plan: ${plan}`;
    case 'custom_contracts':
      return `Custom contract templates available in Pro and Enterprise plans. Current plan: ${plan}`;
    case 'api':
      return `API access available in Enterprise plan only. Current plan: ${plan}`;
    default:
      return `This feature requires a higher plan. Current plan: ${plan}`;
  }
}