import { useSearchParams } from 'react-router-dom';
import { BADGES, TIERS } from '@/config/tiers';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

type PlanKey = FamilyPlanKey | AdvisorPlanKey;

interface CheckoutPlan {
  planKey: PlanKey | null;
  badge: string;
  features: string[];
  checkoutHref: string;
}

export function useCheckoutPlan(): CheckoutPlan {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') as PlanKey | null;
  
  // Validate plan key
  const isValidPlan = (plan: string | null): plan is PlanKey => {
    if (!plan) return false;
    return [...TIERS.families.order, ...TIERS.advisor.order].includes(plan as any);
  };
  
  const planKey = isValidPlan(planParam) ? planParam : null;
  
  // Get features for plan
  const getFeatures = (key: PlanKey): readonly string[] => {
    if (key in TIERS.families.features) {
      return TIERS.families.features[key as FamilyPlanKey];
    }
    if (key in TIERS.advisor.features) {
      return TIERS.advisor.features[key as AdvisorPlanKey];
    }
    return [];
  };
  
  // Get badge text and features
  const badge = planKey ? BADGES[planKey] : '';
  const features = planKey ? [...getFeatures(planKey)] : [];
  
  // Get checkout href
  const getCheckoutHref = (key: PlanKey | null): string => {
    if (!key) return '/pricing';
    
    // Check family plans first
    if (key in TIERS.families.checkout) {
      return TIERS.families.checkout[key as FamilyPlanKey];
    }
    
    // Check advisor plans
    if (key in TIERS.advisor.checkout) {
      return TIERS.advisor.checkout[key as AdvisorPlanKey];
    }
    
    return '/pricing';
  };
  
  const checkoutHref = getCheckoutHref(planKey);
  
  return {
    planKey,
    badge,
    features,
    checkoutHref,
  };
}