import { useState, useEffect, useMemo } from 'react';
import { useBootstrap } from './useBootstrap';
import { useAuth } from '@/context/AuthContext';

export interface OptimizedDashboardMetrics {
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

export interface OptimizedAssetBreakdown {
  realEstate: number;
  vehicles: number;
  investments: number;
  cash: number;
  retirement: number;
  collectibles: number;
  digital: number;
  other: number;
}

export const useOptimizedDashboard = () => {
  const { user } = useAuth();
  const { data: bootstrapData, loading: bootstrapLoading, error, refresh } = useBootstrap();
  const [previousSnapshot, setPreviousSnapshot] = useState<any>(null);

  // Memoized calculations to prevent unnecessary re-computations
  const metrics = useMemo((): OptimizedDashboardMetrics => {
    if (!bootstrapData) {
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        assetGrowth: 0,
        liabilityGrowth: 0,
        netWorthGrowth: 0,
        assetCount: 0,
        propertyCount: 0,
        vehicleCount: 0,
      };
    }

    const { assets, liabilities, totalAssets, totalLiabilities, netWorth } = bootstrapData;

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    let assetGrowth = 0;
    let liabilityGrowth = 0;
    let netWorthGrowth = 0;

    if (previousSnapshot) {
      assetGrowth = calculateGrowth(totalAssets, Number(previousSnapshot.total_assets));
      liabilityGrowth = calculateGrowth(totalLiabilities, Number(previousSnapshot.total_liabilities));
      netWorthGrowth = calculateGrowth(netWorth, Number(previousSnapshot.net_worth));
    }

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      assetGrowth,
      liabilityGrowth,
      netWorthGrowth,
      assetCount: assets.length,
      propertyCount: assets.filter(asset => asset.type === 'property').length,
      vehicleCount: assets.filter(asset => ['vehicle', 'boat'].includes(asset.type)).length,
    };
  }, [bootstrapData, previousSnapshot]);

  const assetBreakdown = useMemo((): OptimizedAssetBreakdown => {
    if (!bootstrapData?.assets) {
      return {
        realEstate: 0,
        vehicles: 0,
        investments: 0,
        cash: 0,
        retirement: 0,
        collectibles: 0,
        digital: 0,
        other: 0,
      };
    }

    const breakdown: OptimizedAssetBreakdown = {
      realEstate: 0,
      vehicles: 0,
      investments: 0,
      cash: 0,
      retirement: 0,
      collectibles: 0,
      digital: 0,
      other: 0,
    };

    bootstrapData.assets.forEach(asset => {
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

    return breakdown;
  }, [bootstrapData?.assets]);

  // Load previous snapshot for growth calculations
  useEffect(() => {
    const loadPreviousSnapshot = async () => {
      if (!user?.id || !bootstrapData) return;

      try {
        // This would be cached or optimized in a real implementation
        const response = await fetch(`/api/previous-snapshot/${user.id}`);
        if (response.ok) {
          const snapshot = await response.json();
          setPreviousSnapshot(snapshot);
        }
      } catch (error) {
        console.log('No previous snapshot available');
      }
    };

    loadPreviousSnapshot();
  }, [user?.id, bootstrapData]);

  return {
    metrics,
    assetBreakdown,
    loading: bootstrapLoading,
    error,
    refresh,
    bootstrapData
  };
};