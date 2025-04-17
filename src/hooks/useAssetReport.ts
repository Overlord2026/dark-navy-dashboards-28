
import { useState, useEffect } from 'react';
import { AssetEntry } from '@/types/assetReport';

export function useAssetReport() {
  const [assets, setAssets] = useState<AssetEntry[]>(() => {
    const saved = localStorage.getItem('asset-report-data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('asset-report-data', JSON.stringify(assets));
  }, [assets]);

  const addAsset = () => {
    const newAsset: AssetEntry = {
      id: `asset-${Date.now()}`,
      name: '',
      type: 'other',
      owner: '',
      value: 0
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<AssetEntry>) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === id ? { ...asset, ...updates } : asset
      )
    );
  };

  const deleteAsset = (id: string) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
  };

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  };

  return {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalValue
  };
}
