
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SubscriptionTierType } from '@/types/subscription';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { toast } from 'sonner';

interface SubscriptionContextProps {
  currentTier: SubscriptionTierType;
  isFeatureAvailable: (featureId: string) => boolean;
  upgradeTier: (newTier: SubscriptionTierType) => void;
  isUpgradeRequired: (featureId: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTierType>('basic');

  const isFeatureAvailable = (featureId: string): boolean => {
    const tier = subscriptionTiers.find(tier => tier.id === currentTier);
    if (!tier) return false;
    
    const feature = tier.features.find(feature => feature.id === featureId);
    return feature?.included || false;
  };

  const isUpgradeRequired = (featureId: string): boolean => {
    if (isFeatureAvailable(featureId)) return false;
    
    // Check if the feature is available in any higher tier
    return subscriptionTiers.some(tier => {
      if (tier.id === currentTier) return false;
      return tier.features.some(feature => feature.id === featureId && feature.included);
    });
  };

  const upgradeTier = (newTier: SubscriptionTierType) => {
    setCurrentTier(newTier);
    toast.success(`Successfully upgraded to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} tier!`);
  };

  return (
    <SubscriptionContext.Provider value={{ 
      currentTier, 
      isFeatureAvailable, 
      upgradeTier,
      isUpgradeRequired
    }}>
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
