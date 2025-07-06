import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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

interface LiabilitiesContextType {
  liabilities: Liability[];
  loading: boolean;
  addLiability: (liability: Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateLiability: (id: string, updates: Partial<Liability>) => Promise<boolean>;
  deleteLiability: (id: string) => Promise<boolean>;
  getTotalLiabilities: () => number;
  refreshLiabilities: () => Promise<void>;
}

const LiabilitiesContext = createContext<LiabilitiesContextType | undefined>(undefined);

export const LiabilitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLiabilities = async () => {
    if (!user) {
      setLiabilities([]);
      setLoading(false);
      return;
    }

    try {
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

      setLiabilities(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load liabilities');
    } finally {
      setLoading(false);
    }
  };

  const addLiability = async (liabilityData: Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!user) {
      toast.error('User not authenticated');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_liabilities')
        .insert([{ ...liabilityData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding liability:', error);
        toast.error('Failed to add liability');
        return false;
      }

      setLiabilities(prev => [data, ...prev]);
      toast.success('Liability added successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add liability');
      return false;
    }
  };

  const updateLiability = async (id: string, updates: Partial<Liability>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_liabilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating liability:', error);
        toast.error('Failed to update liability');
        return false;
      }

      setLiabilities(prev =>
        prev.map(liability => (liability.id === id ? data : liability))
      );
      toast.success('Liability updated successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update liability');
      return false;
    }
  };

  const deleteLiability = async (id: string): Promise<boolean> => {
    try {
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
      toast.error('Failed to delete liability');
      return false;
    }
  };

  const getTotalLiabilities = (): number => {
    return liabilities.reduce((total, liability) => total + Number(liability.current_balance), 0);
  };

  useEffect(() => {
    fetchLiabilities();

    if (user) {
      const channel = supabase
        .channel('liability-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_liabilities',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchLiabilities();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <LiabilitiesContext.Provider
      value={{
        liabilities,
        loading,
        addLiability,
        updateLiability,
        deleteLiability,
        getTotalLiabilities,
        refreshLiabilities: fetchLiabilities,
      }}
    >
      {children}
    </LiabilitiesContext.Provider>
  );
};

export const useLiabilities = () => {
  const context = useContext(LiabilitiesContext);
  if (context === undefined) {
    throw new Error('useLiabilities must be used within a LiabilitiesProvider');
  }
  return context;
};