import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: Date | null;
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
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view your accounts",
          variant: "destructive"
        });
        return;
      }

      if (!user) {
        setAccounts([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Database Error",
          description: `Failed to load bank accounts: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading accounts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addAccount = useCallback(async (accountData: {
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
      toast({
        title: "Error",
        description: "Failed to add bank account",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [toast]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) {
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
      toast({
        title: "Error",
        description: "Failed to delete bank account",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const addPlaidAccounts = useCallback(async (publicToken: string) => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase.functions.invoke('plaid-exchange-public-token', {
        body: { public_token: publicToken }
      });

      if (error) {
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
        toast({
          title: "Error",
          description: "No response received from server during account linking",
          variant: "destructive"
        });
        return false;
      }

      if (!data.success) {
        const errorMessage = data.error || "Failed to link accounts";
        
        // Show more specific error messages for common issues
        if (errorMessage.includes('already linked')) {
          toast({
            title: "Accounts Already Linked",
            description: "These accounts are already connected. Refreshing your account list.",
          });
          // Still refresh accounts to show existing ones
          await fetchAccounts();
          return true;
        } else {
          toast({
            title: "Account Linking Failed",
            description: errorMessage,
            variant: "destructive"
          });
          return false;
        }
      }

      // Try to refresh accounts manually in case real-time doesn't work immediately
      await fetchAccounts();
      
      if (data.accounts && Array.isArray(data.accounts) && data.accounts.length > 0) {
        toast({
          title: "Success!",
          description: `Successfully linked ${data.accounts.length} account${data.accounts.length === 1 ? '' : 's'}`
        });
        return true;
      } else {
        toast({
          title: "Warning",
          description: "Account linking completed but no accounts were found",
          variant: "destructive"
        });
        return false;
      }
      
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Network error occurred during account linking. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [fetchAccounts, toast]);

  const syncPlaidAccount = useCallback(async (accountId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('plaid-sync-accounts', {
        body: { account_id: accountId }
      });

      if (error) {
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
      toast({
        title: "Error",
        description: "Failed to sync account balance",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const getFormattedTotalBalance = useCallback(() => {
    const total = accounts.reduce((sum, account) => sum + account.balance, 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  }, [accounts]);

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
          setSyncStatus('syncing');
          
          if (payload.eventType === 'INSERT') {
            setAccounts(prev => [payload.new as BankAccount, ...prev]);
            toast({
              title: "Account Added",
              description: `New account "${payload.new.name}" has been added.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setAccounts(prev => prev.map(acc => 
              acc.id === payload.new.id ? payload.new as BankAccount : acc
            ));
            toast({
              title: "Account Updated",
              description: `Account "${payload.new.name}" has been updated.`,
            });
          } else if (payload.eventType === 'DELETE') {
            setAccounts(prev => prev.filter(acc => acc.id !== payload.old.id));
            toast({
              title: "Account Deleted",
              description: `Account has been removed.`,
            });
          }
          
          setSyncStatus('idle');
          setLastSyncTime(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAccounts]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    accounts,
    loading,
    saving,
    syncStatus,
    lastSyncTime,
    addAccount,
    addPlaidAccounts,
    syncPlaidAccount,
    deleteAccount,
    getFormattedTotalBalance,
    refreshAccounts: fetchAccounts
  }), [
    accounts,
    loading,
    saving,
    syncStatus,
    lastSyncTime,
    addAccount,
    addPlaidAccounts,
    syncPlaidAccount,
    deleteAccount,
    getFormattedTotalBalance,
    fetchAccounts
  ]);

  return (
    <BankAccountsContext.Provider value={contextValue}>
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