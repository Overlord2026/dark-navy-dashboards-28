import { useState, useEffect } from 'react';
import { FamilySegment, FamilyCard, QuickAction, familyCards, quickActions } from '@/data/familiesPricingTiers';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Plan, canUse, getRequiredPlan, getUpgradeTarget } from '@/lib/featureAccess';

export type { FamilySegment };

export interface FamilyEntitlements {
  currentTier: Plan;
  segment: FamilySegment;
  availableCards: FamilyCard[];
  availableActions: QuickAction[];
  hasAccess: (requiredTier: Plan) => boolean;
  canAccessFeature: (featureKey: string) => boolean;
  getCardQuota: (cardId: string) => number | null;
  isCardAccessible: (card: FamilyCard) => boolean;
  isActionAccessible: (action: QuickAction) => boolean;
  getUpgradeTarget: (featureKey: string) => Plan | null;
}

export function useFamilyEntitlements(selectedSegment: FamilySegment = 'aspiring'): FamilyEntitlements {
  const { subscriptionPlan, isLoading } = useSubscriptionAccess();
  const [currentTier, setCurrentTier] = useState<Plan>('basic');

  useEffect(() => {
    if (!isLoading && subscriptionPlan) {
      // Map subscription plan tier to our family tier system
      const tier = subscriptionPlan.subscription_tier || 'basic';
      if (tier === 'free') {
        setCurrentTier('basic');
      } else if (['basic', 'premium', 'elite'].includes(tier)) {
        setCurrentTier(tier as Plan);
      } else {
        setCurrentTier('basic');
      }
    }
  }, [subscriptionPlan, isLoading]);

  const hasAccess = (requiredTier: Plan): boolean => {
    const tierOrder = ['basic', 'premium', 'elite'];
    return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
  };

  const canAccessFeature = (featureKey: string): boolean => {
    return canUse(currentTier, featureKey as any);
  };

  const isCardAccessible = (card: FamilyCard): boolean => {
    return hasAccess(card.requiredTier) && card.segments.includes(selectedSegment);
  };

  const isActionAccessible = (action: QuickAction): boolean => {
    return hasAccess(action.requiredTier);
  };

  const getCardQuota = (cardId: string): number | null => {
    const card = familyCards.find(c => c.id === cardId);
    if (!card?.quotas) return null;
    
    return card.quotas[currentTier] || null;
  };

  const getUpgradeTargetForFeature = (featureKey: string): Plan | null => {
    return getUpgradeTarget(currentTier, featureKey as any);
  };

  const availableCards = familyCards.filter(card => 
    card.segments.includes(selectedSegment)
  );

  const availableActions = quickActions;

  return {
    currentTier,
    segment: selectedSegment,
    availableCards,
    availableActions,
    hasAccess,
    canAccessFeature,
    getCardQuota,
    isCardAccessible,
    isActionAccessible,
    getUpgradeTarget: getUpgradeTargetForFeature
  };
}