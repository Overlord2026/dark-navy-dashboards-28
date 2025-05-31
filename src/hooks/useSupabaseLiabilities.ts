
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface SupabaseLiability {
  id: string;
  user_id: string;
  name: string;
  type: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseLiabilities = () => {
  const [liabilities, setLiabilities] = useState<SupabaseLiability[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch liabilities from Supabase
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

  // Calculate total liabilities value
  const getTotalLiabilities = () => {
    return liabilities.reduce((total, liability) => total + Number(liability.amount), 0);
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
          () => {
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
