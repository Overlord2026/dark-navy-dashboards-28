
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { SubscriptionTierType } from '@/types/subscription';

export function isFeatureAvailableForTier(
  featureId: string, 
  currentTier: SubscriptionTierType, 
  isInFreeTrial: boolean
): boolean {
  if (isInFreeTrial) {
    const premiumTier = subscriptionTiers.find(tier => tier.id === 'premium');
    if (!premiumTier) return false;
    
    const premiumFeature = premiumTier.features.find(feature => feature.id === featureId);
    return premiumFeature?.included || false;
  }
  
  const tier = subscriptionTiers.find(tier => tier.id === currentTier);
  if (!tier) return false;
  
  const feature = tier.features.find(feature => feature.id === featureId);
  return feature?.included || false;
}

export function isUpgradeRequiredForFeature(
  featureId: string, 
  currentTier: SubscriptionTierType
): boolean {
  if (isFeatureAvailableForTier(featureId, currentTier, false)) return false;
  
  return subscriptionTiers.some(tier => {
    if (tier.id === currentTier) return false;
    return tier.features.some(feature => feature.id === featureId && feature.included);
  });
}

export function calculateRemainingTrialDays(endDate: Date): number {
  const now = new Date();
  const remainingTime = endDate.getTime() - now.getTime();
  return Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
}
