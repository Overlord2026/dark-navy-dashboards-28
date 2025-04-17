
import { SubscriptionTierType } from '../subscription';

export interface SubscriptionContextState {
  currentTier: SubscriptionTierType;
  isInFreeTrial: boolean;
  freeTrialEndDate: Date | null;
  daysRemainingInTrial: number | null;
  trialWasExtended: boolean;
}

export interface SubscriptionContextValue extends SubscriptionContextState {
  isFeatureAvailable: (featureId: string) => boolean;
  upgradeTier: (newTier: SubscriptionTierType) => void;
  isUpgradeRequired: (featureId: string) => boolean;
  startFreeTrial: () => void;
  endFreeTrial: () => void;
  extendTrial: (days: number) => void;
}
