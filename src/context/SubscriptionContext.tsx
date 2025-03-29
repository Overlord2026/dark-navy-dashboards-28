
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SubscriptionTierType } from '@/types/subscription';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { toast } from 'sonner';

interface SubscriptionContextProps {
  currentTier: SubscriptionTierType;
  isFeatureAvailable: (featureId: string) => boolean;
  upgradeTier: (newTier: SubscriptionTierType) => void;
  isUpgradeRequired: (featureId: string) => boolean;
  isInFreeTrial: boolean;
  freeTrialEndDate: Date | null;
  daysRemainingInTrial: number | null;
  startFreeTrial: () => void;
  endFreeTrial: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const FREE_TRIAL_DURATION_DAYS = 90;

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTierType>('basic');
  const [isInFreeTrial, setIsInFreeTrial] = useState<boolean>(false);
  const [freeTrialEndDate, setFreeTrialEndDate] = useState<Date | null>(null);
  const [daysRemainingInTrial, setDaysRemainingInTrial] = useState<number | null>(null);

  // Load free trial status from localStorage on component mount
  useEffect(() => {
    const storedTrialStatus = localStorage.getItem('freeTrialStatus');
    const storedTrialEndDate = localStorage.getItem('freeTrialEndDate');
    
    if (storedTrialStatus === 'active' && storedTrialEndDate) {
      const endDate = new Date(storedTrialEndDate);
      const now = new Date();
      
      // Check if the trial is still valid
      if (endDate > now) {
        setIsInFreeTrial(true);
        setFreeTrialEndDate(endDate);
        
        // Calculate days remaining
        const remainingTime = endDate.getTime() - now.getTime();
        const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        setDaysRemainingInTrial(remainingDays);
        
        // If in free trial, user gets access to premium features
        setCurrentTier('premium');
      } else {
        // Trial has expired
        localStorage.removeItem('freeTrialStatus');
        localStorage.removeItem('freeTrialEndDate');
        setIsInFreeTrial(false);
        setFreeTrialEndDate(null);
        setDaysRemainingInTrial(null);
        
        // When trial ends, remind user to upgrade
        toast.info('Your free trial has ended. Upgrade now to maintain premium access!', {
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/subscription',
          },
          duration: 10000, // Show for 10 seconds
        });
      }
    }
  }, []);

  // Update days remaining daily
  useEffect(() => {
    if (!isInFreeTrial || !freeTrialEndDate) return;
    
    const calculateDaysRemaining = () => {
      const now = new Date();
      const remainingTime = freeTrialEndDate.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      
      setDaysRemainingInTrial(remainingDays > 0 ? remainingDays : 0);
      
      // Handle trial expiration
      if (remainingDays <= 0) {
        endFreeTrial();
      }
    };
    
    // Calculate initially
    calculateDaysRemaining();
    
    // Set up interval to recalculate daily
    const intervalId = setInterval(calculateDaysRemaining, 1000 * 60 * 60 * 24);
    
    // Show notification when trial is about to end
    if (daysRemainingInTrial === 7) {
      toast.warning('Your free trial ends in 7 days. Upgrade now to maintain premium access!', {
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription',
        },
        duration: 10000,
      });
    } else if (daysRemainingInTrial === 3) {
      toast.warning('Your free trial ends in 3 days. Upgrade now to maintain premium access!', {
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription',
        },
        duration: 10000,
      });
    } else if (daysRemainingInTrial === 1) {
      toast.warning('Your free trial ends tomorrow. Upgrade now to maintain premium access!', {
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription',
        },
        duration: 10000,
      });
    }
    
    return () => clearInterval(intervalId);
  }, [isInFreeTrial, freeTrialEndDate, daysRemainingInTrial]);

  const startFreeTrial = () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + FREE_TRIAL_DURATION_DAYS);
    
    setIsInFreeTrial(true);
    setFreeTrialEndDate(endDate);
    setDaysRemainingInTrial(FREE_TRIAL_DURATION_DAYS);
    setCurrentTier('premium');
    
    // Store in localStorage
    localStorage.setItem('freeTrialStatus', 'active');
    localStorage.setItem('freeTrialEndDate', endDate.toISOString());
    
    toast.success(`Your ${FREE_TRIAL_DURATION_DAYS}-day free trial has started! Enjoy premium features.`);
  };

  const endFreeTrial = () => {
    setIsInFreeTrial(false);
    setFreeTrialEndDate(null);
    setDaysRemainingInTrial(null);
    setCurrentTier('basic');
    
    // Clear from localStorage
    localStorage.removeItem('freeTrialStatus');
    localStorage.removeItem('freeTrialEndDate');
  };

  const isFeatureAvailable = (featureId: string): boolean => {
    // During free trial, user has access to both basic and premium features
    if (isInFreeTrial) {
      // Check if the feature is available in the premium tier
      const premiumTier = subscriptionTiers.find(tier => tier.id === 'premium');
      if (!premiumTier) return false;
      
      const premiumFeature = premiumTier.features.find(feature => feature.id === featureId);
      return premiumFeature?.included || false;
    }
    
    // Regular subscription check
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
    
    // If upgrading, end free trial
    if (isInFreeTrial) {
      endFreeTrial();
    }
    
    toast.success(`Successfully upgraded to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} tier!`);
  };

  return (
    <SubscriptionContext.Provider value={{ 
      currentTier, 
      isFeatureAvailable, 
      upgradeTier,
      isUpgradeRequired,
      isInFreeTrial,
      freeTrialEndDate,
      daysRemainingInTrial,
      startFreeTrial,
      endFreeTrial
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
