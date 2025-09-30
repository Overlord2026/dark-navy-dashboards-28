
// Service to fetch market data from free APIs
import { supabase } from '@/integrations/supabase/client';
import { FLAGS } from '@/config/flags';
import { withDemoFallback } from './demoService';

interface FinnhubStockStats {
  ticker: string;
  name: string;
  sector: string;
  beta: number;
  volatility: number;
  yield: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  price: number;
  marketValue?: number;
}

interface PortfolioMetrics {
  portfolioBeta: number;
  avgVolatility: number;
  avgYield: number;
  riskLevel: string;
  volatilityVsSP500: string;
  holdingsWithStats: Array<FinnhubStockStats & { weight: number }>;
}

// Fetch comprehensive stock data using Finnhub API
export const fetchStockStats = async (tickers: string[], holdings?: Array<{ticker: string; marketValue: number}>): Promise<{
  data: FinnhubStockStats[];
  portfolioMetrics?: PortfolioMetrics;
}> => {
  return withDemoFallback(async () => {
    const { data, error } = await supabase.functions.invoke('finnhub-stock-stats', {
      body: { tickers, holdings }
    });

    if (error) throw error;
    
    return {
      data: data.data || [],
      portfolioMetrics: data.portfolioMetrics
    };
  }, '/functions/finnhub-stock-stats', {
    data: tickers.map(ticker => ({
      ticker,
      name: `Demo ${ticker}`,
      sector: 'Technology',
      beta: 1.2,
      volatility: 0.15,
      yield: 0.02,
      oneYearReturn: 0.12,
      threeYearReturn: 0.08,
      fiveYearReturn: 0.10,
      price: 150.00
    })),
    portfolioMetrics: {
      portfolioBeta: 1.15,
      avgVolatility: 0.15,
      avgYield: 0.02,
      riskLevel: 'Moderate',
      volatilityVsSP500: 'Similar',
      holdingsWithStats: []
    }
  });
};

interface MarketData {
  id: string;
  name: string;
  ytdPerformance: number;
  isLoading: boolean;
  error?: string;
}

// Cache for market data to avoid excessive API calls
const marketDataCache: Record<string, { data: MarketData, timestamp: number }> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Fetches data from Alpha Vantage API for a specific symbol
 * Using the free tier with demo API key for educational purposes
 */
const fetchAlphaVantageData = async (symbol: string): Promise<number> => {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${symbol}`);
  }
  
  const data = await response.json();
  
  // Check if we have the expected data structure
  if (!data['Global Quote'] || !data['Global Quote']['10. change percent']) {
    throw new Error('Invalid API response format');
  }
  
  // Extract the change percentage (format: "2.3200%")
  const changePercentStr = data['Global Quote']['10. change percent'];
  const changePercent = parseFloat(changePercentStr.replace('%', ''));
  
  return changePercent;
};

/**
 * Get live performance data for private equity using SPY ETF as a proxy
 */
export const getPrivateEquityData = async (): Promise<MarketData> => {
  const cacheKey = 'private-equity';
  
  // Check if we have fresh cached data
  if (marketDataCache[cacheKey] && 
      (Date.now() - marketDataCache[cacheKey].timestamp) < CACHE_DURATION) {
    return marketDataCache[cacheKey].data;
  }

  try {
    // For private equity, we'll use SPY (S&P 500 ETF) as a proxy
    const changePercent = await fetchAlphaVantageData('SPY');
    
    const result: MarketData = {
      id: 'private-equity',
      name: 'Private Equity',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    // Cache the result
    marketDataCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching private equity data:', error);
    
    // Return fallback data
    return {
      id: 'private-equity',
      name: 'Private Equity',
      ytdPerformance: 12.4, // Fallback value
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get live performance data for private debt using LQD ETF as a proxy
 */
export const getPrivateDebtData = async (): Promise<MarketData> => {
  const cacheKey = 'private-debt';
  
  if (marketDataCache[cacheKey] && 
      (Date.now() - marketDataCache[cacheKey].timestamp) < CACHE_DURATION) {
    return marketDataCache[cacheKey].data;
  }

  try {
    // For private debt, we'll use LQD (iShares iBoxx $ Investment Grade Corporate Bond ETF)
    const changePercent = await fetchAlphaVantageData('LQD');
    
    const result: MarketData = {
      id: 'private-debt',
      name: 'Private Debt',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    marketDataCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching private debt data:', error);
    return {
      id: 'private-debt',
      name: 'Private Debt',
      ytdPerformance: 8.7, // Fallback value
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get live performance data for digital assets using GBTC ETF as a proxy
 */
export const getDigitalAssetsData = async (): Promise<MarketData> => {
  const cacheKey = 'digital-assets';
  
  if (marketDataCache[cacheKey] && 
      (Date.now() - marketDataCache[cacheKey].timestamp) < CACHE_DURATION) {
    return marketDataCache[cacheKey].data;
  }

  try {
    // For digital assets, use GBTC (Grayscale Bitcoin Trust)
    const changePercent = await fetchAlphaVantageData('GBTC');
    
    const result: MarketData = {
      id: 'digital-assets',
      name: 'Digital Assets',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    marketDataCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching digital assets data:', error);
    return {
      id: 'digital-assets',
      name: 'Digital Assets',
      ytdPerformance: 15.8, // Fallback value
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get live performance data for real assets using XLRE ETF as a proxy
 */
export const getRealAssetsData = async (): Promise<MarketData> => {
  const cacheKey = 'real-assets';
  
  if (marketDataCache[cacheKey] && 
      (Date.now() - marketDataCache[cacheKey].timestamp) < CACHE_DURATION) {
    return marketDataCache[cacheKey].data;
  }

  try {
    // For real assets, use XLRE (Real Estate Select Sector SPDR Fund)
    const changePercent = await fetchAlphaVantageData('XLRE');
    
    const result: MarketData = {
      id: 'real-assets',
      name: 'Real Assets',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    marketDataCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching real assets data:', error);
    return {
      id: 'real-assets',
      name: 'Real Assets',
      ytdPerformance: 9.1, // Fallback value
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to fetch all investment category data at once
export const getAllInvestmentCategoryData = async (): Promise<Record<string, MarketData>> => {
  return withDemoFallback(async () => {
    const [privateEquity, privateDebt, digitalAssets, realAssets] = await Promise.all([
      getPrivateEquityData(),
      getPrivateDebtData(),
      getDigitalAssetsData(),
      getRealAssetsData()
    ]);
    
    return {
      'private-equity': privateEquity,
      'private-debt': privateDebt,
      'digital-assets': digitalAssets,
      'real-assets': realAssets
    };
  }, '/market_data/all', {
    'private-equity': {
      id: 'private-equity',
      name: 'Private Equity',
      ytdPerformance: 12.4,
      isLoading: false
    },
    'private-debt': {
      id: 'private-debt',
      name: 'Private Debt',
      ytdPerformance: 8.7,
      isLoading: false
    },
    'digital-assets': {
      id: 'digital-assets',
      name: 'Digital Assets',
      ytdPerformance: 15.8,
      isLoading: false
    },
    'real-assets': {
      id: 'real-assets',
      name: 'Real Assets',
      ytdPerformance: 9.1,
      isLoading: false
    }
  });
};
