
import { MarketData } from './types';
import { fetchAlphaVantageData } from './apiUtils';
import { getCachedData, setCachedData } from './cacheUtils';

export const getPrivateEquityData = async (): Promise<MarketData> => {
  const cacheKey = 'private-equity';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const changePercent = await fetchAlphaVantageData('SPY');
    
    const result: MarketData = {
      id: 'private-equity',
      name: 'Private Equity',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching private equity data:', error);
    return {
      id: 'private-equity',
      name: 'Private Equity',
      ytdPerformance: 12.4,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getPrivateDebtData = async (): Promise<MarketData> => {
  const cacheKey = 'private-debt';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const changePercent = await fetchAlphaVantageData('LQD');
    
    const result: MarketData = {
      id: 'private-debt',
      name: 'Private Debt',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching private debt data:', error);
    return {
      id: 'private-debt',
      name: 'Private Debt',
      ytdPerformance: 8.7,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getDigitalAssetsData = async (): Promise<MarketData> => {
  const cacheKey = 'digital-assets';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const changePercent = await fetchAlphaVantageData('GBTC');
    
    const result: MarketData = {
      id: 'digital-assets',
      name: 'Digital Assets',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching digital assets data:', error);
    return {
      id: 'digital-assets',
      name: 'Digital Assets',
      ytdPerformance: 15.8,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getRealAssetsData = async (): Promise<MarketData> => {
  const cacheKey = 'real-assets';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const changePercent = await fetchAlphaVantageData('XLRE');
    
    const result: MarketData = {
      id: 'real-assets',
      name: 'Real Assets',
      ytdPerformance: parseFloat(changePercent.toFixed(1)),
      isLoading: false
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching real assets data:', error);
    return {
      id: 'real-assets',
      name: 'Real Assets',
      ytdPerformance: 9.1,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
