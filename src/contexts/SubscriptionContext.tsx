
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { SubscriptionTierType } from '@/types/subscription';
import { SubscriptionContextValue } from '@/types/subscription/context';
import { useSubscriptionState, FREE_TRIAL_DURATION_DAYS } from '@/hooks/useSubscriptionState';
import { isFeatureAvailableForTier, isUpgradeRequiredForFeature } from '@/utils/subscription';
import { toast } from 'sonner';

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const {
    currentTier,
    isInFreeTrial,
    freeTrialEndDate,
    daysRemainingInTrial,
    trialWasExtended,
    setSubscriptionState
  } = useSubscriptionState();

  useEffect(() => {
    if (!isInFreeTrial || !freeTrialEndDate) return;
    
    const calculateDaysRemaining = () => {
      const now = new Date();
      const remainingTime = freeTrialEndDate.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      
      setSubscriptionState({ daysRemainingInTrial: remainingDays > 0 ? remainingDays : 0 });
      
      if (remainingDays <= 0) {
        endFreeTrial();
      }
    };
    
    calculateDaysRemaining();
    const intervalId = setInterval(calculateDaysRemaining, 1000 * 60 * 60 * 24);
    
    handleTrialNotifications(daysRemainingInTrial);
    
    return () => clearInterval(intervalId);
  }, [isInFreeTrial, freeTrialEndDate, daysRemainingInTrial]);

  const handleTrialNotifications = (days: number | null) => {
    if (!days) return;
    
    const notifications = [
      { days: 14, message: 'Your free trial ends in 2 weeks' },
      { days: 7, message: 'Your free trial ends in 7 days' },
      { days: 3, message: 'Your free trial ends in 3 days' },
      { days: 1, message: 'Your free trial ends tomorrow' }
    ];

    const notification = notifications.find(n => n.days === days);
    if (notification) {
      toast.warning(`${notification.message}. Upgrade now to maintain premium access!`, {
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription',
        },
        duration: 10000,
      });
    }
  };

  const startFreeTrial = () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + FREE_TRIAL_DURATION_DAYS);
    
    setSubscriptionState({
      isInFreeTrial: true,
      freeTrialEndDate: endDate,
      daysRemainingInTrial: FREE_TRIAL_DURATION_DAYS,
      currentTier: 'premium'
    });
    
    localStorage.setItem('freeTrialStatus', 'active');
    localStorage.setItem('freeTrialEndDate', endDate.toISOString());
    
    toast.success(`Your ${FREE_TRIAL_DURATION_DAYS}-day free trial has started! Enjoy premium features.`);
  };

  const endFreeTrial = () => {
    setSubscriptionState({
      isInFreeTrial: false,
      freeTrialEndDate: null,
      daysRemainingInTrial: null,
      currentTier: 'basic'
    });
    
    localStorage.removeItem('freeTrialStatus');
    localStorage.removeItem('freeTrialEndDate');
  };

  const extendTrial = (days: number) => {
    if (!isInFreeTrial || !freeTrialEndDate) return;
    
    const newEndDate = new Date(freeTrialEndDate);
    newEndDate.setDate(newEndDate.getDate() + days);
    
    setSubscriptionState({
      freeTrialEndDate: newEndDate,
      trialWasExtended: true
    });
    
    localStorage.setItem('freeTrialEndDate', newEndDate.toISOString());
    localStorage.setItem('trialWasExtended', 'true');
    
    toast.success(`Congratulations! Your free trial has been extended by ${days} days.`);
    
    setTimeout(() => {
      setSubscriptionState({ trialWasExtended: false });
      localStorage.removeItem('trialWasExtended');
    }, 5 * 60 * 1000);
  };

  const upgradeTier = (newTier: SubscriptionTierType) => {
    setSubscriptionState({ currentTier: newTier });
    
    if (isInFreeTrial) {
      endFreeTrial();
    }
    
    toast.success(`Successfully upgraded to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} tier!`);
  };

  const value: SubscriptionContextValue = {
    currentTier,
    isFeatureAvailable: (featureId: string) => 
      isFeatureAvailableForTier(featureId, currentTier, isInFreeTrial),
    upgradeTier,
    isUpgradeRequired: (featureId: string) => 
      isUpgradeRequiredForFeature(featureId, currentTier),
    isInFreeTrial,
    freeTrialEndDate,
    daysRemainingInTrial,
    startFreeTrial,
    endFreeTrial,
    extendTrial,
    trialWasExtended
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
