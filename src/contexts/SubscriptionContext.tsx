import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionContextType {
  isInFreeTrial: boolean;
  daysRemainingInTrial: number | null;
  endTrial: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInFreeTrial, setIsInFreeTrial] = useState(true);
  const [daysRemainingInTrial, setDaysRemainingInTrial] = useState<number | null>(30);

  useEffect(() => {
    // Simulate checking if the user is in a free trial from local storage or an API
    const storedTrialStatus = localStorage.getItem('isInFreeTrial');
    const storedDaysRemaining = localStorage.getItem('daysRemainingInTrial');

    if (storedTrialStatus === 'false') {
      setIsInFreeTrial(false);
      setDaysRemainingInTrial(null);
    } else if (storedDaysRemaining) {
      setIsInFreeTrial(true);
      setDaysRemainingInTrial(parseInt(storedDaysRemaining, 10));
    }

    // Simulate daily check for trial expiration
    const intervalId = setInterval(() => {
      if (isInFreeTrial && daysRemainingInTrial !== null && daysRemainingInTrial > 0) {
        setDaysRemainingInTrial(prevDays => {
          const newDays = prevDays - 1;
          localStorage.setItem('daysRemainingInTrial', newDays.toString());
          if (newDays <= 0) {
            setIsInFreeTrial(false);
            localStorage.setItem('isInFreeTrial', 'false');
            setDaysRemainingInTrial(null);
            alert('Your free trial has ended!');
          }
          return newDays;
        });
      } else {
        clearInterval(intervalId);
      }
    }, 24 * 60 * 60 * 1000); // Daily check

    return () => clearInterval(intervalId);
  }, [isInFreeTrial, daysRemainingInTrial]);

  const endTrial = () => {
    setIsInFreeTrial(false);
    setDaysRemainingInTrial(null);
    localStorage.setItem('isInFreeTrial', 'false');
    localStorage.removeItem('daysRemainingInTrial');
  };

  return (
    <SubscriptionContext.Provider value={{ isInFreeTrial, daysRemainingInTrial, endTrial }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
