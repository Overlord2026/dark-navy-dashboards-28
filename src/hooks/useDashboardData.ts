
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

      // For demo purposes, calculate mock growth percentages
      // In a real application, you'd compare with historical data
      const assetGrowth = totalAssets > 0 ? 5.3 : 0; // Mock 5.3% growth
      const liabilityGrowth = totalLiabilities > 0 ? 1.5 : 0; // Mock 1.5% growth
      const netWorthGrowth = netWorth > 0 ? 7.5 : 0; // Mock 7.5% growth

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
