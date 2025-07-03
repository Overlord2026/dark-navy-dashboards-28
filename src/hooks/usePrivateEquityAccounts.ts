
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface PrivateEquityAccount {
  id: string;
  user_id: string;
  entity_name: string;
  valuation: number;
  ownership_percentage?: number;
  entity_type: string;
  created_at: string;
  updated_at: string;
}

export interface PrivateEquityAccountData {
  entity_name: string;
  valuation: number;
  ownership_percentage?: number;
  entity_type: string;
}

export const usePrivateEquityAccounts = () => {
  const [accounts, setAccounts] = useState<PrivateEquityAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all private equity accounts for the current user
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('private_equity_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching private equity accounts:', error);
        toast.error('Failed to fetch private equity accounts');
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

  // Add a new private equity account
  const addAccount = async (accountData: PrivateEquityAccountData): Promise<PrivateEquityAccount | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add private equity accounts');
        return null;
      }

      const { data, error } = await supabase
        .from('private_equity_accounts')
        .insert({
          ...accountData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding private equity account:', error);
        toast.error('Failed to add private equity account');
        return null;
      }

      setAccounts(prev => [data, ...prev]);
      toast.success('Private equity account added successfully');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a private equity account
  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('private_equity_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting private equity account:', error);
        toast.error('Failed to delete private equity account');
        return false;
      }

      setAccounts(prev => prev.filter(account => account.id !== id));
      toast.success('Private equity account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total valuation of all accounts
  const getTotalValuation = () => {
    return accounts.reduce((total, account) => total + account.valuation, 0);
  };

  // Get formatted total valuation
  const getFormattedTotalValuation = () => {
    const total = getTotalValuation();
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
    getTotalValuation,
    getFormattedTotalValuation,
    refreshAccounts: fetchAccounts,
  };
};
