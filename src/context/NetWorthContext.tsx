
import React, { createContext, useContext, useState } from 'react';
import { Asset, Account, AssetType, NetWorthContextType } from '@/types/assets';
import { Property } from '@/types/property';
import { getInitialAssets, getInitialAccounts, createPropertyAssets, getAssetsByCategory as getAssetsByCategoryUtil } from '@/hooks/useAssetManagement';

const NetWorthContext = createContext<NetWorthContextType>({
  assets: [],
  accounts: [],
  calculateTotalNetWorth: () => 0,
  calculateTotalAssetsByType: () => 0,
  syncPropertiesToAssets: () => {},
  // Add missing method implementations in the default context
  addAsset: () => {},
  removeAsset: () => {},
  updateAsset: () => {},
  getTotalNetWorth: () => 0,
  getTotalAssetsByType: () => 0,
  getAssetsByCategory: () => [],
  getAssetsByOwner: () => [],
  totalAssetValue: 0,
  totalLiabilityValue: 845210, // Default value from the NetWorthSummary component
});

export const NetWorthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(getInitialAssets());
  const [accounts, setAccounts] = useState<Account[]>(getInitialAccounts());

  // Calculate total asset value
  const totalAssetValue = assets.reduce((total, asset) => total + asset.value, 0);
  // Using a fixed value for totalLiabilityValue as in the NetWorthSummary component
  const totalLiabilityValue = 845210;

  const calculateTotalNetWorth = (): number => {
    return assets.reduce((total, asset) => total + asset.value, 0);
  };

  const calculateTotalAssetsByType = (type: AssetType): number => {
    return assets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + asset.value, 0);
  };

  // Alias methods to match the expected names in the components
  const getTotalNetWorth = calculateTotalNetWorth;
  const getTotalAssetsByType = calculateTotalAssetsByType;

  const syncPropertiesToAssets = (properties: Property[]): void => {
    // Remove existing property assets
    const nonPropertyAssets = assets.filter(asset => asset.type !== 'property');
    
    // Create new property assets
    const propertyAssets = createPropertyAssets(properties);
    
    // Update assets state with non-property assets and new property assets
    setAssets([...nonPropertyAssets, ...propertyAssets]);
  };

  // Add the missing methods
  const addAsset = (asset: Asset): void => {
    setAssets(prevAssets => [...prevAssets, asset]);
  };

  const removeAsset = (id: string): void => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
  };

  const updateAsset = (id: string, updates: Partial<Asset>): void => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    );
  };

  const getAssetsByCategory = (category: string): Asset[] => {
    return getAssetsByCategoryUtil(assets, category);
  };

  const getAssetsByOwner = (owner: string): Asset[] => {
    return assets.filter(asset => asset.owner === owner);
  };

  return (
    <NetWorthContext.Provider
      value={{
        assets,
        accounts,
        calculateTotalNetWorth,
        calculateTotalAssetsByType,
        syncPropertiesToAssets,
        // Add the new methods to the provider value
        addAsset,
        removeAsset,
        updateAsset,
        getTotalNetWorth,
        getTotalAssetsByType,
        getAssetsByCategory,
        getAssetsByOwner,
        totalAssetValue,
        totalLiabilityValue,
      }}
    >
      {children}
    </NetWorthContext.Provider>
  );
};

export const useNetWorth = () => useContext(NetWorthContext);
