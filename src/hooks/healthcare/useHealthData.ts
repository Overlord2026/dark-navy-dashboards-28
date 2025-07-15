import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface HealthMetric {
  id: string;
  type: string;
  value: string;
  unit?: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useHealthData() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => setError(null), []);

  const fetchHealthMetrics = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch health data';
      setError(errorMessage);
      
      // Auto-retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchHealthMetrics(false);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        toast({
          title: "Error fetching health data",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [retryCount]);

  const createMetric = useCallback(async (metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      clearError();
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticMetric = {
        ...metric,
        id: tempId,
        user_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMetrics(prev => [optimisticMetric, ...prev]);

      const { data, error } = await supabase
        .from('health_metrics')
        .insert([{ ...metric, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic update with real data
      setMetrics(prev => prev.map(m => m.id === tempId ? data : m));
      
      toast({
        title: "Success",
        description: "Health metric added successfully",
      });

      return data;
    } catch (err) {
      // Revert optimistic update
      setMetrics(prev => prev.filter(m => !m.id.startsWith('temp-')));
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to add health metric';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError]);

  const updateMetric = useCallback(async (id: string, updates: Partial<HealthMetric>) => {
    try {
      clearError();
      
      // Optimistic update
      setMetrics(prev => prev.map(metric => 
        metric.id === id ? { ...metric, ...updates } : metric
      ));

      const { data, error } = await supabase
        .from('health_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update with real data
      setMetrics(prev => prev.map(metric => metric.id === id ? data : metric));
      
      toast({
        title: "Success",
        description: "Health metric updated successfully",
      });

      return data;
    } catch (err) {
      // Revert optimistic update
      await fetchHealthMetrics(false);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update health metric';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError, fetchHealthMetrics]);

  const deleteMetric = useCallback(async (id: string) => {
    // Store original metric for potential rollback
    const originalMetric = metrics.find(m => m.id === id);
    
    try {
      clearError();
      
      // Optimistic update
      setMetrics(prev => prev.filter(metric => metric.id !== id));

      const { error } = await supabase
        .from('health_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Health metric deleted successfully",
      });
    } catch (err) {
      // Revert optimistic update
      if (originalMetric) {
        setMetrics(prev => [originalMetric, ...prev].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete health metric';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [clearError, metrics]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    return fetchHealthMetrics(true);
  }, [fetchHealthMetrics]);

  useEffect(() => {
    fetchHealthMetrics();
  }, [fetchHealthMetrics]);

  return {
    metrics,
    isLoading,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
    refetch,
    clearError,
  };
}