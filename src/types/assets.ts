
import { Property } from './property';

export type AssetType = 'cash' | 'investment' | 'retirement' | 'property' | 'vehicle' | 'boat' | 'art' | 'digital' | 'other';
export type AccountType = 'banking' | 'investment' | 'retirement' | 'managed' | 'other' | 'manual' | 'loan';

export interface AssetDetails {
  [key: string]: any;
  description?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  owner: string;
  lastUpdated: string;
  details?: AssetDetails;
  sourceId?: string;
  source?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  value: number;
  institution: string;
}

export interface NetWorthContextType {
  assets: Asset[];
  accounts: Account[];
  calculateTotalNetWorth: () => number;
  calculateTotalAssetsByType: (type: AssetType) => number;
  syncPropertiesToAssets: (properties: Property[]) => void;
  
  // Adding missing methods/properties to fix TypeScript errors
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  getTotalNetWorth: () => number;
  getTotalAssetsByType: (type: AssetType) => number;
  getAssetsByCategory: (category: string) => Asset[];
  getAssetsByOwner: (owner: string) => Asset[];
  totalAssetValue: number;
  totalLiabilityValue: number;
}

// Re-export Property type from property.ts to fix TS2459 errors
export { Property } from './property';
