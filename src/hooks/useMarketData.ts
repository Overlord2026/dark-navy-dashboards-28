
import { useState, useEffect } from 'react';

export interface MarketDataResponse {
  marketSummary: {
    dow: { value: number; change: number; percentChange: number };
    sp500: { value: number; change: number; percentChange: number };
    nasdaq: { value: number; change: number; percentChange: number };
  };
  topGainers: Array<{ symbol: string; name: string; price: number; change: number; percentChange: number }>;
  topLosers: Array<{ symbol: string; name: string; price: number; change: number; percentChange: number }>;
  mostActive: Array<{ symbol: string; name: string; price: number; volume: string }>;
}

// Mock data
const mockMarketData: MarketDataResponse = {
  marketSummary: {
    dow: { value: 39131.53, change: 74.67, percentChange: 0.19 },
    sp500: { value: 5148.22, change: -3.19, percentChange: -0.06 },
    nasdaq: { value: 16285.46, change: -37.21, percentChange: -0.23 }
  },
  topGainers: [
    { symbol: "NUE", name: "Nucor Corp", price: 168.76, change: 12.32, percentChange: 7.88 },
    { symbol: "KLAC", name: "KLA Corporation", price: 729.18, change: 44.27, percentChange: 6.46 },
    { symbol: "ENPH", name: "Enphase Energy", price: 121.92, change: 6.71, percentChange: 5.82 }
  ],
  topLosers: [
    { symbol: "PARA", name: "Paramount Global", price: 13.64, change: -0.98, percentChange: -6.7 },
    { symbol: "CCL", name: "Carnival Corp", price: 16.48, change: -0.88, percentChange: -5.07 },
    { symbol: "AAL", name: "American Airlines", price: 14.05, change: -0.64, percentChange: -4.36 }
  ],
  mostActive: [
    { symbol: "AAPL", name: "Apple Inc", price: 172.62, volume: "64.2M" },
    { symbol: "TSLA", name: "Tesla Inc", price: 218.32, volume: "113.2M" },
    { symbol: "NVDA", name: "NVIDIA Corp", price: 887.91, volume: "43.6M" }
  ]
};

export const useMarketData = () => {
  const [data, setData] = useState<MarketDataResponse>(mockMarketData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('api/market-data');
        // const data = await response.json();
        
        // Mock data delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(mockMarketData);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

export const useAlternativeAssetData = () => {
  const [alternativeData, setAlternativeData] = useState<MarketDataResponse>(mockMarketData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlternativeData(mockMarketData);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { alternativeData, isLoading, error, refreshData };
};
