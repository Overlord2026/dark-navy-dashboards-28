import { useSearchParams } from 'react-router-dom';
import { BADGES, TIERS } from '@/config/tiers';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

type PlanKey = FamilyPlanKey | AdvisorPlanKey;

interface CheckoutPlan {
  planKey: PlanKey | null;
  badge: string;
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
  
  // Get badge text
  const badge = planKey ? BADGES[planKey] : '';
  
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
    checkoutHref,
  };
}