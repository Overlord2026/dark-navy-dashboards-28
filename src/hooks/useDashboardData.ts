
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface DashboardMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetGrowth: number;
  liabilityGrowth: number;
  netWorthGrowth: number;
  assetCount: number;
  propertyCount: number;
  vehicleCount: number;
}

export interface AssetBreakdown {
  realEstate: number;
  vehicles: number;
  investments: number;
  cash: number;
  retirement: number;
  collectibles: number;
  digital: number;
  other: number;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    assetGrowth: 0,
    liabilityGrowth: 0,
    netWorthGrowth: 0,
    assetCount: 0,
    propertyCount: 0,
    vehicleCount: 0,
  });
  
  const [assetBreakdown, setAssetBreakdown] = useState<AssetBreakdown>({
    realEstate: 0,
    vehicles: 0,
    investments: 0,
    cash: 0,
    retirement: 0,
    collectibles: 0,
    digital: 0,
    other: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const calculateGrowthPercentage = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  };

  const getPreviousSnapshot = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_financial_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .lt('snapshot_date', new Date().toISOString().split('T')[0]) // Previous days only
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching previous snapshot:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const createDailySnapshot = async (totalAssets: number, totalLiabilities: number, netWorth: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('upsert_daily_financial_snapshot', {
        p_user_id: user.id,
        p_total_assets: totalAssets,
        p_total_liabilities: totalLiabilities,
        p_net_worth: netWorth
      });

      if (error) {
        console.error('Error creating daily snapshot:', error);
      } else {
        console.log('Daily financial snapshot updated successfully');
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
    }
  };

  const calculateMetrics = async () => {
    if (!user) {
      setMetrics({
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        assetGrowth: 0,
        liabilityGrowth: 0,
        netWorthGrowth: 0,
        assetCount: 0,
        propertyCount: 0,
        vehicleCount: 0,
      });
      setAssetBreakdown({
        realEstate: 0,
        vehicles: 0,
        investments: 0,
        cash: 0,
        retirement: 0,
        collectibles: 0,
        digital: 0,
        other: 0,
      });
      setLoading(false);
      return;
    }

    try {
      // Fetch current assets
      const { data: assets, error: assetsError } = await supabase
        .from('user_assets')
        .select('*')
        .eq('user_id', user.id);

      if (assetsError) {
        console.error('Error fetching assets:', assetsError);
        toast.error('Failed to load assets');
        return;
      }

      // Fetch current liabilities
      const { data: liabilities, error: liabilitiesError } = await supabase
        .from('user_liabilities')
        .select('*')
        .eq('user_id', user.id);

      if (liabilitiesError) {
        console.error('Error fetching liabilities:', liabilitiesError);
        toast.error('Failed to load liabilities');
        return;
      }

      // Calculate totals
      const totalAssets = assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0;
      const totalLiabilities = liabilities?.reduce((sum, liability) => sum + Number(liability.amount), 0) || 0;
      const netWorth = totalAssets - totalLiabilities;

      // Get previous snapshot for growth calculation
      const previousSnapshot = await getPreviousSnapshot();

      // Calculate real growth percentages
      let assetGrowth = 0;
      let liabilityGrowth = 0;
      let netWorthGrowth = 0;

      if (previousSnapshot) {
        assetGrowth = calculateGrowthPercentage(totalAssets, Number(previousSnapshot.total_assets));
        liabilityGrowth = calculateGrowthPercentage(totalLiabilities, Number(previousSnapshot.total_liabilities));
        netWorthGrowth = calculateGrowthPercentage(netWorth, Number(previousSnapshot.net_worth));
      }

      // Create/update today's snapshot for future calculations
      await createDailySnapshot(totalAssets, totalLiabilities, netWorth);

      // Calculate asset breakdown
      const breakdown: AssetBreakdown = {
        realEstate: 0,
        vehicles: 0,
        investments: 0,
        cash: 0,
        retirement: 0,
        collectibles: 0,
        digital: 0,
        other: 0,
      };

      assets?.forEach(asset => {
        const value = Number(asset.value);
        switch (asset.type) {
          case 'property':
            breakdown.realEstate += value;
            break;
          case 'vehicle':
          case 'boat':
            breakdown.vehicles += value;
            break;
          case 'investment':
            breakdown.investments += value;
            break;
          case 'cash':
            breakdown.cash += value;
            break;
          case 'retirement':
            breakdown.retirement += value;
            break;
          case 'art':
          case 'antique':
          case 'jewelry':
          case 'collectible':
            breakdown.collectibles += value;
            break;
          case 'digital':
            breakdown.digital += value;
            break;
          default:
            breakdown.other += value;
        }
      });

      // Calculate counts
      const assetCount = assets?.length || 0;
      const propertyCount = assets?.filter(asset => asset.type === 'property').length || 0;
      const vehicleCount = assets?.filter(asset => asset.type === 'vehicle' || asset.type === 'boat').length || 0;

      setMetrics({
        totalAssets,
        totalLiabilities,
        netWorth,
        assetGrowth,
        liabilityGrowth,
        netWorthGrowth,
        assetCount,
        propertyCount,
        vehicleCount,
      });

      setAssetBreakdown(breakdown);

    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast.error('Failed to calculate dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMetrics();

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
            console.log('Assets changed, recalculating metrics');
            calculateMetrics();
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
            console.log('Liabilities changed, recalculating metrics');
            calculateMetrics();
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
    assetBreakdown,
    loading,
    refreshData: calculateMetrics
  };
};
