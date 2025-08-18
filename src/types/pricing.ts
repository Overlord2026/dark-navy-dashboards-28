export type Plan = 'basic' | 'premium' | 'elite';

export type FeatureKey = 
  | 'doc_vault'
  | 'advanced_analytics'
  | 'unlimited_clients'
  | 'priority_support'
  | 'custom_branding'
  | 'api_access'
  | 'white_label'
  | 'advanced_reporting'
  | 'multi_user'
  | 'sso_integration';

export interface Feature {
  key: FeatureKey;
  name: string;
  description?: string;
  category: 'core' | 'premium' | 'enterprise';
  quota?: number | 'unlimited';
}

export interface Entitlement {
  featureKey: FeatureKey;
  hasAccess: boolean;
  quota?: number | 'unlimited';
  usedQuota?: number;
  remainingQuota?: number | 'unlimited';
}

export interface PackageInclude {
  plan: Plan;
  features: FeatureKey[];
  quotas: Record<FeatureKey, number | 'unlimited'>;
}

export interface UserEntitlements {
  plan: Plan;
  persona?: string;
  segment?: string;
  entitlements: Record<FeatureKey, Entitlement>;
}

export const PLAN_FEATURES: Record<Plan, FeatureKey[]> = {
  basic: ['doc_vault'],
  premium: ['doc_vault', 'advanced_analytics', 'priority_support', 'advanced_reporting'],
  elite: ['doc_vault', 'advanced_analytics', 'priority_support', 'advanced_reporting', 'unlimited_clients', 'custom_branding', 'api_access', 'white_label', 'multi_user', 'sso_integration']
};

export const FEATURE_QUOTAS: Record<Plan, Partial<Record<FeatureKey, number | 'unlimited'>>> = {
  basic: {
    doc_vault: 10,
  },
  premium: {
    doc_vault: 100,
    advanced_analytics: 'unlimited',
  },
  elite: {
    doc_vault: 'unlimited',
    advanced_analytics: 'unlimited',
    unlimited_clients: 'unlimited',
    api_access: 'unlimited',
  }
};