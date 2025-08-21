import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export function useRetryFetch<T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0
  });

  const executeWithRetry = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fetchFn();
        setState({
          data: result,
          loading: false,
          error: null,
          retryCount: attempt
        });
        return result;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        
        if (isLastAttempt) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            retryCount: attempt
          }));
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );

        // Add jitter to prevent thundering herd
        const jitteredDelay = delay + Math.random() * 1000;
        
        await new Promise(resolve => setTimeout(resolve, jitteredDelay));
        
        setState(prev => ({ ...prev, retryCount: attempt + 1 }));
      }
    }
  }, [fetchFn, maxRetries, initialDelay, maxDelay, backoffMultiplier]);

  const retry = useCallback(() => {
    executeWithRetry().catch(() => {
      // Error already handled in executeWithRetry
    });
  }, [executeWithRetry]);

  return {
    ...state,
    execute: executeWithRetry,
    retry
  };
}