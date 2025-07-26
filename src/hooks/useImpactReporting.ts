import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ImpactReport {
  id: string;
  user_id: string;
  tenant_id?: string;
  report_type: 'quarterly' | 'annual';
  report_period_start: string;
  report_period_end: string;
  total_donated: number;
  charities_supported: number;
  projects_supported: number;
  report_data: any;
  file_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  milestone_value: number;
  achieved_at: string;
  milestone_data: any;
  is_celebrated: boolean;
  created_at: string;
}

export interface ImpactPreferences {
  id: string;
  user_id: string;
  allow_public_recognition: boolean;
  email_notifications: boolean;
  quarterly_reports: boolean;
  annual_reports: boolean;
  report_format: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkImpactSummary {
  id: string;
  tenant_id?: string;
  period_type: string;
  period_start: string;
  period_end: string;
  total_families: number;
  total_donated: number;
  total_charities: number;
  total_projects: number;
  top_charities: any[];
  impact_stories: any[];
  calculated_at: string;
  created_at: string;
}

export const useImpactReporting = () => {
  const [reports, setReports] = useState<ImpactReport[]>([]);
  const [milestones, setMilestones] = useState<ImpactMilestone[]>([]);
  const [preferences, setPreferences] = useState<ImpactPreferences | null>(null);
  const [networkSummary, setNetworkSummary] = useState<NetworkImpactSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserReports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('impact_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching impact reports:', error);
      toast({
        title: "Error",
        description: "Failed to load impact reports",
        variant: "destructive",
      });
    }
  };

  const fetchUserMilestones = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('impact_milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: "Error",
        description: "Failed to load milestones",
        variant: "destructive",
      });
    }
  };

  const fetchUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_impact_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: createError } = await supabase
          .from('user_impact_preferences')
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (createError) throw createError;
        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load preferences",
        variant: "destructive",
      });
    }
  };

  const fetchNetworkSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('network_impact_summary')
        .select('*')
        .order('period_start', { ascending: false })
        .limit(4); // Last 4 periods

      if (error) throw error;
      setNetworkSummary(data || []);
    } catch (error) {
      console.error('Error fetching network summary:', error);
    }
  };

  const generateReport = async (reportType: 'quarterly' | 'annual') => {
    if (!user) return;

    try {
      const now = new Date();
      let periodStart: Date, periodEnd: Date;

      if (reportType === 'quarterly') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        periodEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
      } else {
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31);
      }

      const { data, error } = await supabase.rpc('generate_user_impact_report', {
        p_user_id: user.id,
        p_report_type: reportType,
        p_period_start: periodStart.toISOString().split('T')[0],
        p_period_end: periodEnd.toISOString().split('T')[0]
      });

      if (error) throw error;

      toast({
        title: "Report Generated",
        description: `Your ${reportType} impact report has been generated successfully.`,
      });

      // Refresh reports
      await fetchUserReports();
      
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const updatePreferences = async (updates: Partial<ImpactPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from('user_impact_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);

      toast({
        title: "Preferences Updated",
        description: "Your impact preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  };

  const celebrateMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('impact_milestones')
        .update({ is_celebrated: true })
        .eq('id', milestoneId);

      if (error) throw error;

      setMilestones(prev => prev.map(m => 
        m.id === milestoneId ? { ...m, is_celebrated: true } : m
      ));
    } catch (error) {
      console.error('Error celebrating milestone:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([
          fetchUserReports(),
          fetchUserMilestones(),
          fetchUserPreferences(),
          fetchNetworkSummary()
        ]);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const uncelebratedMilestones = milestones.filter(m => !m.is_celebrated);
  const currentYearReports = reports.filter(r => 
    new Date(r.report_period_start).getFullYear() === new Date().getFullYear()
  );

  return {
    reports,
    milestones,
    preferences,
    networkSummary,
    loading,
    uncelebratedMilestones,
    currentYearReports,
    generateReport,
    updatePreferences,
    celebrateMilestone,
    refreshData: () => {
      fetchUserReports();
      fetchUserMilestones();
      fetchUserPreferences();
      fetchNetworkSummary();
    }
  };
};