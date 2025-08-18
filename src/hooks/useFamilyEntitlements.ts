import { useState, useEffect } from 'react';
import { SubscriptionTier, FamilySegment, FamilyCard, QuickAction, familyCards, quickActions } from '@/data/familiesPricingTiers';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

export type { FamilySegment };

export interface FamilyEntitlements {
  currentTier: SubscriptionTier;
  segment: FamilySegment;
  availableCards: FamilyCard[];
  availableActions: QuickAction[];
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
  getCardQuota: (cardId: string) => number | null;
  isCardAccessible: (card: FamilyCard) => boolean;
  isActionAccessible: (action: QuickAction) => boolean;
}

export function useFamilyEntitlements(selectedSegment: FamilySegment = 'aspiring'): FamilyEntitlements {
  const { subscriptionPlan, isLoading } = useSubscriptionAccess();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('basic');

  useEffect(() => {
    if (!isLoading && subscriptionPlan) {
      // Map subscription plan tier to our family tier system
      const tier = subscriptionPlan.subscription_tier || 'basic';
      if (tier === 'free') {
        setCurrentTier('basic');
      } else if (['basic', 'premium', 'elite'].includes(tier)) {
        setCurrentTier(tier as SubscriptionTier);
      } else {
        setCurrentTier('basic');
      }
    }
  }, [subscriptionPlan, isLoading]);

  const tierHierarchy: Record<SubscriptionTier, number> = {
    basic: 1,
    premium: 2,
    elite: 3
  };

  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
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
    getCardQuota,
    isCardAccessible,
    isActionAccessible
  };
}