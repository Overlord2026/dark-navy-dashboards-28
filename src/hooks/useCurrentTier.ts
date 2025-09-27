import { LEGACY_TIERS, type TierType } from '@/config/tiers';

// Mock hook - in real app this would check user's subscription
export function useCurrentTier(): { tier: TierType; tierConfig: typeof LEGACY_TIERS[TierType] } {
  // For now, return FREE tier as default
  // In production, this would check the user's actual subscription
  const tier: TierType = 'FREE';
  
  return {
    tier,
    tierConfig: LEGACY_TIERS[tier]
  };
}