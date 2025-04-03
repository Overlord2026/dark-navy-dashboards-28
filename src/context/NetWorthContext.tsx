
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@/types/property';

// Define the assets structure
export interface Asset {
  id: string;
  name: string;
  type: 'property' | 'investment' | 'cash' | 'retirement' | 'vehicle' | 'boat' | 'collectible' | 'digital' | 'art' | 'antique' | 'jewelry' | 'other';
  value: number;
  owner: string;
  lastUpdated: string;
  sourceId?: string; // Reference to the source object (like property.id)
  source?: 'zillow' | 'manual' | 'other'; // Where the valuation came from
  details?: {
    year?: string;
    make?: string;
    model?: string;
    description?: string;
    location?: string;
    insuredValue?: number;
    purchaseDate?: string;
    condition?: string;
    imageUrl?: string;
  };
}

// Define account structure for mobile accounts page
export interface Account {
  id: string;
  name: string;
  type: 'managed' | 'investment' | 'manual' | 'loan' | 'banking';
  value: number;
  institution?: string;
  lastUpdated?: string;
}

interface NetWorthContextType {
  assets: Asset[];
  accounts: Account[]; // Add accounts property
  totalAssetValue: number; // Add totalAssetValue property
  totalLiabilityValue: number; // Add totalLiabilityValue property
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
  
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'cash1',
      name: 'Checking Account',
      type: 'cash',
      value: 25000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
      id: 'invest1',
      name: 'Stock Portfolio',
      type: 'investment',
      value: 350000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
      id: 'retire1',
      name: '401(k)',
      type: 'retirement',
      value: 420000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
      id: 'vehicle1',
      name: 'Tesla Model X',
      type: 'vehicle',
      value: 85000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: {
        year: '2023',
        make: 'Tesla',
        model: 'Model X',
        condition: 'Excellent'
      }
    },
    {
      id: 'boat1',
      name: 'Yacht',
      type: 'boat',
      value: 750000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: {
        year: '2021',
        make: 'Sea Ray',
        model: 'Sundancer 370',
        location: 'Boston Harbor Marina'
      }
    },
    {
      id: 'art1',
      name: 'Modern Art Collection',
      type: 'art',
      value: 120000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: {
        description: 'Collection of contemporary art pieces',
        location: 'Primary Residence'
      }
    },
    {
      id: 'digital1',
      name: 'Cryptocurrency Portfolio',
      type: 'digital',
      value: 85000,
      owner: 'Tom Brady',
      lastUpdated: new Date().toISOString().split('T')[0],
      details: {
        description: 'Bitcoin, Ethereum, and other cryptocurrencies'
      }
    }
  ]);

  // Add sample accounts for mobile accounts page
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'acc1',
      name: 'Primary Checking',
      type: 'banking',
      value: 15000,
      institution: 'Chase Bank'
    },
    {
      id: 'acc2',
      name: 'Investment Account',
      type: 'investment',
      value: 250000,
      institution: 'Fidelity'
    },
    {
      id: 'acc3',
      name: 'Managed Portfolio',
      type: 'managed',
      value: 500000,
      institution: 'Family Office'
    }
  ]);

  // Calculate totals
  const totalAssetValue = assets.reduce((total, asset) => total + asset.value, 0);
  const totalLiabilityValue = 150000; // Sample fixed value for liabilities

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

  // Get assets by owner
  const getAssetsByOwner = (owner: string) => {
    return assets.filter(asset => asset.owner === owner);
  };
  
  // Get assets by category (could be a specific type or a group of types)
  const getAssetsByCategory = (category: string) => {
    if (category === 'vehicles') {
      return assets.filter(asset => ['vehicle', 'boat'].includes(asset.type));
    }
    if (category === 'collectibles') {
      return assets.filter(asset => ['art', 'antique', 'collectible', 'jewelry'].includes(asset.type));
    }
    if (category === 'digital') {
      return assets.filter(asset => asset.type === 'digital');
    }
    // Default: return by exact type
    return assets.filter(asset => asset.type === category);
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

  const contextValue = {
    assets, 
    accounts, // Add accounts to context value
    totalAssetValue, // Add totalAssetValue to context value
    totalLiabilityValue, // Add totalLiabilityValue to context value
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
