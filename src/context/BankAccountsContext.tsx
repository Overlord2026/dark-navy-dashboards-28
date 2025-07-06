import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface BankAccount {
  id: string;
  user_id: string;
  name: string;
  account_type: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface BankAccountsContextType {
  accounts: BankAccount[];
  loading: boolean;
  saving: boolean;
  addAccount: (accountData: {
    name: string;
    account_type: string;
    balance: number;
  }) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;
  getFormattedTotalBalance: () => string;
  refreshAccounts: () => Promise<void>;
}

const BankAccountsContext = createContext<BankAccountsContextType | undefined>(undefined);

export function BankAccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        toast({
          title: "Error",
          description: "Failed to load bank accounts",
          variant: "destructive"
        });
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load bank accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (accountData: {
    name: string;
    account_type: string;
    balance: number;
  }) => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add an account",
          variant: "destructive"
        });
        return false;
      }

      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          name: accountData.name,
          account_type: accountData.account_type,
          balance: accountData.balance
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding bank account:', error);
        toast({
          title: "Error",
          description: "Failed to add bank account",
          variant: "destructive"
        });
        return false;
      }

      setAccounts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: `${accountData.name} has been added successfully`
      });
      return true;
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Error",
        description: "Failed to add bank account",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bank account:', error);
        toast({
          title: "Error",
          description: "Failed to delete bank account",
          variant: "destructive"
        });
        return false;
      }

      setAccounts(prev => prev.filter(account => account.id !== id));
      toast({
        title: "Success",
        description: "Bank account deleted successfully"
      });
      return true;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Error",
        description: "Failed to delete bank account",
        variant: "destructive"
      });
      return false;
    }
  };

  const getFormattedTotalBalance = () => {
    const total = accounts.reduce((sum, account) => sum + account.balance, 0);
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

  return (
    <BankAccountsContext.Provider
      value={{
        accounts,
        loading,
        saving,
        addAccount,
        deleteAccount,
        getFormattedTotalBalance,
        refreshAccounts: fetchAccounts
      }}
    >
      {children}
    </BankAccountsContext.Provider>
  );
}

export function useBankAccounts() {
  const context = useContext(BankAccountsContext);
  if (context === undefined) {
    throw new Error('useBankAccounts must be used within a BankAccountsProvider');
  }
  return context;
}