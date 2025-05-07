
import React, { createContext, useContext, useState } from 'react';
import { Asset, Account, AssetType, NetWorthContextType } from '@/types/assets';
import { Property } from '@/types/property';
import { getInitialAssets, getInitialAccounts, createPropertyAssets } from '@/hooks/useAssetManagement';

const NetWorthContext = createContext<NetWorthContextType>({
  assets: [],
  accounts: [],
  calculateTotalNetWorth: () => 0,
  calculateTotalAssetsByType: () => 0,
  syncPropertiesToAssets: () => {},
});

export const NetWorthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(getInitialAssets());
  const [accounts, setAccounts] = useState<Account[]>(getInitialAccounts());

  const calculateTotalNetWorth = (): number => {
    return assets.reduce((total, asset) => total + asset.value, 0);
  };

  const calculateTotalAssetsByType = (type: AssetType): number => {
    return assets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + asset.value, 0);
  };

  const syncPropertiesToAssets = (properties: Property[]): void => {
    // Remove existing property assets
    const nonPropertyAssets = assets.filter(asset => asset.type !== 'property');
    
    // Create new property assets
    const propertyAssets = createPropertyAssets(properties);
    
    // Update assets state with non-property assets and new property assets
    setAssets([...nonPropertyAssets, ...propertyAssets]);
  };

  return (
    <NetWorthContext.Provider
      value={{
        assets,
        accounts,
        calculateTotalNetWorth,
        calculateTotalAssetsByType,
        syncPropertiesToAssets,
      }}
    >
      {children}
    </NetWorthContext.Provider>
  );
};

export const useNetWorth = () => useContext(NetWorthContext);
