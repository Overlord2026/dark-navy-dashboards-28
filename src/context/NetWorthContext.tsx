
import React, { createContext, useContext, ReactNode } from 'react';
import { Asset, Account, Property } from '@/types/assets';
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
  console.log('NetWorthProvider rendering with real-time Supabase data');
  
  // Use Supabase hooks for real-time data
  const { 
    assets: supabaseAssets, 
    getTotalValue, 
    loading: assetsLoading,
    addAsset: addSupabaseAsset,
    updateAsset: updateSupabaseAsset,
    deleteAsset: deleteSupabaseAsset
  } = useSupabaseAssets();
  
  const { 
    getTotalLiabilities, 
    loading: liabilitiesLoading 
  } = useSupabaseLiabilities();

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

  // Use real Supabase data
  const totalAssetValue = getTotalValue();
  const totalLiabilityValue = getTotalLiabilities();
  const loading = assetsLoading || liabilitiesLoading;

  // Enhanced functions that work with Supabase data
  const getTotalNetWorth = () => {
    return totalAssetValue - totalLiabilityValue;
  };

  const getTotalAssetsByType = (type: Asset['type']) => {
    return supabaseAssets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + Number(asset.value), 0);
  };

  const getAssetsByOwner = (owner: string) => {
    return convertedAssets.filter(asset => asset.owner === owner);
  };

  const getAssetsByCategory = (category: string) => {
    if (category === 'vehicles') {
      return convertedAssets.filter(asset => ['vehicle', 'boat'].includes(asset.type));
    }
    if (category === 'collectibles') {
      return convertedAssets.filter(asset => ['antique', 'collectible', 'jewelry', 'art'].includes(asset.type));
    }
    if (category === 'all') {
      return convertedAssets;
    }
    return convertedAssets.filter(asset => asset.type === category);
  };

  const addAsset = async (asset: Asset) => {
    await addSupabaseAsset({
      name: asset.name,
      type: asset.type,
      owner: asset.owner,
      value: asset.value,
    });
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    await updateSupabaseAsset(id, {
      name: updates.name,
      type: updates.type,
      owner: updates.owner,
      value: updates.value,
    });
  };

  const removeAsset = async (id: string) => {
    await deleteSupabaseAsset(id);
  };

  const syncPropertiesToAssets = (properties: Property[]) => {
    // This function could sync property data with assets if needed
    console.log('Syncing properties to assets:', properties.length);
  };

  const contextValue = {
    assets: convertedAssets, 
    accounts: [], // Empty for now, could be populated from another Supabase table
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

  console.log('NetWorthProvider context created with Supabase assets:', convertedAssets.length, 'total value:', totalAssetValue);

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
