
import { MarketData, MarketDataCache } from './types';
import { CACHE_DURATIONS } from '@/config';

const marketDataCache: Record<string, MarketDataCache> = {};

export const getCachedData = (cacheKey: string): MarketData | null => {
  if (marketDataCache[cacheKey] && 
      (Date.now() - marketDataCache[cacheKey].timestamp) < CACHE_DURATIONS.MARKET_DATA) {
    return marketDataCache[cacheKey].data;
  }
  return null;
};

export const setCachedData = (cacheKey: string, data: MarketData): void => {
  marketDataCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
};
