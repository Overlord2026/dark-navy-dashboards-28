import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const addHealthMetric = async (metric: Omit<HealthMetric, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_metrics')
        .insert([{ ...metric, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setMetrics(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add health metric');
      throw err;
    }
  };

  const updateHealthMetric = async (id: string, updates: Partial<HealthMetric>) => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMetrics(prev => prev.map(metric => metric.id === id ? data : metric));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update health metric');
      throw err;
    }
  };

  const deleteHealthMetric = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMetrics(prev => prev.filter(metric => metric.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete health metric');
      throw err;
    }
  };

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    addHealthMetric,
    updateHealthMetric,
    deleteHealthMetric,
    refetch: fetchHealthMetrics
  };
}