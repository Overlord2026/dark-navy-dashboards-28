
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analytics } from '@/lib/analytics';

// Export the missing types that components expect
export interface AnalyticsData {
  date: string;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  pageViews: number;
  advisorLogins: number;
  clientLogins: number;
  newAdvisors: number;
  advisorOnboardingCompleted: number;
  clientOnboardingCompleted: number;
  conversionRate: number;
}

export interface OnboardingProgress {
  stepName: string;
  userType: 'advisor' | 'client';
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

// Hook for data fetching (used by dashboard components)
export const useAnalytics = (tenantId?: string, dateRange?: { from: Date; to: Date }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - in a real implementation, this would fetch from your analytics API
      const mockAnalytics: AnalyticsData[] = [
        {
          date: new Date().toISOString(),
          totalUsers: 150,
          activeUsers: 45,
          newUsers: 12,
          totalSessions: 320,
          avgSessionDuration: 8.5,
          pageViews: 1250,
          advisorLogins: 25,
          clientLogins: 20,
          newAdvisors: 3,
          advisorOnboardingCompleted: 8,
          clientOnboardingCompleted: 15,
          conversionRate: 12.5
        }
      ];

      const mockOnboardingProgress: OnboardingProgress[] = [
        {
          stepName: 'Profile Setup',
          userType: 'advisor',
          completedCount: 8,
          totalCount: 10,
          completionRate: 80
        },
        {
          stepName: 'Document Upload',
          userType: 'client',
          completedCount: 15,
          totalCount: 20,
          completionRate: 75
        }
      ];

      setAnalytics(mockAnalytics);
      setOnboardingProgress(mockOnboardingProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [tenantId, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportReport = useCallback(async (format: 'csv' | 'json') => {
    // Mock export functionality
    console.log(`Exporting analytics report in ${format} format`);
    
    if (format === 'json') {
      const data = { analytics, onboardingProgress };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [analytics, onboardingProgress]);

  return {
    analytics,
    onboardingProgress,
    loading,
    error,
    refetch: fetchAnalytics,
    exportReport
  };
};

// Hook for event tracking (existing functionality)
export const useAnalyticsTracking = () => {
  const { userProfile } = useAuth();

  const trackPageView = useCallback((pageName: string, additionalProperties?: Record<string, any>) => {
    analytics.trackPageView(pageName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      ...additionalProperties
    });
  }, [userProfile]);

  const trackFeatureUsage = useCallback((featureName: string, additionalProperties?: Record<string, any>) => {
    analytics.trackFeatureUsage(featureName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...additionalProperties
    });
  }, [userProfile]);

  const trackConversion = useCallback((conversionType: string, additionalProperties?: Record<string, any>) => {
    analytics.trackConversion(conversionType, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...additionalProperties
    });
  }, [userProfile]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }, [userProfile]);

  const trackInviteSent = useCallback((inviteType: string, recipientEmail?: string) => {
    trackFeatureUsage('invite_sent', {
      invite_type: inviteType,
      recipient_email: recipientEmail ? 'provided' : 'not_provided'
    });
  }, [trackFeatureUsage]);

  const trackOnboardingStep = useCallback((step: string, completed: boolean = false) => {
    trackEvent('onboarding_step', {
      step,
      completed,
      event_type: completed ? 'onboarding_step_completed' : 'onboarding_step_started'
    });
  }, [trackEvent]);

  const trackTestDataReset = useCallback((success: boolean, resetType?: string) => {
    trackFeatureUsage('test_data_reset', {
      success,
      reset_type: resetType || 'full_reset'
    });
  }, [trackFeatureUsage]);

  const trackDocumentAction = useCallback((action: string, documentType?: string) => {
    trackFeatureUsage('document_action', {
      action,
      document_type: documentType
    });
  }, [trackFeatureUsage]);

  const trackCalculatorUsage = useCallback((calculatorType: string, completed: boolean = false) => {
    trackFeatureUsage('calculator_used', {
      calculator_type: calculatorType,
      completed
    });
  }, [trackFeatureUsage]);

  return {
    trackPageView,
    trackFeatureUsage,
    trackConversion,
    trackEvent,
    trackInviteSent,
    trackOnboardingStep,
    trackTestDataReset,
    trackDocumentAction,
    trackCalculatorUsage
  };
};
