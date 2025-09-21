import { useEffect, useMemo, useState } from 'react';
import { SubscriptionTierType, AddOnAccess, UsageCounters, UsageLimits } from '@/types/subscription';

export type SubscriptionAccess = {
  plan: string | null;
  features: Record<string, boolean>;
  loading: boolean;
};

interface UserProfile {
  subscription_tier: SubscriptionTierType;
  subscription_status: string;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: SubscriptionTierType;
  add_ons?: AddOnAccess;
  usage_counters?: UsageCounters;
  usage_limits?: UsageLimits;
  is_active?: boolean;
}

function buildFeatures(plan: string | null): Record<string, boolean> {
  switch (plan) {
    case 'premium':
    case 'elite':
      return { reports: true, accounts: true, cashflow: true, invites: true };
    case 'basic':
      return { reports: false, accounts: true, cashflow: true, invites: true };
    default:
      return { reports: false, accounts: true, cashflow: true, invites: false };
  }
}

function createMockProfile(tier: SubscriptionTierType): UserProfile {
  return {
    subscription_tier: tier,
    subscription_status: 'active',
    subscription_end_date: null,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    tier: tier,
    add_ons: {
      lending_access: tier === 'premium' || tier === 'elite',
      tax_access: tier === 'premium' || tier === 'elite',
      ai_features_access: tier === 'premium' || tier === 'elite',
      premium_analytics_access: tier === 'premium' || tier === 'elite',
      residency_optimization: tier === 'premium' || tier === 'elite',
      advisor_marketplace: tier === 'elite',
      audit_risk_analyzer: tier === 'elite',
      relocation_concierge: tier === 'elite',
      bill_pay_premium: tier === 'premium' || tier === 'elite',
      premium_property_features: tier === 'premium' || tier === 'elite',
    },
    usage_counters: {
      lending_applications: 0,
      tax_analyses: 0,
      ai_queries: 0,
      document_uploads: 0,
    },
    usage_limits: {
      lending_applications_limit: tier === 'free' ? 1 : tier === 'basic' ? 5 : 999,
      tax_analyses_limit: tier === 'free' ? 1 : tier === 'basic' ? 3 : 999,
      ai_queries_limit: tier === 'free' ? 10 : tier === 'basic' ? 100 : 999,
      document_uploads_limit: tier === 'free' ? 5 : tier === 'basic' ? 25 : 999,
    },
    is_active: true,
  };
}

export function useSubscriptionAccess() {
  const [plan, setPlan] = useState<string | null>(null);
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Try Supabase plan; fall back to anonymous/basic
        const m = await import('@/lib/supabase').catch(() => null);
        const sb: any = m ? (m as any).supabase || (m as any).default || m : null;

        let currentPlan: string | null = null;

        if (sb?.rpc) {
          try {
            const { data, error } = await sb.rpc('get_current_plan', {});
            if (!error && data && typeof data.plan === 'string') currentPlan = data.plan;
          } catch { /* ignore and fall back */ }
        }
        if (!currentPlan && sb?.from) {
          try {
            const { data } = await sb.from('profiles').select('plan').limit(1).maybeSingle?.() ?? {};
            if (data?.plan) currentPlan = data.plan as string;
          } catch { /* ignore */ }
        }

        const finalPlan = currentPlan ?? 'basic';
        setPlan(finalPlan);
        setFeatures(buildFeatures(finalPlan));
        setSubscriptionPlan(createMockProfile(finalPlan as SubscriptionTierType));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const checkFeatureAccess = (tier: SubscriptionTierType): boolean => {
    if (!subscriptionPlan) return false;
    
    const tierHierarchy = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'elite': 3
    };
    
    const currentTierLevel = tierHierarchy[subscriptionPlan.subscription_tier] || 0;
    const requiredTierLevel = tierHierarchy[tier] || 0;
    
    return currentTierLevel >= requiredTierLevel && subscriptionPlan.subscription_status === 'active';
  };

  const checkAddOnAccess = (addOnKey: keyof AddOnAccess): boolean => {
    if (!subscriptionPlan?.add_ons) return false;
    return subscriptionPlan.add_ons[addOnKey] || false;
  };

  const checkUsageLimit = (usageType: keyof UsageCounters): boolean => {
    if (!subscriptionPlan?.usage_counters || !subscriptionPlan?.usage_limits) return true;
    const current = subscriptionPlan.usage_counters[usageType] || 0;
    const limit = subscriptionPlan.usage_limits[usageType] || 0;
    return current < limit;
  };

  const incrementUsage = async (usageType: keyof UsageCounters): Promise<void> => {
    console.log(`Incrementing usage for ${usageType}`);
  };

  const isSubscriptionActive = (): boolean => {
    return subscriptionPlan?.subscription_status === 'active';
  };

  const syncWithStripe = async () => {
    console.log('Syncing with Stripe');
  };

  const fetchSubscriptionData = async () => {
    console.log('Fetching subscription data');
  };

  return useMemo(() => ({
    plan,
    features,
    loading,
    subscriptionPlan,
    isLoading: loading,
    checkFeatureAccess,
    checkAddOnAccess,
    checkUsageLimit,
    incrementUsage,
    isSubscriptionActive,
    syncWithStripe,
    fetchSubscriptionData
  }), [plan, features, loading, subscriptionPlan]);
}