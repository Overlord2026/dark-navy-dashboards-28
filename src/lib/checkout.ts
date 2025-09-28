import { TIERS } from '@/config/tiers';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

export type PlanKey = FamilyPlanKey | AdvisorPlanKey;

export interface CheckoutOptions {
  successUrl?: string;
  cancelUrl?: string;
}

export class CheckoutService {
  /**
   * Create checkout session for a given plan
   */
  static async createCheckoutSession(
    planKey: PlanKey,
    options: CheckoutOptions = {}
  ): Promise<string> {
    // Map plan keys to Stripe price IDs
    const priceIdMap: Record<PlanKey, string> = {
      // Family plans
      free: 'price_free', // Free plan doesn't need checkout
      premium: 'price_family_premium_monthly',
      pro: 'price_family_pro_monthly',
      
      // Advisor plans  
      advisor_basic: 'price_advisor_basic_monthly',
      advisor_premium: 'price_advisor_premium_monthly',
    };

    const priceId = priceIdMap[planKey];
    if (!priceId) {
      throw new Error(`No price ID configured for plan: ${planKey}`);
    }

    // For free plans, redirect directly
    if (planKey === 'free') {
      window.location.href = '/signup?plan=free';
      return '/signup?plan=free';
    }

    // Default URLs
    const defaultSuccessUrl = `${window.location.origin}/checkout/success?plan=${planKey}`;
    const defaultCancelUrl = `${window.location.origin}/pricing`;

    const successUrl = options.successUrl || defaultSuccessUrl;
    const cancelUrl = options.cancelUrl || defaultCancelUrl;

    // Import the checkout hook dynamically
    const { supabase } = await import('@/lib/supabase');
    
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { 
        priceId,
        successUrl,
        cancelUrl
      }
    });
    
    if (error) throw error;
    
    if (data?.url) {
      return data.url;
    }
    
    throw new Error('No checkout URL received');
  }

  /**
   * Get plan checkout URL from tiers config
   */
  static getPlanCheckoutUrl(planKey: PlanKey): string {
    if (planKey in TIERS.families.checkout) {
      return TIERS.families.checkout[planKey as FamilyPlanKey];
    }
    
    if (planKey in TIERS.advisor.checkout) {
      return TIERS.advisor.checkout[planKey as AdvisorPlanKey];
    }
    
    return '/pricing';
  }

  /**
   * Validate if plan key exists
   */
  static isValidPlan(planKey: string): planKey is PlanKey {
    return [...TIERS.families.order, ...TIERS.advisor.order].includes(planKey as any);
  }
}