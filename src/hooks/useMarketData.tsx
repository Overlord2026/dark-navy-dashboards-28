
import { useState, useEffect } from 'react';
import { getAllInvestmentCategoryData } from '@/services/marketDataService';

interface MarketData {
  id: string;
  name: string;
  ytdPerformance: number;
  isLoading: boolean;
  error?: string;
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInvestmentCategoryData();
        setMarketData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up a refresh interval (every 30 minutes)
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { marketData, isLoading, error };
};
