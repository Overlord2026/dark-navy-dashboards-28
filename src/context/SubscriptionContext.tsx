
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SubscriptionPlan, SubscriptionTier } from '@/types/education';
import { subscriptionTiers } from '@/data/education/subscriptionTiers';

interface SubscriptionContextProps {
  currentTier: SubscriptionTier;
  updateSubscription: (tier: SubscriptionTier) => void;
  canAccessTier: (requiredTier?: SubscriptionTier) => boolean;
  currentPlan: SubscriptionPlan;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("Basic");

  const updateSubscription = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
  };

  const canAccessTier = (requiredTier?: SubscriptionTier): boolean => {
    if (!requiredTier) return true;
    
    const tierLevels: Record<SubscriptionTier, number> = {
      "Basic": 1,
      "Premium": 2,
      "Elite": 3
    };
    
    return tierLevels[currentTier] >= tierLevels[requiredTier];
  };

  const currentPlan = subscriptionTiers.find(plan => plan.id === currentTier) || subscriptionTiers[0];

  return (
    <SubscriptionContext.Provider
      value={{
        currentTier,
        updateSubscription,
        canAccessTier,
        currentPlan
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
