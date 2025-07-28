export interface SubscriptionFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number | string;
  description: string;
  features: SubscriptionFeature[];
  recommended?: boolean;
  buttonText: string;
  color?: string;
}

export type SubscriptionTierType = 'free' | 'basic' | 'premium' | 'elite';

// New types for add-on access and metered usage
export interface AddOnAccess {
  lending_access: boolean;
  tax_access: boolean;
  ai_features_access: boolean;
  premium_analytics_access: boolean;
  residency_optimization: boolean;
  advisor_marketplace: boolean;
  audit_risk_analyzer: boolean;
  relocation_concierge: boolean;
}

export interface UsageCounters {
  lending_applications: number;
  tax_analyses: number;
  ai_queries: number;
  document_uploads: number;
}

export interface UsageLimits {
  lending_applications_limit: number;
  tax_analyses_limit: number;
  ai_queries_limit: number;
  document_uploads_limit: number;
}

export interface SubscriptionPlan {
  tier: SubscriptionTierType;
  add_ons: AddOnAccess;
  usage_counters: UsageCounters;
  usage_limits: UsageLimits;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  is_active: boolean;
}

export interface PremiumUpgradePrompt {
  feature_name: string;
  required_tier: SubscriptionTierType;
  current_usage?: number;
  usage_limit?: number;
  add_on_required?: keyof AddOnAccess;
}