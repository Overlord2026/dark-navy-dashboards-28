import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSystemHealth() {
  const databaseHealth = useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rpc_database_health');
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const backupStatus = useQuery({
    queryKey: ['backup-status'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rpc_backup_status');
      if (error) throw error;
      return data;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const edgeFunctionLogs = useQuery({
    queryKey: ['edge-function-logs'],
    queryFn: async () => {
      // Get recent edge function logs from audit logs
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('event_type', 'edge_function_error')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  return {
    databaseHealth,
    backupStatus,
    edgeFunctionLogs,
  };
}