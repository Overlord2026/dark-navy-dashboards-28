
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@/types/property';

// Define the assets structure
export interface Asset {
  id: string;
  name: string;
  type: 'property' | 'investment' | 'cash' | 'retirement' | 'other';
  value: number;
  owner: string;
  lastUpdated: string;
}

interface NetWorthContextType {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  getTotalNetWorth: () => number;
  getTotalAssetsByType: (type: Asset['type']) => number;
  syncPropertiesToAssets: (properties: Property[]) => void;
}

// Create context
const NetWorthContext = createContext<NetWorthContextType | undefined>(undefined);

export const NetWorthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'cash1',
      name: 'Checking Account',
      type: 'cash',
      value: 25000,
      owner: 'Antonio Gomez',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
      id: 'invest1',
      name: 'Stock Portfolio',
      type: 'investment',
      value: 350000,
      owner: 'Antonio Gomez',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
      id: 'retire1',
      name: '401(k)',
      type: 'retirement',
      value: 420000,
      owner: 'Antonio Gomez',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  ]);

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
    return assets.reduce((total, asset) => total + asset.value, 0);
  };

  // Get total value of assets by type
  const getTotalAssetsByType = (type: Asset['type']) => {
    return assets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + asset.value, 0);
  };

  // Sync properties to assets list
  const syncPropertiesToAssets = (properties: Property[]) => {
    // First, remove all existing property assets
    const nonPropertyAssets = assets.filter(asset => asset.type !== 'property');
    
    // Create asset entries for each property
    const propertyAssets = properties.map(property => ({
      id: `property-${property.id}`,
      name: property.name,
      type: 'property' as const,
      value: property.currentValue,
      owner: property.owner,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
    
    // Update the assets list with non-property assets and new property assets
    setAssets([...nonPropertyAssets, ...propertyAssets]);
  };

  return (
    <NetWorthContext.Provider value={{ 
      assets, 
      addAsset, 
      updateAsset, 
      removeAsset, 
      getTotalNetWorth, 
      getTotalAssetsByType,
      syncPropertiesToAssets
    }}>
      {children}
    </NetWorthContext.Provider>
  );
};

export const useNetWorth = () => {
  const context = useContext(NetWorthContext);
  if (context === undefined) {
    throw new Error('useNetWorth must be used within a NetWorthProvider');
  }
  return context;
};
