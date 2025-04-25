
import { useState, useEffect, useCallback } from 'react';
import { getAllInvestmentCategoryData } from '@/services/market-data';
import { MarketData as MarketDataType } from '@/services/market-data/types';
import { toast } from 'sonner';

interface MarketDataHook {
  id: string;
  name: string;
  ytdPerformance: number;
  isLoading: boolean;
  error?: string;
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketDataHook>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllInvestmentCategoryData();
      setMarketData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      toast.error(`Error loading market data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    toast.info('Refreshing market data...');
    await fetchData();
    toast.success('Market data refreshed');
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Set up a refresh interval (every 15 minutes)
    const intervalId = setInterval(fetchData, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { 
    marketData, 
    isLoading, 
    error, 
    refreshData,
    lastUpdated
  };
};
