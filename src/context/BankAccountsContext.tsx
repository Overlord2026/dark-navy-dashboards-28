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
  plaid_account_id?: string;
  plaid_item_id?: string;
  plaid_institution_id?: string;
  institution_name?: string;
  is_plaid_linked?: boolean;
  last_plaid_sync?: string;
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
  addPlaidAccounts: (publicToken: string) => Promise<boolean>;
  syncPlaidAccount: (accountId: string) => Promise<boolean>;
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
      console.log('BankAccountsContext: Starting fetchAccounts');
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('BankAccountsContext: Authentication error:', userError);
        toast({
          title: "Authentication Error",
          description: "Please log in to view your accounts",
          variant: "destructive"
        });
        return;
      }

      if (!user) {
        console.log('BankAccountsContext: No authenticated user found');
        setAccounts([]);
        return;
      }

      console.log('BankAccountsContext: Fetching accounts for user:', user.id);
      
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('BankAccountsContext: Fetch result:', { 
        userId: user.id,
        data, 
        error, 
        count: data?.length 
      });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        toast({
          title: "Database Error",
          description: `Failed to load bank accounts: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('BankAccountsContext: Successfully loaded accounts:', data?.length || 0);
      setAccounts(data || []);
    } catch (error) {
      console.error('Unexpected error fetching bank accounts:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading accounts",
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

  const addPlaidAccounts = async (publicToken: string) => {
    try {
      setSaving(true);
      console.log('BankAccountsContext: Starting addPlaidAccounts with publicToken:', publicToken?.substring(0, 20) + '...');
      
      const { data, error } = await supabase.functions.invoke('plaid-exchange-public-token', {
        body: { public_token: publicToken }
      });

      console.log('BankAccountsContext: Exchange response:', { data, error });

      if (error) {
        console.error('Error exchanging Plaid token:', error);
        const errorMessage = typeof error === 'string' 
          ? error 
          : error?.message || error?.details || "Unknown error occurred during account linking";
        
        toast({
          title: "Account Linking Failed",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      if (!data) {
        console.error('No data received from plaid-exchange-public-token');
        toast({
          title: "Error",
          description: "No response received from server during account linking",
          variant: "destructive"
        });
        return false;
      }

      if (!data.success) {
        console.error('Plaid exchange reported failure:', data);
        toast({
          title: "Account Linking Failed",
          description: data.error || "Failed to link accounts",
          variant: "destructive"
        });
        return false;
      }

      // The real-time subscription will handle adding the accounts to state
      // No need to manually update state here since real-time will pick it up
      if (data.accounts && Array.isArray(data.accounts) && data.accounts.length > 0) {
        console.log(`BankAccountsContext: Successfully linked ${data.accounts.length} accounts. Real-time will update the UI.`);
        toast({
          title: "Success!",
          description: `Successfully linked ${data.accounts.length} account${data.accounts.length === 1 ? '' : 's'}`
        });
        return true;
      } else {
        console.warn('BankAccountsContext: No accounts returned from exchange:', data);
        toast({
          title: "Warning",
          description: "Account linking completed but no accounts were found",
          variant: "destructive"
        });
        return false;
      }
      
    } catch (error) {
      console.error('Error adding Plaid accounts:', error);
      toast({
        title: "Connection Error",
        description: "Network error occurred during account linking. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const syncPlaidAccount = async (accountId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('plaid-sync-accounts', {
        body: { account_id: accountId }
      });

      if (error) {
        console.error('Error syncing Plaid account:', error);
        toast({
          title: "Error",
          description: "Failed to sync account balance",
          variant: "destructive"
        });
        return false;
      }

      // Update account in state
      if (data.account) {
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId ? data.account : acc
        ));
        toast({
          title: "Success",
          description: "Account balance synced successfully"
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing Plaid account:', error);
      toast({
        title: "Error",
        description: "Failed to sync account balance",
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

    // Set up real-time subscription for bank accounts
    const channel = supabase
      .channel('bank_accounts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bank_accounts'
        },
        (payload) => {
          console.log('BankAccountsContext: Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('BankAccountsContext: New account added via real-time');
            setAccounts(prev => [payload.new as BankAccount, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('BankAccountsContext: Account updated via real-time');
            setAccounts(prev => prev.map(acc => 
              acc.id === payload.new.id ? payload.new as BankAccount : acc
            ));
          } else if (payload.eventType === 'DELETE') {
            console.log('BankAccountsContext: Account deleted via real-time');
            setAccounts(prev => prev.filter(acc => acc.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('BankAccountsContext: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <BankAccountsContext.Provider
      value={{
        accounts,
        loading,
        saving,
        addAccount,
        addPlaidAccounts,
        syncPlaidAccount,
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