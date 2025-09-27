export const TIERS = {
  FREE: { allowAggregation: false, vaultQuota: { files: 10, mb: 50 } },
  PREMIUM: { allowAggregation: true, aggLimit: 3, vaultQuota: { files: 200, mb: 2048 } },
  PRO: { allowAggregation: true, aggLimit: 10, vaultQuota: { files: 1000, mb: 10240 } },
} as const;

export const ADVISOR_TIERS = {
  FREE: { 
    marketplaceVisibility: 'low',
    leadGeneration: 'limited', 
    clientManagement: 'basic',
    whiteLabel: false,
    marketingTools: false,
    support: 'community'
  },
  STANDARD: {
    marketplaceVisibility: 'medium',
    leadGeneration: 'standard',
    clientManagement: 'full', 
    whiteLabel: true,
    marketingTools: 'basic',
    support: 'standard'
  },
  PREMIUM: {
    marketplaceVisibility: 'high',
    leadGeneration: 'advanced',
    clientManagement: 'enterprise',
    whiteLabel: true,
    marketingTools: 'advanced', 
    support: 'priority'
  }
} as const;

export type TierType = keyof typeof TIERS;
export type AdvisorTierType = keyof typeof ADVISOR_TIERS;