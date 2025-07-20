
import { useState, useCallback } from 'react';
import { edgeFunctionClient, EdgeFunctionResponse } from '@/services/edgeFunction/EdgeFunctionClient';

export interface UseEdgeFunctionResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  correlationId: string | null;
  invoke: (payload?: any) => Promise<EdgeFunctionResponse<T>>;
  reset: () => void;
}

export function useEdgeFunction<T = any>(functionName: string): UseEdgeFunctionResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correlationId, setCorrelationId] = useState<string | null>(null);

  const invoke = useCallback(async (payload?: any): Promise<EdgeFunctionResponse<T>> => {
    setLoading(true);
    setError(null);
    setCorrelationId(null);

    const response = await edgeFunctionClient.invoke<T>(functionName, payload);

    if (response.success) {
      setData(response.data || null);
    } else {
      setError(response.error?.userMessage || 'An error occurred');
      setCorrelationId(response.error?.correlationId || null);
    }

    setLoading(false);
    return response;
  }, [functionName]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setCorrelationId(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    correlationId,
    invoke,
    reset
  };
}
