
import { useState, useEffect } from 'react';
import { useAssetReport } from './useAssetReport';
import { useLiabilityReport } from './useLiabilityReport';

export function useNetWorthReport() {
  const { assets, getTotalValue: getTotalAssets, getTotalByType: getTotalAssetsByType } = useAssetReport();
  const { liabilities, getTotalLiabilities } = useLiabilityReport();
  
  const getNetWorth = () => {
    return getTotalAssets() - getTotalLiabilities();
  };

  return {
    assets,
    liabilities,
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    getTotalAssetsByType
  };
}
