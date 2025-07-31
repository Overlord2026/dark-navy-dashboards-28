import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  last_four: string;
  credit_limit: number;
  current_balance: number;
  available_credit: number;
  statement_balance: number;
  minimum_payment: number;
  due_date: string | null;
  apr: number;
  is_plaid_linked: boolean;
  plaid_account_id: string | null;
  plaid_item_id: string | null;
  rewards_program: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CreditCardFormData {
  name: string;
  issuer: string;
  last_four: string;
  credit_limit: number;
  current_balance: number;
  statement_balance: number;
  minimum_payment: number;
  due_date: string | null;
  apr: number;
  rewards_program: string | null;
  notes: string | null;
}

interface CreditCardsContextType {
  creditCards: CreditCard[];
  loading: boolean;
  error: string | null;
  addCreditCard: (data: CreditCardFormData) => Promise<void>;
  updateCreditCard: (id: string, data: Partial<CreditCardFormData>) => Promise<void>;
  deleteCreditCard: (id: string) => Promise<void>;
  refreshCreditCards: () => Promise<void>;
  getFormattedTotalBalance: () => string;
}

const CreditCardsContext = createContext<CreditCardsContextType | undefined>(undefined);

export const useCreditCards = () => {
  const context = useContext(CreditCardsContext);
  if (!context) {
    throw new Error('useCreditCards must be used within a CreditCardsProvider');
  }
  return context;
};

export const CreditCardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCreditCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCreditCards(data || []);
    } catch (err) {
      console.error('Error fetching credit cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch credit cards');
    } finally {
      setLoading(false);
    }
  };

  const addCreditCard = async (data: CreditCardFormData) => {
    try {
    const { data: newCard, error } = await supabase
        .from('credit_cards')
        .insert([{ ...data, user_id: 'temp-user-id' }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCreditCards(prev => [newCard, ...prev]);
      toast({
        title: "Credit card added",
        description: `${data.name} has been added to your accounts.`,
      });
    } catch (err) {
      console.error('Error adding credit card:', err);
      throw err;
    }
  };

  const updateCreditCard = async (id: string, data: Partial<CreditCardFormData>) => {
    try {
      const { data: updatedCard, error } = await supabase
        .from('credit_cards')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCreditCards(prev => 
        prev.map(card => card.id === id ? updatedCard : card)
      );
      
      toast({
        title: "Credit card updated",
        description: "Your credit card has been updated successfully.",
      });
    } catch (err) {
      console.error('Error updating credit card:', err);
      throw err;
    }
  };

  const deleteCreditCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCreditCards(prev => prev.filter(card => card.id !== id));
      toast({
        title: "Credit card deleted",
        description: "Your credit card has been removed from your accounts.",
      });
    } catch (err) {
      console.error('Error deleting credit card:', err);
      throw err;
    }
  };

  const refreshCreditCards = async () => {
    await fetchCreditCards();
  };

  const getFormattedTotalBalance = () => {
    const total = creditCards.reduce((sum, card) => sum + card.current_balance, 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const value = {
    creditCards,
    loading,
    error,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    refreshCreditCards,
    getFormattedTotalBalance,
  };

  return (
    <CreditCardsContext.Provider value={value}>
      {children}
    </CreditCardsContext.Provider>
  );
};