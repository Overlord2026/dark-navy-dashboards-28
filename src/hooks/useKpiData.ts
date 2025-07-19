import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useKpiData() {
  return useQuery({
    queryKey: ['admin-kpis'],
    queryFn: async () => {
      const [
        clientsResponse,
        advisorsResponse, 
        healthReportsResponse,
        ltcTestsResponse,
        feeReportsResponse,
        openTicketsResponse
      ] = await Promise.all([
        supabase.rpc('count_clients'),
        supabase.rpc('count_advisors'),
        supabase.rpc('count_health_reports'),
        supabase.rpc('count_ltc_tests'),
        supabase.rpc('count_fee_reports'),
        supabase.rpc('count_open_tickets')
      ]);

      if (clientsResponse.error) throw clientsResponse.error;
      if (advisorsResponse.error) throw advisorsResponse.error;
      if (healthReportsResponse.error) throw healthReportsResponse.error;
      if (ltcTestsResponse.error) throw ltcTestsResponse.error;
      if (feeReportsResponse.error) throw feeReportsResponse.error;
      if (openTicketsResponse.error) throw openTicketsResponse.error;

      return {
        activeClients: clientsResponse.data || 0,
        activeAdvisors: advisorsResponse.data || 0, 
        healthspanReports: healthReportsResponse.data || 0,
        ltcStressTests: ltcTestsResponse.data || 0,
        feeSavingsReports: feeReportsResponse.data || 0,
        openSupportTickets: openTicketsResponse.data || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}