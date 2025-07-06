import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SupabaseLiability {
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

interface LiabilitiesContextType {
  liabilities: SupabaseLiability[];
  loading: boolean;
  getTotalLiabilities: () => number;
  refreshLiabilities: () => Promise<void>;
}

const LiabilitiesContext = createContext<LiabilitiesContextType | undefined>(undefined);

export function LiabilitiesProvider({ children }: { children: React.ReactNode }) {
  const [liabilities, setLiabilities] = useState<SupabaseLiability[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch liabilities from Supabase
  const fetchLiabilities = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        setLiabilities([]);
        return;
      }

      console.log('Fetching liabilities for user:', user.id);
      const { data, error } = await supabase
        .from('user_liabilities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching liabilities:', error);
        toast.error('Failed to load liabilities');
        return;
      }

      console.log('Fetched liabilities:', data);
      setLiabilities(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load liabilities');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total liabilities value
  const getTotalLiabilities = () => {
    return liabilities.reduce((total, liability) => total + Number(liability.current_balance), 0);
  };

  useEffect(() => {
    fetchLiabilities();
  }, []);

  return (
    <LiabilitiesContext.Provider
      value={{
        liabilities,
        loading,
        getTotalLiabilities,
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