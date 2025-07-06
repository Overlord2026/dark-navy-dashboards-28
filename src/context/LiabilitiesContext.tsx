import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Liability {
  id: string;
  user_id: string;
  name: string;
  type: string;
  current_balance: number;
  original_loan_amount?: number;
  start_date?: string;
  end_date?: string;
  monthly_payment?: number;
  interest_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface LiabilityData {
  name: string;
  type: string;
  current_balance: number;
  original_loan_amount?: number;
  start_date?: string;
  end_date?: string;
  monthly_payment?: number;
  interest_rate?: number;
}

interface LiabilitiesContextType {
  liabilities: Liability[];
  loading: boolean;
  saving: boolean;
  addLiability: (liabilityData: LiabilityData) => Promise<Liability | null>;
  updateLiability: (id: string, updates: Partial<LiabilityData>) => Promise<Liability | null>;
  deleteLiability: (id: string) => Promise<boolean>;
  getTotalLiabilities: () => number;
  getFormattedTotalLiabilities: () => string;
  refreshLiabilities: () => Promise<void>;
}

const LiabilitiesContext = createContext<LiabilitiesContextType | undefined>(undefined);

export function LiabilitiesProvider({ children }: { children: React.ReactNode }) {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all liabilities for the current user
  const fetchLiabilities = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('user_liabilities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching liabilities:', error);
        toast.error('Failed to fetch liabilities');
        return;
      }

      setLiabilities(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new liability
  const addLiability = async (liabilityData: LiabilityData): Promise<Liability | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add liabilities');
        return null;
      }

      const { data, error } = await supabase
        .from('user_liabilities')
        .insert({
          ...liabilityData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding liability:', error);
        toast.error('Failed to add liability');
        return null;
      }

      setLiabilities(prev => [data, ...prev]);
      toast.success('Liability added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Update a liability
  const updateLiability = async (id: string, updates: Partial<LiabilityData>): Promise<Liability | null> => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('user_liabilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating liability:', error);
        toast.error('Failed to update liability');
        return null;
      }

      setLiabilities(prev => prev.map(liability => liability.id === id ? data : liability));
      toast.success('Liability updated successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a liability
  const deleteLiability = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_liabilities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting liability:', error);
        toast.error('Failed to delete liability');
        return false;
      }

      setLiabilities(prev => prev.filter(liability => liability.id !== id));
      toast.success('Liability deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total liabilities
  const getTotalLiabilities = () => {
    return liabilities.reduce((total, liability) => total + liability.current_balance, 0);
  };

  // Get formatted total liabilities
  const getFormattedTotalLiabilities = () => {
    const total = getTotalLiabilities();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchLiabilities();
  }, []);

  return (
    <LiabilitiesContext.Provider
      value={{
        liabilities,
        loading,
        saving,
        addLiability,
        updateLiability,
        deleteLiability,
        getTotalLiabilities,
        getFormattedTotalLiabilities,
        refreshLiabilities: fetchLiabilities,
      }}
    >
      {children}
    </LiabilitiesContext.Provider>
  );
}

export function useLiabilities() {
  const context = useContext(LiabilitiesContext);
  if (context === undefined) {
    throw new Error('useLiabilities must be used within a LiabilitiesProvider');
  }
  return context;
}