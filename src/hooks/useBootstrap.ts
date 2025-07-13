import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface BootstrapData {
  profile: any | null;
  assets: any[];
  liabilities: any[];
  bankAccounts: any[];
  properties: any[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_PREFIX = 'bootstrap_cache_';

export const useBootstrap = () => {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Cache utilities
  const getCacheKey = (userId: string) => `${CACHE_KEY_PREFIX}${userId}`;
  
  const getCachedData = (userId: string): BootstrapData | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(userId));
      if (!cached) return null;
      
      const { data: cachedData, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(getCacheKey(userId));
        return null;
      }
      
      return cachedData;
    } catch {
      return null;
    }
  };

  const setCachedData = (userId: string, data: BootstrapData) => {
    try {
      localStorage.setItem(getCacheKey(userId), JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache bootstrap data:', error);
    }
  };

  // Single optimized data fetch
  const loadBootstrapData = async (userId: string): Promise<BootstrapData> => {
    // Check cache first
    const cachedData = getCachedData(userId);
    if (cachedData) {
      console.log('Using cached bootstrap data');
      return cachedData;
    }

    console.log('Loading fresh bootstrap data for user:', userId);

    // Parallel data fetching
    const [
      profileResult,
      assetsResult,
      liabilitiesResult,
      bankAccountsResult,
      propertiesResult
    ] = await Promise.allSettled([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_assets').select('*').eq('user_id', userId),
      supabase.from('user_liabilities').select('*').eq('user_id', userId),
      supabase.from('bank_accounts').select('*').eq('user_id', userId),
      supabase.from('properties').select('*').eq('user_id', userId)
    ]);

    // Extract data with error handling
    const profile = profileResult.status === 'fulfilled' && !profileResult.value.error 
      ? profileResult.value.data 
      : null;
    
    const assets = assetsResult.status === 'fulfilled' && !assetsResult.value.error 
      ? assetsResult.value.data || [] 
      : [];
    
    const liabilities = liabilitiesResult.status === 'fulfilled' && !liabilitiesResult.value.error 
      ? liabilitiesResult.value.data || [] 
      : [];
    
    const bankAccounts = bankAccountsResult.status === 'fulfilled' && !bankAccountsResult.value.error 
      ? bankAccountsResult.value.data || [] 
      : [];
    
    const properties = propertiesResult.status === 'fulfilled' && !propertiesResult.value.error 
      ? propertiesResult.value.data || [] 
      : [];

    // Calculate financial metrics
    const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + Number(liability.current_balance || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    const bootstrapData: BootstrapData = {
      profile,
      assets,
      liabilities,
      bankAccounts,
      properties,
      totalAssets,
      totalLiabilities,
      netWorth
    };

    // Cache the data
    setCachedData(userId, bootstrapData);

    return bootstrapData;
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!isAuthenticated || !user?.id) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const bootstrapData = await loadBootstrapData(user.id);
        setData(bootstrapData);
      } catch (err) {
        console.error('Bootstrap error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [user?.id, isAuthenticated]);

  // Manual refresh function
  const refresh = async () => {
    if (!user?.id) return;

    // Clear cache
    localStorage.removeItem(getCacheKey(user.id));
    
    setLoading(true);
    setError(null);

    try {
      const bootstrapData = await loadBootstrapData(user.id);
      setData(bootstrapData);
    } catch (err) {
      console.error('Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refresh
  };
};