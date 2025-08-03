
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate date range
      const endDate = dateRange?.to || new Date();
      const startDate = dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Fetch analytics events data
      const { data: analyticsEvents, error: analyticsError } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('tenant_id', tenantId || user.user_metadata?.tenant_id);

      if (analyticsError) throw analyticsError;

      // Fetch user metrics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .eq('tenant_id', tenantId || user.user_metadata?.tenant_id);

      if (profilesError) throw profilesError;

      // Process analytics data by day
      const dayMap = new Map<string, Partial<AnalyticsData>>();
      
      // Initialize with date range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        dayMap.set(dateKey, {
          date: d.toISOString(),
          totalUsers: 0,
          activeUsers: 0,
          newUsers: 0,
          totalSessions: 0,
          avgSessionDuration: 0,
          pageViews: 0,
          advisorLogins: 0,
          clientLogins: 0,
          newAdvisors: 0,
          advisorOnboardingCompleted: 0,
          clientOnboardingCompleted: 0,
          conversionRate: 0
        });
      }

      // Process analytics events
      analyticsEvents?.forEach(event => {
        const eventDate = new Date(event.created_at).toISOString().split('T')[0];
        const dayData = dayMap.get(eventDate);
        if (!dayData) return;

        const eventData = typeof event.event_data === 'object' && event.event_data && !Array.isArray(event.event_data) ? event.event_data as Record<string, any> : {};
        
        switch (event.event_type) {
          case 'page_view':
            dayData.pageViews = (dayData.pageViews || 0) + 1;
            break;
          case 'session_start':
            dayData.totalSessions = (dayData.totalSessions || 0) + 1;
            break;
          case 'user_login':
            const userRole = eventData?.user_role;
            if (userRole === 'advisor') {
              dayData.advisorLogins = (dayData.advisorLogins || 0) + 1;
            } else if (userRole === 'client') {
              dayData.clientLogins = (dayData.clientLogins || 0) + 1;
            }
            break;
          case 'onboarding_completed':
            const onboardingRole = eventData?.user_role;
            if (onboardingRole === 'advisor') {
              dayData.advisorOnboardingCompleted = (dayData.advisorOnboardingCompleted || 0) + 1;
            } else if (onboardingRole === 'client') {
              dayData.clientOnboardingCompleted = (dayData.clientOnboardingCompleted || 0) + 1;
            }
            break;
        }
      });

      // Calculate user metrics
      const totalUsers = profiles?.length || 0;
      const advisors = profiles?.filter(p => p.role === 'advisor') || [];
      const clients = profiles?.filter(p => p.role === 'client') || [];
      
      // Calculate active users (updated within last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = profiles?.filter(p => 
        p.updated_at && new Date(p.updated_at) > sevenDaysAgo
      ).length || 0;

      // Calculate new users in period
      const newUsers = profiles?.filter(p => 
        new Date(p.created_at) >= startDate && new Date(p.created_at) <= endDate
      ).length || 0;

      const newAdvisors = advisors.filter(p => 
        new Date(p.created_at) >= startDate && new Date(p.created_at) <= endDate
      ).length;

      // Calculate average session duration from analytics events
      const sessionEvents = analyticsEvents?.filter(e => {
        const eventData = typeof e.event_data === 'object' && e.event_data && !Array.isArray(e.event_data) ? e.event_data as Record<string, any> : {};
        return e.event_type === 'session_end' && eventData?.duration;
      }) || [];
      const avgSessionDuration = sessionEvents.length > 0 
        ? sessionEvents.reduce((sum, e) => {
            const eventData = typeof e.event_data === 'object' && e.event_data && !Array.isArray(e.event_data) ? e.event_data as Record<string, any> : {};
            return sum + (eventData?.duration || 0);
          }, 0) / sessionEvents.length
        : 8.5;

      // Update day data with calculated metrics
      Array.from(dayMap.values()).forEach(dayData => {
        dayData.totalUsers = totalUsers;
        dayData.activeUsers = activeUsers;
        dayData.newUsers = newUsers;
        dayData.newAdvisors = newAdvisors;
        dayData.avgSessionDuration = avgSessionDuration;
        dayData.conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
      });

      const processedAnalytics = Array.from(dayMap.values()) as AnalyticsData[];

      // Fetch onboarding progress - using a simple calculation based on created_at
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('profiles')
        .select('id, role, created_at')
        .eq('tenant_id', tenantId || user.user_metadata?.tenant_id);

      if (onboardingError) throw onboardingError;

      const advisorProfiles = onboardingData?.filter(p => p.role === 'advisor') || [];
      const clientProfiles = onboardingData?.filter(p => p.role === 'client') || [];

      // Simulate onboarding completion - in practice this would be based on actual onboarding data
      const advisorCompleted = Math.floor(advisorProfiles.length * 0.8); // 80% completion rate
      const clientCompleted = Math.floor(clientProfiles.length * 0.75); // 75% completion rate

      const processedOnboardingProgress: OnboardingProgress[] = [
        {
          stepName: 'Profile Setup',
          userType: 'advisor',
          completedCount: advisorCompleted,
          totalCount: advisorProfiles.length,
          completionRate: advisorProfiles.length > 0 ? (advisorCompleted / advisorProfiles.length) * 100 : 0
        },
        {
          stepName: 'Profile Setup',
          userType: 'client',
          completedCount: clientCompleted,
          totalCount: clientProfiles.length,
          completionRate: clientProfiles.length > 0 ? (clientCompleted / clientProfiles.length) * 100 : 0
        }
      ];

      setAnalytics(processedAnalytics);
      setOnboardingProgress(processedOnboardingProgress);
    } catch (err) {
      console.error('Error fetching analytics:', err);
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
