// Inline legacy tiers for this hook
const LEGACY_TIERS = {
  FREE: { allowAggregation: false, vaultQuota: { files: 10, mb: 50 } },
  PREMIUM: { allowAggregation: true, aggLimit: 3, vaultQuota: { files: 200, mb: 2048 } },
  PRO: { allowAggregation: true, aggLimit: 10, vaultQuota: { files: 1000, mb: 10240 } },
} as const;

type TierType = keyof typeof LEGACY_TIERS;

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