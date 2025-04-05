
import { toast } from "sonner";

export interface MarketDataResponse {
  'private-equity': { ytdPerformance: number };
  'private-debt': { ytdPerformance: number };
  'digital-assets': { ytdPerformance: number };
  'real-assets': { ytdPerformance: number };
}

/**
 * Get all investment category performance data
 * This is a mock service that would typically fetch data from an API
 */
export const getAllInvestmentCategoryData = async (): Promise<MarketDataResponse> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // In a real application, this would be an API call
  // For now, we're returning mock data
  return {
    'private-equity': { ytdPerformance: 12.4 },
    'private-debt': { ytdPerformance: 8.7 },
    'digital-assets': { ytdPerformance: 15.8 },
    'real-assets': { ytdPerformance: 9.1 }
  };
};

/**
 * Get performance data for a specific investment category
 */
export const getCategoryPerformanceData = async (category: string): Promise<any> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data based on category
  switch (category) {
    case 'private-equity':
      return {
        ytdPerformance: 12.4,
        oneYearReturn: 15.2,
        threeYearReturn: 42.3,
        fiveYearReturn: 67.5,
        volatility: 'Medium-High',
        correlationToMarket: 0.68
      };
    case 'private-debt':
      return {
        ytdPerformance: 8.7,
        oneYearReturn: 10.3,
        threeYearReturn: 27.4,
        fiveYearReturn: 42.1,
        volatility: 'Medium',
        correlationToMarket: 0.52
      };
    case 'digital-assets':
      return {
        ytdPerformance: 15.8,
        oneYearReturn: 95.7,
        threeYearReturn: 247.9,
        fiveYearReturn: 533.6,
        volatility: 'Very High',
        correlationToMarket: 0.45
      };
    case 'real-assets':
      return {
        ytdPerformance: 9.1,
        oneYearReturn: 11.2,
        threeYearReturn: 32.5,
        fiveYearReturn: 51.8,
        volatility: 'Medium-Low',
        correlationToMarket: 0.32
      };
    default:
      toast.error(`Invalid category: ${category}`);
      throw new Error(`Invalid category: ${category}`);
  }
};
