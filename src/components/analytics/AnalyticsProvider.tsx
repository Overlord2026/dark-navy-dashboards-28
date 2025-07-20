
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';

interface AnalyticsContextType {
  trackPageView: (pageName: string, additionalProperties?: Record<string, any>) => void;
  trackFeatureUsage: (featureName: string, additionalProperties?: Record<string, any>) => void;
  trackUserAction: (actionName: string, additionalProperties?: Record<string, any>) => void;
  trackError: (errorMessage: string, errorStack?: string, additionalProperties?: Record<string, any>) => void;
  trackFormSubmission: (formName: string, success: boolean, additionalProperties?: Record<string, any>) => void;
  trackSearchQuery: (query: string, resultsCount: number, additionalProperties?: Record<string, any>) => void;
  trackButtonClick: (buttonName: string, location: string, additionalProperties?: Record<string, any>) => void;
  trackCalculatorUsage: (calculatorType: string, completed?: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { userProfile } = useUser();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize analytics service
    console.log('Analytics initialized');
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized && user && userProfile) {
      // Set user properties
      console.log('Setting user properties:', {
        userId: user.id,
        email: user.email,
        role: userProfile.role,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        // Only include these properties if they exist in the UserProfile type
        ...(userProfile.client_segment && { client_segment: userProfile.client_segment }),
        ...(userProfile.tenant_id && { tenant_id: userProfile.tenant_id })
      });
    }
  }, [initialized, user, userProfile]);

  const trackPageView = (pageName: string, additionalProperties?: Record<string, any>) => {
    console.log('Page view tracked:', pageName, additionalProperties);
  };

  const trackFeatureUsage = (featureName: string, additionalProperties?: Record<string, any>) => {
    console.log('Feature usage tracked:', featureName, additionalProperties);
  };

  const trackUserAction = (actionName: string, additionalProperties?: Record<string, any>) => {
    console.log('User action tracked:', actionName, additionalProperties);
  };

  const trackError = (errorMessage: string, errorStack?: string, additionalProperties?: Record<string, any>) => {
    console.error('Error tracked:', errorMessage, errorStack, additionalProperties);
  };

  const trackFormSubmission = (formName: string, success: boolean, additionalProperties?: Record<string, any>) => {
    console.log('Form submission tracked:', formName, success, additionalProperties);
  };

  const trackSearchQuery = (query: string, resultsCount: number, additionalProperties?: Record<string, any>) => {
    console.log('Search query tracked:', query, resultsCount, additionalProperties);
  };

  const trackButtonClick = (buttonName: string, location: string, additionalProperties?: Record<string, any>) => {
    console.log('Button click tracked:', buttonName, location, additionalProperties);
  };

  const trackCalculatorUsage = (calculatorType: string, completed: boolean = false) => {
    console.log('Calculator usage tracked:', calculatorType, completed);
  };

  const value: AnalyticsContextType = {
    trackPageView,
    trackFeatureUsage,
    trackUserAction,
    trackError,
    trackFormSubmission,
    trackSearchQuery,
    trackButtonClick,
    trackCalculatorUsage,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsTracking() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsTracking must be used within an AnalyticsProvider');
  }
  return context;
}
