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
    refetchInterval: (query) => {
      // Overlap guard: don't refetch if query is currently fetching
      if (query?.state.fetchStatus === 'fetching') return false;
      // Exponential backoff on errors, minimum 30s as requested
      return query?.state.error ? 120000 : 60000;
    },
    staleTime: 30000, // Consider data stale after 30s
  });

  const backupStatus = useQuery({
    queryKey: ['backup-status'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('rpc_backup_status');
      if (error) throw error;
      return data;
    },
    refetchInterval: (query) => {
      // Overlap guard and exponential backoff
      if (query?.state.fetchStatus === 'fetching') return false;
      return query?.state.error ? 600000 : 300000; // 10min on error, 5min normal
    },
    staleTime: 120000, // Consider data stale after 2min
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
    refetchInterval: (query) => {
      // Overlap guard and smart polling
      if (query?.state.fetchStatus === 'fetching') return false;
      return query?.state.error ? 180000 : 90000; // 3min on error, 1.5min normal
    },
    staleTime: 45000, // Consider data stale after 45s
  });

  return {
    databaseHealth,
    backupStatus,
    edgeFunctionLogs,
  };
}