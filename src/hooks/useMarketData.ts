
import { useState, useEffect } from 'react';
import { getAllInvestmentCategoryData, MarketDataResponse } from '@/services/marketDataService';

/**
 * Custom hook to fetch market data from the service layer
 * @returns Market data, loading state and error information
 */
export const useMarketData = () => {
  const [alternativeData, setAlternativeData] = useState<MarketDataResponse>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInvestmentCategoryData();
        setAlternativeData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching market data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        // Fallback data
        setAlternativeData({
          'private-equity': { ytdPerformance: 12.4 },
          'private-debt': { ytdPerformance: 8.7 },
          'digital-assets': { ytdPerformance: 15.8 },
          'real-assets': { ytdPerformance: 9.1 }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);

  return { alternativeData, isLoading, error };
};
