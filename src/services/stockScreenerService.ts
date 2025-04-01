
// Service to fetch stock data from free APIs

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

// Cache for stock data to avoid excessive API calls
const stockDataCache: Record<string, { data: StockData, timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches stock data from Alpha Vantage API
 * Using the free tier with demo API key for educational purposes
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
  
  // If not in cache or cache expired, fetch from API
  try {
    // For demo purposes we'll use Alpha Vantage's free tier with demo key
    // In production, you would use a real API key and handle rate limits properly
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${normalizedSymbol}&apikey=demo`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${normalizedSymbol}`);
    }
    
    const quoteData = await response.json();
    
    // Also fetch company overview for additional info
    const overviewResponse = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${normalizedSymbol}&apikey=demo`
    );
    
    if (!overviewResponse.ok) {
      throw new Error(`Failed to fetch overview for ${normalizedSymbol}`);
    }
    
    const overviewData = await overviewResponse.json();
    
    // Check if we have valid data from the API
    if (!quoteData['Global Quote'] || Object.keys(quoteData['Global Quote']).length === 0) {
      throw new Error(`No data found for symbol ${normalizedSymbol}`);
    }
    
    // Parse the data
    const quote = quoteData['Global Quote'];
    const price = parseFloat(quote['05. price'] || 0);
    const change = parseFloat(quote['09. change'] || 0);
    const changePercent = parseFloat((quote['10. change percent'] || '0%').replace('%', ''));
    const volume = parseInt(quote['06. volume'] || 0);
    
    // Parse the overview data
    const peRatio = overviewData.PERatio ? parseFloat(overviewData.PERatio) : null;
    const marketCap = overviewData.MarketCapitalization ? parseFloat(overviewData.MarketCapitalization) : null;
    const dividendYield = overviewData.DividendYield ? parseFloat(overviewData.DividendYield) * 100 : null;
    const week52High = overviewData['52WeekHigh'] ? parseFloat(overviewData['52WeekHigh']) : null;
    const week52Low = overviewData['52WeekLow'] ? parseFloat(overviewData['52WeekLow']) : null;
    
    // Construct the stock data object
    const stockData: StockData = {
      symbol: normalizedSymbol,
      companyName: overviewData.Name || normalizedSymbol,
      sector: overviewData.Sector || 'Unknown',
      industry: overviewData.Industry || 'Unknown',
      price,
      change,
      changePercent,
      marketCap,
      peRatio,
      dividendYield,
      volume,
      avgVolume: overviewData.AverageVolume ? parseInt(overviewData.AverageVolume) : volume,
      week52High,
      week52Low,
      isLoading: false
    };
    
    // Cache the result
    stockDataCache[cacheKey] = {
      data: stockData,
      timestamp: Date.now()
    };
    
    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    
    // Return a placeholder with error info
    return {
      symbol: normalizedSymbol,
      companyName: normalizedSymbol,
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
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
