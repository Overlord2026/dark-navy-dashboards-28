export const TIERS = {
  FREE: { allowAggregation: false, vaultQuota: { files: 10, mb: 50 } },
  PREMIUM: { allowAggregation: true, aggLimit: 3, vaultQuota: { files: 200, mb: 2048 } },
  PRO: { allowAggregation: true, aggLimit: 10, vaultQuota: { files: 1000, mb: 10240 } },
} as const;

export type TierType = keyof typeof TIERS;