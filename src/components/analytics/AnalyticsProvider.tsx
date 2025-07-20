
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { initializeAnalytics, analytics } from '@/lib/analytics';

interface AnalyticsContextType {
  initialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({ initialized: false });

export const useAnalyticsContext = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { userProfile, user } = useAuth();
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    // Initialize PostHog
    initializeAnalytics();
    setInitialized(true);
  }, []);

  useEffect(() => {
    // Identify user when they log in
    if (initialized && user && userProfile) {
      analytics.identify(user.id, {
        email: userProfile.email,
        role: userProfile.role,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        client_segment: userProfile.client_segment,
        tenant_id: userProfile.tenant_id
      });
    }
  }, [initialized, user, userProfile]);

  useEffect(() => {
    // Reset analytics on logout
    if (initialized && !user) {
      analytics.reset();
    }
  }, [initialized, user]);

  return (
    <AnalyticsContext.Provider value={{ initialized }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
