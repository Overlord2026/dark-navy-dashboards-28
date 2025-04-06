
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '@/types/property';
import { Asset, Account, NetWorthContextType } from '@/types/asset';
import { 
  calculateTotalValue, 
  getTotalValueByType,
  getAssetsByOwner,
  getAssetsByCategory
} from '@/utils/assetUtils';
import { initialAssets, initialAccounts, initialLiabilityValue } from '@/data/initialAssets';

// Create context
const NetWorthContext = createContext<NetWorthContextType | undefined>(undefined);

export const NetWorthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('NetWorthProvider rendering');
  
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  // Calculate totals
  const totalAssetValue = calculateTotalValue(assets);
  const totalLiabilityValue = initialLiabilityValue;

  // Add an asset to the list
  const addAsset = (asset: Asset) => {
    setAssets(prevAssets => [...prevAssets, asset]);
  };

  // Update an existing asset
  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      )
    );
  };

  // Remove an asset
  const removeAsset = (id: string) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
  };

  // Get total net worth across all assets
  const getTotalNetWorth = () => {
    return calculateTotalValue(assets);
  };

  // Get total value of assets by type
  const getTotalAssetsByType = (type: Asset['type']) => {
    return getTotalValueByType(assets, type);
  };

  // Sync properties to assets list
  const syncPropertiesToAssets = (properties: Property[]) => {
    // First, remove all existing property assets
    const nonPropertyAssets = assets.filter(asset => asset.type !== 'property');
    
    // Create asset entries for each property
    const propertyAssets: Asset[] = properties.map(property => ({
      id: `property-${property.id}`,
      name: property.name,
      type: 'property' as const,
      value: property.currentValue,
      owner: property.owner,
      lastUpdated: property.valuation?.lastUpdated || new Date().toISOString().split('T')[0],
      sourceId: property.id,
      source: property.valuation ? 'zillow' : 'manual'
    }));
    
    // Update the assets list with non-property assets and new property assets
    setAssets([...nonPropertyAssets, ...propertyAssets]);
  };

  const contextValue: NetWorthContextType = {
    assets, 
    accounts,
    totalAssetValue,
    totalLiabilityValue, 
    addAsset, 
    updateAsset, 
    removeAsset, 
    getTotalNetWorth, 
    getTotalAssetsByType,
    syncPropertiesToAssets,
    getAssetsByOwner: (owner: string) => getAssetsByOwner(assets, owner),
    getAssetsByCategory: (category: string) => getAssetsByCategory(assets, category)
  };

  console.log('NetWorthProvider context created with assets:', assets.length);

  return (
    <NetWorthContext.Provider value={contextValue}>
      {children}
    </NetWorthContext.Provider>
  );
};

export const useNetWorth = () => {
  const context = useContext(NetWorthContext);
  
  if (context === undefined) {
    console.error('useNetWorth called outside of NetWorthProvider');
    throw new Error('useNetWorth must be used within a NetWorthProvider');
  }
  
  return context;
};

// Re-export types for convenience
export type { Asset, Account };
