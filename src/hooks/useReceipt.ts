import { useState, useEffect } from 'react';
import { getLatestDecisionRDS, getDecisionRDSHistory, type DecisionRDS } from '@/services/decisions';

/**
 * Hook to fetch the latest receipt for a subject
 */
export function useLatestReceipt(subjectId: string, action?: string) {
  const [receipt, setReceipt] = useState<DecisionRDS | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const fetchReceipt = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const latestReceipt = await getLatestDecisionRDS(subjectId, action);
        setReceipt(latestReceipt);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch receipt');
        console.error('Error in useLatestReceipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [subjectId, action]);

  const refetch = async () => {
    if (!subjectId) return;
    
    setLoading(true);
    try {
      const latestReceipt = await getLatestDecisionRDS(subjectId, action);
      setReceipt(latestReceipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch receipt');
    } finally {
      setLoading(false);
    }
  };

  return {
    receipt,
    loading,
    error,
    refetch
  };
}

/**
 * Hook to fetch receipt history for a subject
 */
export function useReceiptHistory(subjectId: string, limit: number = 10) {
  const [receipts, setReceipts] = useState<DecisionRDS[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const history = await getDecisionRDSHistory(subjectId, limit);
        setReceipts(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch receipt history');
        console.error('Error in useReceiptHistory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [subjectId, limit]);

  const refetch = async () => {
    if (!subjectId) return;
    
    setLoading(true);
    try {
      const history = await getDecisionRDSHistory(subjectId, limit);
      setReceipts(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch receipt history');
    } finally {
      setLoading(false);
    }
  };

  return {
    receipts,
    loading,
    error,
    refetch
  };
}

/**
 * Hook to save a new receipt and update state
 */
export function useReceiptSaver() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveReceipt = async (input: Parameters<typeof import('@/services/decisions').saveDecisionRDS>[0]) => {
    setSaving(true);
    setError(null);
    
    try {
      const { saveDecisionRDS } = await import('@/services/decisions');
      const receipt = await saveDecisionRDS(input);
      return receipt;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save receipt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    saveReceipt,
    saving,
    error
  };
}