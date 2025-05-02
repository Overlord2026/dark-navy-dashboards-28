
export interface Investment {
  id: string;
  name: string;
  currentValue: number;
  purchaseDate: Date;
}

export interface AssetClass {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
