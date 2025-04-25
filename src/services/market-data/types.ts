
export interface MarketData {
  id: string;
  name: string;
  ytdPerformance: number;
  isLoading: boolean;
  error?: string;
}

export interface MarketDataCache {
  data: MarketData;
  timestamp: number;
}

export interface PriceHistoryDataPoint {
  date: string;
  price: number;
}
