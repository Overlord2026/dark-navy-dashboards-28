import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { edgeFunctionClient } from '@/services/edgeFunction/EdgeFunctionClient';
import { supabase } from '@/lib/supabase';

export interface Transfer {
  id: string;
  user_id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  transfer_fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'ach_debit_pending' | 'funds_held' | 'ach_credit_pending' | 'ach_credit_failed';
  description: string | null;
  reference_number: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  transfer_type?: string;
  stripe_debit_payment_intent_id?: string;
  stripe_credit_payment_intent_id?: string;
  ach_debit_status?: string;
  ach_credit_status?: string;
  funds_held_at?: string;
  estimated_completion_date?: string;
  ach_return_code?: string;
  failure_reason?: string;
}

interface TransfersContextType {
  transfers: Transfer[];
  loading: boolean;
  processing: boolean;
  createTransfer: (transferData: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => Promise<boolean>;
  createACHTransfer: (transferData: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => Promise<boolean>;
  refreshTransfers: () => Promise<void>;
  getTransferHistory: (limit?: number) => Transfer[];
}

const TransfersContext = createContext<TransfersContextType | undefined>(undefined);

export function TransfersProvider({ children }: { children: React.ReactNode }) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const fetchTransfers = async () => {
    try {
      console.log('TransfersContext: Starting fetchTransfers');
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('TransfersContext: Authentication error:', userError);
        return;
      }

      if (!user) {
        console.log('TransfersContext: No authenticated user found');
        setTransfers([]);
        return;
      }

      console.log('TransfersContext: Fetching transfers for user:', user.id);
      
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('TransfersContext: Fetch result:', { 
        userId: user.id,
        data, 
        error, 
        count: data?.length 
      });

      if (error) {
        console.error('Error fetching transfers:', error);
        toast({
          title: "Database Error",
          description: `Failed to load transfers: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('TransfersContext: Successfully loaded transfers:', data?.length || 0);
      setTransfers((data || []) as any);
    } catch (error) {
      console.error('Unexpected error fetching transfers:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading transfers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransfer = async (transferData: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => {
    setProcessing(true);
    
    const response = await edgeFunctionClient.invokeTransferFunction('process-transfer', transferData);
    
    if (response.success && response.data?.transfer) {
      setTransfers(prev => [response.data.transfer, ...prev]);
      await fetchTransfers();
      setProcessing(false);
      return true;
    }
    
    setProcessing(false);
    return false;
  };

  const createACHTransfer = async (transferData: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => {
    setProcessing(true);
    
    const response = await edgeFunctionClient.invokeTransferFunction('stripe-ach-transfer', transferData);
    
    if (response.success && response.data?.transfer) {
      setTransfers(prev => [response.data.transfer, ...prev]);
      await fetchTransfers();
      setProcessing(false);
      return true;
    }
    
    setProcessing(false);
    return false;
  };

  const getTransferHistory = (limit = 10) => {
    return transfers.slice(0, limit);
  };

  useEffect(() => {
    fetchTransfers();

    // Set up real-time subscription for transfers
    const channel = supabase
      .channel('transfers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transfers'
        },
        (payload) => {
          console.log('TransfersContext: Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('TransfersContext: New transfer added via real-time');
            setTransfers(prev => [payload.new as Transfer, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('TransfersContext: Transfer updated via real-time');
            setTransfers(prev => prev.map(transfer => 
              transfer.id === payload.new.id ? payload.new as Transfer : transfer
            ));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('TransfersContext: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <TransfersContext.Provider
      value={{
        transfers,
        loading,
        processing,
        createTransfer,
        createACHTransfer,
        refreshTransfers: fetchTransfers,
        getTransferHistory
      }}
    >
      {children}
    </TransfersContext.Provider>
  );
}

export function useTransfers() {
  const context = useContext(TransfersContext);
  if (context === undefined) {
    throw new Error('useTransfers must be used within a TransfersProvider');
  }
  return context;
}
