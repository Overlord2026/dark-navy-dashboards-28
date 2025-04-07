
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

export interface Property {
  id: string;
  name: string;
  address?: string;
  owner: string;
  currentValue: number;
  valuation?: {
    lastUpdated: string;
    source?: string;
  };
  purchaseInfo?: {
    date: string;
    price: number;
  };
}
