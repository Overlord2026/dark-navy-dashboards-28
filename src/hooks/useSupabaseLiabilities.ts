
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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

export const useSupabaseLiabilities = () => {
  const [liabilities, setLiabilities] = useState<SupabaseLiability[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Guard against auth context not being ready
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Auth context not ready yet, user will be null
    console.log('Auth context not ready, delaying liabilities fetch');
  }

  // Fetch liabilities from Supabase
  const fetchLiabilities = async () => {
    if (!user) {
      setLiabilities([]);
      setLoading(false);
      return;
    }

    try {
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

    // Set up real-time subscription for immediate updates
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
          (payload) => {
            console.log('Real-time liability change:', payload);
            // Refetch liabilities when any change occurs
            fetchLiabilities();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    liabilities,
    loading,
    getTotalLiabilities,
    refreshLiabilities: fetchLiabilities
  };
};
