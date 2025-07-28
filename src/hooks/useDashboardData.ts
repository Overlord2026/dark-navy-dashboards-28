import { useMemo, useCallback } from 'react';
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

interface Asset {
  id: string;
  type: string;
  value: number;
  [key: string]: any;
}

interface Liability {
  id: string;
  amount: number;
  [key: string]: any;
}

export const useDashboardData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [previousSnapshot, setPreviousSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Memoized calculation functions
  const calculateGrowthPercentage = useCallback((current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  }, []);

  // Memoized asset totals calculation
  const assetTotals = useMemo(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value || 0), 0);
    const assetCount = assets.length;
    const propertyCount = assets.filter(asset => asset.type === 'property').length;
    const vehicleCount = assets.filter(asset => 
      asset.type === 'vehicle' || asset.type === 'boat'
    ).length;

    return {
      totalAssets,
      assetCount,
      propertyCount,
      vehicleCount
    };
  }, [assets]);

  // Memoized liability totals calculation  
  const liabilityTotals = useMemo(() => {
    return {
      totalLiabilities: liabilities.reduce((sum, liability) => sum + Number(liability.amount || 0), 0)
    };
  }, [liabilities]);

  // Memoized net worth calculation
  const netWorth = useMemo(() => {
    return assetTotals.totalAssets - liabilityTotals.totalLiabilities;
  }, [assetTotals.totalAssets, liabilityTotals.totalLiabilities]);

  // Memoized growth calculations
  const growthMetrics = useMemo(() => {
    if (!previousSnapshot) {
      return {
        assetGrowth: 0,
        liabilityGrowth: 0,
        netWorthGrowth: 0
      };
    }

    return {
      assetGrowth: calculateGrowthPercentage(
        assetTotals.totalAssets, 
        Number(previousSnapshot.total_assets || 0)
      ),
      liabilityGrowth: calculateGrowthPercentage(
        liabilityTotals.totalLiabilities, 
        Number(previousSnapshot.total_liabilities || 0)
      ),
      netWorthGrowth: calculateGrowthPercentage(
        netWorth, 
        Number(previousSnapshot.net_worth || 0)
      )
    };
  }, [
    assetTotals.totalAssets, 
    liabilityTotals.totalLiabilities, 
    netWorth, 
    previousSnapshot, 
    calculateGrowthPercentage
  ]);

  // Memoized asset breakdown calculation
  const assetBreakdown = useMemo<AssetBreakdown>(() => {
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

    assets.forEach(asset => {
      const value = Number(asset.value || 0);
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

    return breakdown;
  }, [assets]);

  // Memoized final metrics object
  const metrics = useMemo<DashboardMetrics>(() => ({
    ...assetTotals,
    ...liabilityTotals,
    netWorth,
    ...growthMetrics,
  }), [assetTotals, liabilityTotals, netWorth, growthMetrics]);

  const getPreviousSnapshot = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_financial_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .lt('snapshot_date', new Date().toISOString().split('T')[0])
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }, [user]);

  const createDailySnapshot = useCallback(async (totalAssets: number, totalLiabilities: number, netWorth: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('upsert_daily_financial_snapshot', {
        p_user_id: user.id,
        p_total_assets: totalAssets,
        p_total_liabilities: totalLiabilities,
        p_net_worth: netWorth
      });

      if (error) {
        // Silent fail for daily snapshot creation
      }
    } catch (error) {
      // Silent fail for snapshot creation
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setAssets([]);
      setLiabilities([]);
      setPreviousSnapshot(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all data in parallel
      const [assetsResult, liabilitiesResult, snapshotResult] = await Promise.all([
        supabase
          .from('user_assets')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('user_liabilities')
          .select('*')
          .eq('user_id', user.id),
        getPreviousSnapshot()
      ]);

      if (assetsResult.error) {
        toast.error('Failed to load assets');
        return;
      }

      if (liabilitiesResult.error) {
        toast.error('Failed to load liabilities');
        return;
      }

      setAssets(assetsResult.data || []);
      setLiabilities(liabilitiesResult.data || []);
      setPreviousSnapshot(snapshotResult);

      // Create snapshot with current totals (will be calculated by memoized values)
      const currentAssets = (assetsResult.data || []).reduce((sum, asset) => sum + Number(asset.value || 0), 0);
      const currentLiabilities = (liabilitiesResult.data || []).reduce((sum, liability) => sum + Number(liability.amount || 0), 0);
      const currentNetWorth = currentAssets - currentLiabilities;

      await createDailySnapshot(currentAssets, currentLiabilities, currentNetWorth);

    } catch (error) {
      toast.error('Failed to calculate dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [user, getPreviousSnapshot, createDailySnapshot]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

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
            fetchData();
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
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(assetsChannel);
        supabase.removeChannel(liabilitiesChannel);
      };
    }
  }, [user, fetchData]);

  return {
    metrics,
    assetBreakdown,
    loading,
    refreshData
  };
};