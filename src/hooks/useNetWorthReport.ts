
import { useState, useEffect } from 'react';
import { useAssetReport } from './useAssetReport';
import { useLiabilityReport } from './useLiabilityReport';
import { useNetWorth } from '@/context/NetWorthContext';

export function useNetWorthReport() {
  // Use the NetWorth context which has been refactored properly
  const { 
    assets, 
    getTotalNetWorth, 
    getTotalAssetsByType 
  } = useNetWorth();
  
  const { liabilities, getTotalLiabilities } = useLiabilityReport();
  
  const getNetWorth = () => {
    return getTotalNetWorth() - getTotalLiabilities();
  };

  return {
    assets,
    liabilities,
    getTotalAssets: getTotalNetWorth,
    getTotalLiabilities,
    getNetWorth,
    getTotalAssetsByType
  };
}
