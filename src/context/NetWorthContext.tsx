
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, Account, Property } from '@/types/assets';
import { useAssetManagement } from '@/hooks/useAssetManagement';

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

export const NetWorthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('NetWorthProvider rendering');
  
  // Use our custom hook for asset management logic
  const { 
    assets, 
    accounts,
    addAsset, 
    updateAsset, 
    removeAsset, 
    getTotalNetWorth,
    getTotalAssetsByType,
    getAssetsByOwner,
    getAssetsByCategory,
    syncPropertiesToAssets
  } = useAssetManagement();
  
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
    getAssetsByOwner,
    getAssetsByCategory
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
