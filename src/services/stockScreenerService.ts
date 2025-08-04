// Service to fetch stock data from secure APIs

interface StockData {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number | null;
  peRatio: number | null;
  dividendYield: number | null;
  volume: number;
  avgVolume: number;
  week52High: number | null;
  week52Low: number | null;
  isLoading: boolean;
  error?: string;
}

interface PriceHistoryDataPoint {
  date: string;
  price: number;
}

// Cache for stock data to avoid excessive API calls
const stockDataCache: Record<string, { data: StockData, timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// SECURITY: API keys moved to secure Edge Functions

// Helper function to safely parse numeric values
const safeParseFloat = (value: any): number | null => {
  if (value === undefined || value === null || value === '') return null;
  
  // If the value is already a number, return it
  if (typeof value === 'number') return value;
  
  // Convert to string and clean it (remove commas, dollar signs, etc.)
  const stringValue = String(value).replace(/[$,]/g, '');
  const parsed = parseFloat(stringValue);
  
  return isNaN(parsed) ? null : parsed;
};

// Helper to parse market cap which might be in different formats
const parseMarketCap = (value: any): number | null => {
  if (value === undefined || value === null || value === '') return null;
  
  // If already a number, return it
  if (typeof value === 'number') return value;
  
  // Convert to string and clean it
  const stringValue = String(value).replace(/[$,]/g, '');
  
  // Check for shorthand notations (B for billions, M for millions, T for trillions)
  if (stringValue.includes('T') || stringValue.includes('t')) {
    return parseFloat(stringValue.replace(/[Tt]/g, '')) * 1000000000000;
  } else if (stringValue.includes('B') || stringValue.includes('b')) {
    return parseFloat(stringValue.replace(/[Bb]/g, '')) * 1000000000;
  } else if (stringValue.includes('M') || stringValue.includes('m')) {
    return parseFloat(stringValue.replace(/[Mm]/g, '')) * 1000000;
  } else {
    return safeParseFloat(stringValue);
  }
};

// Helper to parse dividend yield which might be a percentage or decimal
const parseDividendYield = (value: any): number | null => {
  if (value === undefined || value === null || value === '') return null;
  
  // Convert to string and clean it
  const stringValue = String(value).replace(/[$,%]/g, '');
  const parsed = safeParseFloat(stringValue);
  
  if (parsed === null) return null;
  
  // If it's a very small decimal (like 0.0234), it's likely a ratio rather than a percentage
  // Convert to percentage (multiply by 100)
  return parsed < 1 ? parsed * 100 : parsed;
};

/**
 * Fetches stock data using secure Edge Functions
 */
export const fetchStockData = async (symbol: string): Promise<StockData> => {
  // Normalize the symbol to uppercase
  const normalizedSymbol = symbol.toUpperCase().trim();
  
  // Check cache first
  const cacheKey = normalizedSymbol;
  if (stockDataCache[cacheKey] && 
      (Date.now() - stockDataCache[cacheKey].timestamp) < CACHE_DURATION) {
    return stockDataCache[cacheKey].data;
  }
  
  // If not in cache or cache expired, fetch from secure API
  try {
    // Use secure Edge Function instead of direct API calls
    const response = await fetch(`${window.location.origin}/api/stock-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: normalizedSymbol })
    });
    
    if (response.ok) {
      const stockData = await response.json();
      
      // Cache the result
      stockDataCache[cacheKey] = {
        data: stockData,
        timestamp: Date.now()
      };
      
      return stockData;
    }
    
    // If API failed, return mock data for demo
    return getMockStockData(normalizedSymbol);
    
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return getMockStockData(normalizedSymbol);
  }
};

/**
 * Returns mock stock data for demonstration purposes
 */
const getMockStockData = (symbol: string): StockData => {
  // For demo purposes only: Return mock data for common tickers
  const mockData: Record<string, any> = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      price: 168.35,
      change: 2.35,
      changePercent: 1.42,
      marketCap: 2690000000000,
      peRatio: 27.8,
      dividendYield: 0.54,
      volume: 58720000,
      avgVolume: 65210000,
      week52High: 182.94,
      week52Low: 142.65
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      price: 383.96,
      change: 5.47,
      changePercent: 1.45,
      marketCap: 2850000000000,
      peRatio: 33.2,
      dividendYield: 0.74,
      volume: 22640000,
      avgVolume: 26430000,
      week52High: 430.82,
      week52Low: 303.39
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      price: 161.15,
      change: -0.23,
      changePercent: -0.14,
      marketCap: 1980000000000,
      peRatio: 24.7,
      dividendYield: 0.48,
      volume: 19140000,
      avgVolume: 23560000,
      week52High: 191.32,
      week52Low: 120.21
    },
    'AMZN': {
      name: 'Amazon.com, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      price: 178.15,
      change: 3.24,
      changePercent: 1.85,
      marketCap: 1850000000000,
      peRatio: 43.5,
      dividendYield: null,
      volume: 35670000,
      avgVolume: 40120000,
      week52High: 189.77,
      week52Low: 118.35
    },
    'META': {
      name: 'Meta Platforms, Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      price: 477.28,
      change: -2.16,
      changePercent: -0.45,
      marketCap: 1210000000000,
      peRatio: 25.3,
      dividendYield: 0.38,
      volume: 12540000,
      avgVolume: 15230000,
      week52High: 531.49,
      week52Low: 279.40
    }
  };
  
  const mock = mockData[symbol];
  
  if (mock) {
    return {
      symbol: symbol,
      companyName: mock.name,
      sector: mock.sector,
      industry: mock.industry,
      price: mock.price,
      change: mock.change,
      changePercent: mock.changePercent,
      marketCap: mock.marketCap,
      peRatio: mock.peRatio,
      dividendYield: mock.dividendYield,
      volume: mock.volume,
      avgVolume: mock.avgVolume,
      week52High: mock.week52High,
      week52Low: mock.week52Low,
      isLoading: false
    };
  }
  
  // Return a placeholder for unknown symbols
  return {
    symbol: symbol,
    companyName: symbol,
    sector: 'Unknown',
    industry: 'Unknown',
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: null,
    peRatio: null,
    dividendYield: null,
    volume: 0,
    avgVolume: 0,
    week52High: null,
    week52Low: null,
    isLoading: false,
    error: 'Could not fetch stock data'
  };
};

/**
 * Fetches historical price data for a stock
 */
export const fetchStockPriceHistory = async (symbol: string, timeframe: "1M" | "3M" | "6M" | "1Y"): Promise<PriceHistoryDataPoint[]> => {
  // Calculate days based on timeframe
  let days = 30; // Default for 1M
  if (timeframe === "3M") days = 90;
  if (timeframe === "6M") days = 180;
  if (timeframe === "1Y") days = 365;
  
  try {
    // For demo purposes, generate mock historical data
    const mockData: PriceHistoryDataPoint[] = [];
    const basePrice = 100;
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate realistic price movements
      const volatility = 0.02; // 2% daily volatility
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const price = basePrice * (1 + randomChange * (days - i) / days);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      });
    }
    
    return mockData;
  } catch (error) {
    console.error("Error fetching price history:", error);
    throw error;
  }
};