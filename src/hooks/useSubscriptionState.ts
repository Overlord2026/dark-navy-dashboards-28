
import { useState, useEffect } from 'react';
import { SubscriptionTierType } from '@/types/subscription';
import { SubscriptionContextState } from '@/types/subscription/context';
import { toast } from 'sonner';

export const FREE_TRIAL_DURATION_DAYS = 90;

export function useSubscriptionState(): SubscriptionContextState & {
  setSubscriptionState: (state: Partial<SubscriptionContextState>) => void;
} {
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

  const setSubscriptionState = (state: Partial<SubscriptionContextState>) => {
    if ('currentTier' in state) setCurrentTier(state.currentTier!);
    if ('isInFreeTrial' in state) setIsInFreeTrial(state.isInFreeTrial!);
    if ('freeTrialEndDate' in state) setFreeTrialEndDate(state.freeTrialEndDate);
    if ('daysRemainingInTrial' in state) setDaysRemainingInTrial(state.daysRemainingInTrial);
    if ('trialWasExtended' in state) setTrialWasExtended(state.trialWasExtended!);
  };

  return {
    currentTier,
    isInFreeTrial,
    freeTrialEndDate,
    daysRemainingInTrial,
    trialWasExtended,
    setSubscriptionState
  };
}
