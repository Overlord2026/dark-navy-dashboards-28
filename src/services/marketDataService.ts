
// Mock service to fetch investment category data
// This would be replaced with actual API calls in a production environment

export interface MarketData {
  ytdPerformance: number;
  quarterlyPerformance?: number;
  annualizedReturn?: number;
  volatility?: number;
}

export interface MarketDataResponse {
  [key: string]: MarketData;
}

// Simulated API call
export const getAllInvestmentCategoryData = async (): Promise<MarketDataResponse> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    'private-equity': { 
      ytdPerformance: 12.4,
      quarterlyPerformance: 3.2,
      annualizedReturn: 16.8,
      volatility: 18.5
    },
    'private-debt': { 
      ytdPerformance: 8.7,
      quarterlyPerformance: 2.1,
      annualizedReturn: 9.4,
      volatility: 8.2
    },
    'digital-assets': { 
      ytdPerformance: 15.8,
      quarterlyPerformance: 7.5,
      annualizedReturn: 22.3,
      volatility: 35.8
    },
    'real-assets': { 
      ytdPerformance: 9.1,
      quarterlyPerformance: 2.8,
      annualizedReturn: 11.3,
      volatility: 12.4
    }
  };
};

export const getPortfolioModelById = async (id: string) => {
  // This would be an actual API call in production
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data based on id
  // In a real implementation, this would fetch from an API
  return {
    id,
    // Additional portfolio details would be fetched here
  };
};
