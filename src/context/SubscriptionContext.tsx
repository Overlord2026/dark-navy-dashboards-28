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
  extendTrial: (days: number) => void;
  trialWasExtended: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(undefined);

const FREE_TRIAL_DURATION_DAYS = 90;

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTierType>('basic');
  const [isInFreeTrial, setIsInFreeTrial] = useState<boolean>(false);
  const [freeTrialEndDate, setFreeTrialEndDate] = useState<Date | null>(null);
  const [daysRemainingInTrial, setDaysRemainingInTrial] = useState<number | null>(null);
  const [trialWasExtended, setTrialWasExtended] = useState<boolean>(false);

  useEffect(() => {
    const storedTrialStatus = localStorage.getItem('freeTrialStatus');
    const storedTrialEndDate = localStorage.getItem('freeTrialEndDate');
    
    if (storedTrialStatus === 'active' && storedTrialEndDate) {
      const endDate = new Date(storedTrialEndDate);
      const now = new Date();
      
      if (endDate > now) {
        setIsInFreeTrial(true);
        setFreeTrialEndDate(endDate);
        
        const remainingTime = endDate.getTime() - now.getTime();
        const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
        setDaysRemainingInTrial(remainingDays);
        
        setCurrentTier('premium');
      } else {
        localStorage.removeItem('freeTrialStatus');
        localStorage.removeItem('freeTrialEndDate');
        setIsInFreeTrial(false);
        setFreeTrialEndDate(null);
        setDaysRemainingInTrial(null);
        
        toast.info('Your free trial has ended. Upgrade now to maintain premium access!', {
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/subscription',
          },
          duration: 10000,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isInFreeTrial || !freeTrialEndDate) return;
    
    const calculateDaysRemaining = () => {
      const now = new Date();
      const remainingTime = freeTrialEndDate.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      
      setDaysRemainingInTrial(remainingDays > 0 ? remainingDays : 0);
      
      if (remainingDays <= 0) {
        endFreeTrial();
      }
    };
    
    calculateDaysRemaining();
    
    const intervalId = setInterval(calculateDaysRemaining, 1000 * 60 * 60 * 24);
    
    if (daysRemainingInTrial === 14) {
      toast.warning('Your free trial ends in 2 weeks. Upgrade now to maintain premium access!', {
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription',
        },
        duration: 10000,
      });
    } else if (daysRemainingInTrial === 7) {
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
    
    localStorage.setItem('freeTrialStatus', 'active');
    localStorage.setItem('freeTrialEndDate', endDate.toISOString());
    
    toast.success(`Your ${FREE_TRIAL_DURATION_DAYS}-day free trial has started! Enjoy premium features.`);
  };

  const endFreeTrial = () => {
    setIsInFreeTrial(false);
    setFreeTrialEndDate(null);
    setDaysRemainingInTrial(null);
    setCurrentTier('basic');
    
    localStorage.removeItem('freeTrialStatus');
    localStorage.removeItem('freeTrialEndDate');
  };

  const extendTrial = (days: number) => {
    if (!isInFreeTrial || !freeTrialEndDate) {
      return;
    }
    
    const newEndDate = new Date(freeTrialEndDate);
    newEndDate.setDate(newEndDate.getDate() + days);
    
    setFreeTrialEndDate(newEndDate);
    setTrialWasExtended(true);
    
    const now = new Date();
    const remainingTime = newEndDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    setDaysRemainingInTrial(remainingDays > 0 ? remainingDays : 0);
    
    localStorage.setItem('freeTrialEndDate', newEndDate.toISOString());
    localStorage.setItem('trialWasExtended', 'true');
    
    toast.success(`Congratulations! Your free trial has been extended by ${days} days.`);
    
    setTimeout(() => {
      setTrialWasExtended(false);
      localStorage.removeItem('trialWasExtended');
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    const wasExtended = localStorage.getItem('trialWasExtended') === 'true';
    setTrialWasExtended(wasExtended);
    
    if (wasExtended) {
      setTimeout(() => {
        setTrialWasExtended(false);
        localStorage.removeItem('trialWasExtended');
      }, 5 * 60 * 1000);
    }
  }, []);

  const isFeatureAvailable = (featureId: string): boolean => {
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
  };

  const isUpgradeRequired = (featureId: string): boolean => {
    if (isFeatureAvailable(featureId)) return false;
    
    return subscriptionTiers.some(tier => {
      if (tier.id === currentTier) return false;
      return tier.features.some(feature => feature.id === featureId && feature.included);
    });
  };

  const upgradeTier = (newTier: SubscriptionTierType) => {
    setCurrentTier(newTier);
    
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
      endFreeTrial,
      extendTrial,
      trialWasExtended
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
