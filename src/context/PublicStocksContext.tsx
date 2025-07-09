import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface PublicStock {
  id: string;
  user_id: string;
  company_name: string;
  ticker_symbol: string;
  number_of_shares: number;
  price_per_share: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface PublicStockData {
  company_name: string;
  ticker_symbol: string;
  number_of_shares: number;
  price_per_share: number;
}

interface PublicStocksContextType {
  stocks: PublicStock[];
  loading: boolean;
  saving: boolean;
  addStock: (stockData: PublicStockData) => Promise<PublicStock | null>;
  deleteStock: (id: string) => Promise<boolean>;
  getTotalValue: () => number;
  getFormattedTotalValue: () => string;
  refreshStocks: () => Promise<void>;
}

const PublicStocksContext = createContext<PublicStocksContextType | undefined>(undefined);

export function PublicStocksProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<PublicStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all public stocks for the current user
  const fetchStocks = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('public_stocks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public stocks:', error);
        toast.error('Failed to fetch public stocks');
        return;
      }

      setStocks(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new public stock
  const addStock = async (stockData: PublicStockData): Promise<PublicStock | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add public stocks');
        return null;
      }
      
      const totalValue = stockData.number_of_shares * stockData.price_per_share;

      const { data, error } = await supabase
        .from('public_stocks')
        .insert({
          ...stockData,
          user_id: user.id,
          total_value: totalValue,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding public stock:', error);
        toast.error('Failed to add public stock');
        return null;
      }

      setStocks(prev => [data, ...prev]);
      toast.success('Public stock added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a public stock
  const deleteStock = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('public_stocks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting public stock:', error);
        toast.error('Failed to delete public stock');
        return false;
      }

      setStocks(prev => prev.filter(stock => stock.id !== id));
      toast.success('Public stock deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total value of all stocks
  const getTotalValue = () => {
    return stocks.reduce((total, stock) => total + stock.total_value, 0);
  };

  // Get formatted total value
  const getFormattedTotalValue = () => {
    const total = getTotalValue();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    const checkAuthAndInit = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('PublicStocksContext: User authenticated, fetching stocks...');
        await fetchStocks();
      } else {
        console.log('PublicStocksContext: No authenticated user, skipping fetch');
        setLoading(false);
      }
    };

    checkAuthAndInit();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('PublicStocksContext: Auth state changed:', event, !!session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('PublicStocksContext: User signed in, fetching stocks...');
        await fetchStocks();
      } else if (event === 'SIGNED_OUT') {
        console.log('PublicStocksContext: User signed out, clearing stocks');
        setStocks([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PublicStocksContext.Provider
      value={{
        stocks,
        loading,
        saving,
        addStock,
        deleteStock,
        getTotalValue,
        getFormattedTotalValue,
        refreshStocks: fetchStocks
      }}
    >
      {children}
    </PublicStocksContext.Provider>
  );
}

export function usePublicStocks() {
  const context = useContext(PublicStocksContext);
  if (context === undefined) {
    throw new Error('usePublicStocks must be used within a PublicStocksProvider');
  }
  return context;
}