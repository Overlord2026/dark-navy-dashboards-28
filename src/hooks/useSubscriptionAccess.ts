/** Demo-safe stub: returns open access; NO React imports or hooks. */

export type SubscriptionAccess = { 
  canUse: boolean; 
  features?: Record<string, boolean>;
  plan?: string;
  loading?: boolean;
  isLoading?: boolean;
  subscriptionPlan?: any;
  checkFeatureAccess?: (tier: any) => boolean;
  checkAddOnAccess?: (addOn: any) => boolean;
  checkUsageLimit?: (usageType: any) => boolean;
  incrementUsage?: (usageType: any) => Promise<void>;
  syncWithStripe?: () => Promise<void>;
};

export function useSubscriptionAccess(): SubscriptionAccess {
  return { 
    canUse: true, 
    features: {},
    plan: 'basic',
    loading: false,
    isLoading: false,
    subscriptionPlan: null,
    checkFeatureAccess: () => true,
    checkAddOnAccess: () => true,
    checkUsageLimit: () => true,
    incrementUsage: async () => {},
    syncWithStripe: async () => {}
  };
}

export default useSubscriptionAccess;
