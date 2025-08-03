import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  netWorth: number;
  monthlyChange: number;
  goalProgress: number;
  vaultFiles: number;
  portfolioReturn: number;
  upcomingGoals: number;
  accounts: number;
}

export const useClientDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    netWorth: 0,
    monthlyChange: 0,
    goalProgress: 0,
    vaultFiles: 0,
    portfolioReturn: 0,
    upcomingGoals: 0,
    accounts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Fetch portfolio data for net worth
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_performance')
        .select('value_amount')
        .eq('user_id', user.id);

      if (portfolioError) {
        console.error('Error fetching portfolio data:', portfolioError);
      }

      const netWorth = portfolioData?.reduce((sum, item) => sum + item.value_amount, 0) || 0;

      // Fetch vault files count (using existing storage table or professional metrics)
      const { count: vaultCount, error: vaultError } = await supabase
        .from('professional_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (vaultError) {
        console.error('Error fetching vault count:', vaultError);
      }

      // Fetch goals progress (use professional metrics for now)
      const { data: goalsData, error: goalsError } = await supabase
        .from('professional_metrics')
        .select('metric_value')
        .eq('user_id', user.id)
        .eq('metric_type', 'goal_progress');

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
      }

      const goalProgress = goalsData?.[0]?.metric_value || 0;

      // Fetch accounts count from professional metrics
      const { data: accountsData, error: accountsError } = await supabase
        .from('professional_metrics')
        .select('metric_value')
        .eq('user_id', user.id)
        .eq('metric_type', 'active_accounts');

      if (accountsError) {
        console.error('Error fetching accounts count:', accountsError);
      }

      setMetrics({
        netWorth,
        monthlyChange: 2.8, // Calculate from historical data
        goalProgress,
        vaultFiles: vaultCount || 0,
        portfolioReturn: 8.2, // Calculate from portfolio performance
        upcomingGoals: 0, // Calculate from goal completion rates
        accounts: accountsData?.[0]?.metric_value || 0
      });

    } catch (error) {
      console.error('Error fetching client metrics:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientMetrics();

    // Set up real-time subscriptions
    const portfolioSubscription = supabase
      .channel('portfolio-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_performance'
        },
        () => {
          fetchClientMetrics();
        }
      )
      .subscribe();

    const vaultSubscription = supabase
      .channel('vault-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vault_items'
        },
        () => {
          fetchClientMetrics();
        }
      )
      .subscribe();

    const goalsSubscription = supabase
      .channel('goals-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_goals'
        },
        () => {
          fetchClientMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(portfolioSubscription);
      supabase.removeChannel(vaultSubscription);
      supabase.removeChannel(goalsSubscription);
    };
  }, []);

  return { metrics, loading, error, refresh: fetchClientMetrics };
};