
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface DashboardMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetCount: number;
  liabilityCount: number;
  lastUpdated: string;
}

export const useRealTimeData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    assetCount: 0,
    liabilityCount: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMetrics = async () => {
    if (!user) {
      setMetrics({
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        assetCount: 0,
        liabilityCount: 0,
        lastUpdated: new Date().toISOString()
      });
      setLoading(false);
      return;
    }

    try {
      // Fetch assets
      const { data: assets, error: assetsError } = await supabase
        .from('user_assets')
        .select('value')
        .eq('user_id', user.id);

      if (assetsError) {
        console.error('Error fetching assets:', assetsError);
        return;
      }

      // Fetch liabilities
      const { data: liabilities, error: liabilitiesError } = await supabase
        .from('user_liabilities')
        .select('amount')
        .eq('user_id', user.id);

      if (liabilitiesError) {
        console.error('Error fetching liabilities:', liabilitiesError);
        return;
      }

      const totalAssets = assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0;
      const totalLiabilities = liabilities?.reduce((sum, liability) => sum + Number(liability.amount), 0) || 0;

      setMetrics({
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities,
        assetCount: assets?.length || 0,
        liabilityCount: liabilities?.length || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscriptions
    if (user) {
      const assetsChannel = supabase
        .channel('dashboard-assets')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_assets',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Assets changed, refreshing dashboard metrics');
            fetchMetrics();
          }
        )
        .subscribe();

      const liabilitiesChannel = supabase
        .channel('dashboard-liabilities')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_liabilities',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Liabilities changed, refreshing dashboard metrics');
            fetchMetrics();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(assetsChannel);
        supabase.removeChannel(liabilitiesChannel);
      };
    }
  }, [user]);

  return {
    metrics,
    loading,
    refreshMetrics: fetchMetrics
  };
};
