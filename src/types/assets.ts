
import { Property } from './property';

export type AssetType = 'cash' | 'investment' | 'retirement' | 'property' | 'vehicle' | 'boat' | 'art' | 'digital' | 'other';
export type AccountType = 'banking' | 'investment' | 'retirement' | 'managed' | 'other';

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
}
