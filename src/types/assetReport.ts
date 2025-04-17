
export interface AssetEntry {
  id: string;
  name: string;
  type: 'cash' | 'investment' | 'retirement' | 'vehicle' | 'property' | 'other';
  owner: string;
  value: number;
}

export interface AssetReportState {
  assets: AssetEntry[];
}
