import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Archive,
  DollarSign
} from "lucide-react";

export interface Report {
  id: string;
  user_id: string;
  role: string;
  report_type: string;
  format: string;
  download_url: string;
  generated_at: string;
  metadata: any;
}

export interface UserProfile {
  id: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export interface ReportType {
  key: string;
  label: string;
  description: string;
  icon: any;
  roles: string[];
}

export const useReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [apiCallsCount, setApiCallsCount] = useState(0);

  // Memoized role-based report types
  const roleReportMap = useMemo(() => ({
    client: [
      { key: 'net_worth', label: 'Net Worth', description: 'Complete financial overview', icon: DollarSign, roles: ['client'] },
      { key: 'income_roadmap', label: 'Income Roadmap', description: 'Income planning and projections', icon: TrendingUp, roles: ['client'] },
      { key: 'vault_activity', label: 'Vault Activity', description: 'Document access logs', icon: Archive, roles: ['client'] }
    ],
    advisor: [
      { key: 'client_summary', label: 'Client Summary', description: 'Overview of all client portfolios', icon: FileText, roles: ['advisor'] },
      { key: 'deliverables_due', label: 'Deliverables Due', description: 'Upcoming client deliverables', icon: Calendar, roles: ['advisor'] },
      { key: 'vault_analytics', label: 'Vault Analytics', description: 'Document usage analytics', icon: Archive, roles: ['advisor'] }
    ],
    accountant: [
      { key: 'tax_uploads', label: 'Tax Uploads', description: 'Tax document management', icon: FileText, roles: ['accountant'] },
      { key: 'report_export', label: 'Report Export', description: 'Comprehensive data export', icon: Download, roles: ['accountant'] }
    ],
    attorney: [
      { key: 'estate_docs', label: 'Estate Documents', description: 'Estate planning documentation', icon: FileText, roles: ['attorney'] },
      { key: 'legal_history', label: 'Legal History', description: 'Legal document history', icon: Archive, roles: ['attorney'] }
    ],
    admin: [
      { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['admin'] },
      { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['admin'] },
      { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['admin'] }
    ],
    tenant_admin: [
      { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['tenant_admin'] },
      { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['tenant_admin'] },
      { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['tenant_admin'] }
    ],
    system_administrator: [
      { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['system_administrator'] },
      { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['system_administrator'] },
      { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['system_administrator'] }
    ]
  }), []);

  // Memoized available report types for current user
  const availableReportTypes = useMemo(() => {
    return userProfile?.role ? roleReportMap[userProfile.role as keyof typeof roleReportMap] || [] : [];
  }, [userProfile?.role, roleReportMap]);

  // Optimized user profile loading
  const loadUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setApiCallsCount(prev => prev + 1);
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access reports",
          variant: "destructive"
        });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', user.id)
        .single();

      setApiCallsCount(prev => prev + 1);

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Profile fetch error:', error);
        }
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
        return;
      }

      setUserProfile(profile);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('User profile error:', error);
      }
    }
  }, [toast]);

  // Optimized reports loading
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setApiCallsCount(prev => prev + 1);
      
      if (!user) return;

      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      setApiCallsCount(prev => prev + 1);

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Reports fetch error:', error);
        }
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive"
        });
        return;
      }

      setReports(reportsData || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Load reports error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Optimized report generation
  const generateReport = useCallback(async (reportType: string, format: 'pdf' | 'csv') => {
    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate_report', {
        body: {
          report_type: reportType,
          format: format,
          filters: {}
        }
      });

      setApiCallsCount(prev => prev + 1);

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Report generation failed');
      }

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully",
      });

      // Refresh reports list
      await loadReports();

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Generate report error:', error);
      }
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  }, [loadReports, toast]);

  // Optimized download handler
  const downloadReport = useCallback(async (report: Report) => {
    try {
      window.open(report.download_url, '_blank');
      
      toast({
        title: "Download Started",
        description: "Your report download has started",
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Download error:', error);
      }
      toast({
        title: "Download Failed",
        description: "Failed to download report",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Memoized report type utilities
  const getReportTypeLabel = useCallback((type: string) => {
    const reportType = availableReportTypes.find(rt => rt.key === type);
    return reportType?.label || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [availableReportTypes]);

  // Memoized filtered reports
  const getFilteredReports = useCallback((activeTab: string) => {
    return activeTab === "all" ? reports : reports.filter(report => report.report_type === activeTab);
  }, [reports]);

  // Load data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([loadUserProfile(), loadReports()]);
    };
    initializeData();
  }, [loadUserProfile, loadReports]);

  // Refresh function
  const refreshData = useCallback(async () => {
    await Promise.all([loadUserProfile(), loadReports()]);
  }, [loadUserProfile, loadReports]);

  return {
    reports,
    userProfile,
    loading,
    generating,
    availableReportTypes,
    apiCallsCount,
    generateReport,
    downloadReport,
    getReportTypeLabel,
    getFilteredReports,
    refreshData,
    loadingStates: {
      reports: loading,
      profile: !userProfile && loading,
      generating
    }
  };
};