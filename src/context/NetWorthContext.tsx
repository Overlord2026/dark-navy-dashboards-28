
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Asset, Account, Property } from '@/types/assets';
import { 
  getInitialAssets, 
  getInitialAccounts,
  calculateTotalNetWorth,
  calculateTotalAssetsByType,
  getAssetsByOwner,
  getAssetsByCategory,
  createPropertyAssets
} from '@/hooks/useAssetManagement';

interface NetWorthContextType {
  assets: Asset[];
  accounts: Account[]; 
  totalAssetValue: number;
  totalLiabilityValue: number;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  getTotalNetWorth: () => number;
  getTotalAssetsByType: (type: Asset['type']) => number;
  syncPropertiesToAssets: (properties: Property[]) => void;
  getAssetsByOwner: (owner: string) => Asset[];
  getAssetsByCategory: (category: string) => Asset[];
}

// Create context
const NetWorthContext = createContext<NetWorthContextType | undefined>(undefined);

export { type Asset }; // Export Asset type to be used by components

export const NetWorthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('NetWorthProvider rendering');
  
  // Move all React state hooks inside the component
  const [assets, setAssets] = useState<Asset[]>(getInitialAssets());
  const [accounts] = useState<Account[]>(getInitialAccounts());
  
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
    return calculateTotalNetWorth(assets);
  };

  // Get total value of assets by type
  const getTotalAssetsByType = (type: Asset['type']) => {
    return calculateTotalAssetsByType(assets, type);
  };

  // Get assets by owner - pass current assets to the utility function
  const getAssetsByOwnerFn = (owner: string) => {
    return getAssetsByOwner(assets, owner);
  };
  
  // Get assets by category - pass current assets to the utility function
  const getAssetsByCategoryFn = (category: string) => {
    return getAssetsByCategory(assets, category);
  };

  // Sync properties to assets list
  const syncPropertiesToAssets = (properties: Property[]) => {
    // First, remove all existing property assets
    const nonPropertyAssets = assets.filter(asset => asset.type !== 'property');
    
    // Create asset entries for each property
    const propertyAssets: Asset[] = createPropertyAssets(properties);
    
    // Update the assets list with non-property assets and new property assets
    setAssets([...nonPropertyAssets, ...propertyAssets]);
  };
  
  // Calculate totals
  const totalAssetValue = assets.reduce((total, asset) => total + asset.value, 0);
  const totalLiabilityValue = 150000; // Sample fixed value for liabilities

  const contextValue = {
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
    getAssetsByOwner: getAssetsByOwnerFn,
    getAssetsByCategory: getAssetsByCategoryFn
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
