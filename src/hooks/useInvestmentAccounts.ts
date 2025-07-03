import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface InvestmentAccount {
  id: string;
  user_id: string;
  name: string;
  account_type: 'brokerage' | 'ira' | 'roth_ira' | '529' | 'mutual_fund' | 'other';
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentAccountData {
  name: string;
  account_type: 'brokerage' | 'ira' | 'roth_ira' | '529' | 'mutual_fund' | 'other';
  balance: number;
}

export const useInvestmentAccounts = () => {
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all investment accounts for the current user
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('investment_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching investment accounts:', error);
        toast.error('Failed to fetch investment accounts');
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new investment account
  const addAccount = async (accountData: InvestmentAccountData): Promise<InvestmentAccount | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add investment accounts');
        return null;
      }

      const { data, error } = await supabase
        .from('investment_accounts')
        .insert({
          ...accountData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding investment account:', error);
        toast.error('Failed to add investment account');
        return null;
      }

      setAccounts(prev => [data, ...prev]);
      toast.success('Investment account added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete an investment account
  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('investment_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting investment account:', error);
        toast.error('Failed to delete investment account');
        return false;
      }

      setAccounts(prev => prev.filter(account => account.id !== id));
      toast.success('Investment account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total balance of all accounts
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Get formatted total balance
  const getFormattedTotalBalance = () => {
    const total = getTotalBalance();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    saving,
    addAccount,
    deleteAccount,
    getTotalBalance,
    getFormattedTotalBalance,
    refreshAccounts: fetchAccounts,
  };
};