import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProjectAnalytics {
  id: string;
  project_id: string;
  completion_percentage: number;
  tasks_completed: number;
  tasks_total: number;
  milestones_completed: number;
  milestones_total: number;
  estimated_hours: number;
  actual_hours: number;
  hours_variance: number;
  estimated_budget: number;
  actual_budget: number;
  budget_variance: number;
  team_size: number;
  days_elapsed: number;
  days_remaining: number;
  schedule_variance: number;
  task_revision_rate: number;
  client_satisfaction_score: number;
  calculated_at: string;
}

export interface TeamProductivityAnalytics {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  tasks_assigned: number;
  tasks_completed: number;
  tasks_completion_rate: number;
  hours_logged: number;
  average_task_duration: number;
  productivity_score: number;
  messages_sent: number;
  documents_shared: number;
  meetings_attended: number;
  task_revision_count: number;
  client_feedback_score: number;
  active_projects: number;
  projects_completed: number;
}

export interface ResourceUtilizationAnalytics {
  id: string;
  tenant_id: string;
  period_start: string;
  period_end: string;
  total_team_members: number;
  active_team_members: number;
  utilization_rate: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  total_hours_available: number;
  total_hours_allocated: number;
  total_hours_logged: number;
  capacity_utilization: number;
  total_budget_allocated: number;
  total_budget_spent: number;
  budget_utilization: number;
  average_project_satisfaction: number;
  average_completion_rate: number;
}

export function useProjectAnalytics() {
  const [analytics, setAnalytics] = useState<ProjectAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_analytics')
        .select(`
          *,
          projects!inner(name, status, vertical)
        `)
        .order('calculated_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('project-analytics-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project_analytics' },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useTeamProductivityAnalytics(startDate?: string, endDate?: string) {
  const [analytics, setAnalytics] = useState<TeamProductivityAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('team_productivity_analytics')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .order('period_start', { ascending: false });

      if (startDate) {
        query = query.gte('period_start', startDate);
      }
      if (endDate) {
        query = query.lte('period_end', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team productivity analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('team-productivity-analytics-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'team_productivity_analytics' },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, startDate, endDate]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useResourceUtilizationAnalytics(startDate?: string, endDate?: string) {
  const [analytics, setAnalytics] = useState<ResourceUtilizationAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('resource_utilization_analytics')
        .select('*')
        .order('period_start', { ascending: false });

      if (startDate) {
        query = query.gte('period_start', startDate);
      }
      if (endDate) {
        query = query.lte('period_end', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resource utilization analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('resource-utilization-analytics-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'resource_utilization_analytics' },
        () => fetchAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, startDate, endDate]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useAnalytics(tenantId?: string, dateRange?: { from: Date; to: Date }) {
  // Legacy hook for compatibility
  const { analytics: projectAnalytics } = useProjectAnalytics();
  const { analytics: teamAnalytics } = useTeamProductivityAnalytics();
  const { analytics: resourceAnalytics } = useResourceUtilizationAnalytics();
  
  return {
    analytics: {
      projects: projectAnalytics,
      team: teamAnalytics,
      resources: resourceAnalytics
    },
    onboardingProgress: {},
    loading: false,
    error: null,
    refetch: () => {},
    exportReport: async (format: string) => {}
  };
}

export function useAnalyticsEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('analytics-events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'analytics_events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { events, loading, error, refetch: fetchEvents };
}

export async function calculateProjectAnalytics(projectId: string) {
  const { error } = await supabase.rpc('calculate_project_analytics', {
    p_project_id: projectId
  });

  if (error) {
    throw new Error(`Failed to calculate project analytics: ${error.message}`);
  }
}