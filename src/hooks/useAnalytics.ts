import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  pageViews: number;
  advisorLogins: number;
  clientLogins: number;
  newAdvisors: number;
  newClients: number;
  advisorOnboardingCompleted: number;
  clientOnboardingCompleted: number;
  conversionRate: number;
  date: string;
}

export interface OnboardingProgress {
  userType: 'advisor' | 'client';
  stepName: string;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

export const useAnalytics = (tenantId?: string, dateRange: { from: Date; to: Date } = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  to: new Date()
}) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user, tenantId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build analytics query
      let analyticsQuery = supabase
        .from('daily_analytics')
        .select('*')
        .gte('date', dateRange.from.toISOString().split('T')[0])
        .lte('date', dateRange.to.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (tenantId) {
        analyticsQuery = analyticsQuery.eq('tenant_id', tenantId);
      }

      const { data: analyticsData, error: analyticsError } = await analyticsQuery;
      
      if (analyticsError) throw analyticsError;

      // Build onboarding query
      let onboardingQuery = supabase
        .from('user_onboarding_progress')
        .select('user_type, step_name, is_completed')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (tenantId) {
        onboardingQuery = onboardingQuery.eq('tenant_id', tenantId);
      }

      const { data: onboardingData, error: onboardingError } = await onboardingQuery;
      
      if (onboardingError) throw onboardingError;

      // Transform analytics data
      const transformedAnalytics = (analyticsData || []).map(item => ({
        totalUsers: item.total_users || 0,
        activeUsers: item.active_users || 0,
        newUsers: item.new_users || 0,
        totalSessions: item.total_sessions || 0,
        avgSessionDuration: item.avg_session_duration || 0,
        pageViews: item.page_views || 0,
        advisorLogins: item.advisor_logins || 0,
        clientLogins: item.client_logins || 0,
        newAdvisors: item.new_advisors || 0,
        newClients: item.new_clients || 0,
        advisorOnboardingCompleted: item.advisor_onboarding_completed || 0,
        clientOnboardingCompleted: item.client_onboarding_completed || 0,
        conversionRate: item.conversion_rate || 0,
        date: item.date
      }));

      // Transform onboarding data
      const onboardingMap = new Map<string, { completed: number; total: number }>();
      
      (onboardingData || []).forEach(item => {
        const key = `${item.user_type}-${item.step_name}`;
        if (!onboardingMap.has(key)) {
          onboardingMap.set(key, { completed: 0, total: 0 });
        }
        const current = onboardingMap.get(key)!;
        current.total++;
        if (item.is_completed) {
          current.completed++;
        }
      });

      const transformedOnboarding = Array.from(onboardingMap.entries()).map(([key, data]) => {
        const [userType, stepName] = key.split('-');
        return {
          userType: userType as 'advisor' | 'client',
          stepName,
          completedCount: data.completed,
          totalCount: data.total,
          completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
        };
      });

      setAnalytics(transformedAnalytics);
      setOnboardingProgress(transformedOnboarding);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const reportData = {
        analytics,
        onboardingProgress,
        generatedAt: new Date().toISOString(),
        dateRange,
        tenantId
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // CSV format
        const csvHeaders = [
          'Date', 'Total Users', 'Active Users', 'New Users', 'Total Sessions',
          'Avg Session Duration', 'Page Views', 'Advisor Logins', 'Client Logins',
          'New Advisors', 'New Clients', 'Advisor Onboarding Completed',
          'Client Onboarding Completed', 'Conversion Rate'
        ];

        const csvRows = analytics.map(row => [
          row.date,
          row.totalUsers,
          row.activeUsers,
          row.newUsers,
          row.totalSessions,
          row.avgSessionDuration,
          row.pageViews,
          row.advisorLogins,
          row.clientLogins,
          row.newAdvisors,
          row.newClients,
          row.advisorOnboardingCompleted,
          row.clientOnboardingCompleted,
          row.conversionRate
        ]);

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      throw err;
    }
  };

  return {
    analytics,
    onboardingProgress,
    loading,
    error,
    refetch: fetchAnalytics,
    exportReport
  };
};