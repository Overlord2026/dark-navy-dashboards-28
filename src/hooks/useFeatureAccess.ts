import { useSubscriptionAccess } from './useSubscriptionAccess';
import { SubscriptionTierType, AddOnAccess, UsageCounters } from '@/types/subscription';

// Map add-on features to their minimum required tier
// Note: Consultants get lending access as part of their professional tier
const ADDON_TO_TIER_MAP: Record<keyof AddOnAccess, SubscriptionTierType> = {
  lending_access: 'basic', // Lowered for consultant access
  tax_access: 'premium', 
  ai_features_access: 'premium',
  premium_analytics_access: 'premium',
  residency_optimization: 'premium',
  advisor_marketplace: 'elite',
  audit_risk_analyzer: 'elite',
  relocation_concierge: 'elite',
  bill_pay_premium: 'premium',
  premium_property_features: 'premium',
};

export function useFeatureAccess() {
  const subscription = useSubscriptionAccess();

  const checkFeatureAccessByKey = (featureKey: keyof AddOnAccess | SubscriptionTierType): boolean => {
    // If it's a tier, use the tier-based check
    if (['free', 'basic', 'premium', 'elite'].includes(featureKey as string)) {
      return subscription.checkFeatureAccess(featureKey as SubscriptionTierType);
    }
    
    // Special case: Consultants get lending access regardless of tier
    // Note: Role checking should be done at component level, not subscription level
    
    // If it's an add-on feature, map to tier requirement
    const requiredTier = ADDON_TO_TIER_MAP[featureKey as keyof AddOnAccess];
    if (requiredTier) {
      return subscription.checkFeatureAccess(requiredTier);
    }
    
    return false;
  };

  const getUsageStatus = (usageType: keyof UsageCounters) => {
    if (!subscription.subscriptionPlan?.usage_counters || !subscription.subscriptionPlan?.usage_limits) {
      return {
        hasAccess: true,
        remaining: 999,
        isAtLimit: false
      };
    }

    const current = subscription.subscriptionPlan.usage_counters[usageType] || 0;
    const limit = subscription.subscriptionPlan.usage_limits[usageType] || 0;
    const remaining = Math.max(0, limit - current);

    return {
      hasAccess: current < limit,
      remaining,
      isAtLimit: remaining === 0
    };
  };

  return {
    ...subscription,
    checkFeatureAccessByKey,
    getUsageStatus,
  };
}