import { useState, useEffect, useCallback } from 'react';

interface UseRetryFetchOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface UseRetryFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  retryCount: number;
}

export function useRetryFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseRetryFetchOptions = {}
): UseRetryFetchResult<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, [baseDelay, backoffFactor, maxDelay]);

  const executeWithRetry = useCallback(async (attempt = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      setData(result);
      setRetryCount(attempt);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt);
        console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
        
        setTimeout(() => {
          executeWithRetry(attempt + 1);
        }, delay);
      } else {
        console.error(`Fetch failed after ${maxRetries + 1} attempts:`, error);
        setError(error);
        setRetryCount(attempt);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, maxRetries, calculateDelay]);

  const retry = useCallback(() => {
    setRetryCount(0);
    executeWithRetry(0);
  }, [executeWithRetry]);

  useEffect(() => {
    executeWithRetry(0);
  }, deps);

  return {
    data,
    loading,
    error,
    retry,
    retryCount,
  };
}