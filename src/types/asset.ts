
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

export interface NetWorthContextType {
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
