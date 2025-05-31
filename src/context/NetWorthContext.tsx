
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, Account, Property } from '@/types/assets';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useSupabaseAssets } from '@/hooks/useSupabaseAssets';
import { useSupabaseLiabilities } from '@/hooks/useSupabaseLiabilities';

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
  loading: boolean;
}

// Create context
const NetWorthContext = createContext<NetWorthContextType | undefined>(undefined);

export { type Asset }; // Export Asset type to be used by components

export const NetWorthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('NetWorthProvider rendering');
  
  // Use Supabase hooks for real-time data
  const { assets: supabaseAssets, getTotalValue, loading: assetsLoading } = useSupabaseAssets();
  const { getTotalLiabilities, loading: liabilitiesLoading } = useSupabaseLiabilities();
  
  // Use our custom hook for asset management logic
  const { 
    assets: localAssets, 
    accounts,
    addAsset, 
    updateAsset, 
    removeAsset, 
    getTotalNetWorth: getLocalTotalNetWorth,
    getTotalAssetsByType: getLocalTotalAssetsByType,
    getAssetsByOwner,
    getAssetsByCategory,
    syncPropertiesToAssets
  } = useAssetManagement();

  // Convert Supabase assets to Asset format
  const convertedAssets: Asset[] = supabaseAssets.map(asset => ({
    id: asset.id,
    name: asset.name,
    type: asset.type as Asset['type'],
    value: Number(asset.value),
    owner: asset.owner,
    lastUpdated: asset.updated_at,
    source: 'manual'
  }));

  // Combine local and Supabase assets
  const allAssets = [...localAssets, ...convertedAssets];
  
  // Calculate totals using real Supabase data
  const totalAssetValue = getTotalValue() + localAssets.reduce((total, asset) => total + asset.value, 0);
  const totalLiabilityValue = getTotalLiabilities();
  const loading = assetsLoading || liabilitiesLoading;

  // Enhanced functions that work with Supabase data
  const getTotalNetWorth = () => {
    return totalAssetValue - totalLiabilityValue;
  };

  const getTotalAssetsByType = (type: Asset['type']) => {
    // Get from Supabase assets
    const supabaseValue = supabaseAssets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + Number(asset.value), 0);
    
    // Get from local assets
    const localValue = getLocalTotalAssetsByType(type);
    
    return supabaseValue + localValue;
  };

  const contextValue = {
    assets: allAssets, 
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
    getAssetsByCategory,
    loading
  };

  console.log('NetWorthProvider context created with assets:', allAssets.length, 'total value:', totalAssetValue);

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
