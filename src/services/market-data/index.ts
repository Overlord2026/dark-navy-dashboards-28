
import { MarketData, PriceHistoryDataPoint } from './types';
import { 
  getPrivateEquityData, 
  getPrivateDebtData, 
  getDigitalAssetsData, 
  getRealAssetsData 
} from './assetCategories';
import { fetchAlphaVantageData } from './apiUtils';

export * from './types';

export const getAllInvestmentCategoryData = async (): Promise<Record<string, MarketData>> => {
  try {
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
  } catch (error) {
    console.error('Error fetching all investment category data:', error);
    return {
      'private-equity': {
        id: 'private-equity',
        name: 'Private Equity',
        ytdPerformance: 12.4,
        isLoading: false,
        error: 'Failed to fetch data'
      },
      'private-debt': {
        id: 'private-debt',
        name: 'Private Debt',
        ytdPerformance: 8.7,
        isLoading: false,
        error: 'Failed to fetch data'
      },
      'digital-assets': {
        id: 'digital-assets',
        name: 'Digital Assets',
        ytdPerformance: 15.8,
        isLoading: false,
        error: 'Failed to fetch data'
      },
      'real-assets': {
        id: 'real-assets',
        name: 'Real Assets',
        ytdPerformance: 9.1,
        isLoading: false,
        error: 'Failed to fetch data'
      }
    };
  }
};

export const fetchStockPriceHistory = async (symbol: string, timeframe: "1M" | "3M" | "6M" | "1Y"): Promise<PriceHistoryDataPoint[]> => {
  let days = 30;
  if (timeframe === "3M") days = 90;
  if (timeframe === "6M") days = 180;
  if (timeframe === "1Y") days = 365;
  
  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=${days}&apikey=${API_KEYS.ALPHA_VANTAGE}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price history from TwelveData for ${symbol}`);
    }
    
    const data = await response.json();
    
    if (data.status === "error" || data.code) {
      throw new Error(data.message || `Failed to fetch price history for ${symbol}`);
    }
    
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error(`Invalid response format from TwelveData for ${symbol}`);
    }
    
    return data.values
      .slice(0, days)
      .map((item: any) => ({
        date: item.datetime,
        price: parseFloat(item.close)
      }))
      .reverse();
  } catch (error) {
    console.error("Error fetching price history:", error);
    throw error;
  }
};
