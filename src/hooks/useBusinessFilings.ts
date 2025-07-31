
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface BusinessFiling {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  business_name: string;
  due_date: Date;
  reminder_days: number;
  filing_type: string;
  recurring: boolean;
  recurring_period?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useBusinessFilings = () => {
  const [filings, setFilings] = useState<BusinessFiling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchFilings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('business_filings')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map(filing => ({
        ...filing,
        due_date: new Date(filing.due_date)
      })) || [];

      setFilings(formattedData);
    } catch (error) {
      console.error('Error fetching business filings:', error);
      toast.error('Failed to load business filings');
    } finally {
      setIsLoading(false);
    }
  };

  const addFiling = async (filing: Omit<BusinessFiling, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_filings')
        .insert([{
          ...filing,
          user_id: user.id,
          due_date: filing.due_date.toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      const newFiling = {
        ...data,
        due_date: new Date(data.due_date)
      };

      setFilings(prev => [...prev, newFiling]);
      toast.success('Business filing added successfully!');
      return newFiling;
    } catch (error) {
      console.error('Error adding business filing:', error);
      toast.error('Failed to add business filing');
      throw error;
    }
  };

  const updateFiling = async (id: string, updates: Partial<BusinessFiling>) => {
    if (!user) return;

    try {
      const updateData = { ...updates };
      if (updateData.due_date) {
        (updateData as any).due_date = updateData.due_date.toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('business_filings')
        .update(updateData as any)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedFiling = {
        ...data,
        due_date: new Date(data.due_date)
      };

      setFilings(prev => prev.map(filing => 
        filing.id === id ? updatedFiling : filing
      ));

      toast.success('Filing updated successfully!');
      return updatedFiling;
    } catch (error) {
      console.error('Error updating business filing:', error);
      toast.error('Failed to update business filing');
      throw error;
    }
  };

  const deleteFiling = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('business_filings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFilings(prev => prev.filter(filing => filing.id !== id));
      toast.success('Filing deleted successfully');
    } catch (error) {
      console.error('Error deleting business filing:', error);
      toast.error('Failed to delete business filing');
      throw error;
    }
  };

  const toggleComplete = async (id: string) => {
    const filing = filings.find(f => f.id === id);
    if (!filing) return;

    await updateFiling(id, { completed: !filing.completed });
  };

  useEffect(() => {
    fetchFilings();
  }, [user]);

  return {
    filings,
    isLoading,
    addFiling,
    updateFiling,
    deleteFiling,
    toggleComplete,
    refreshFilings: fetchFilings
  };
};
