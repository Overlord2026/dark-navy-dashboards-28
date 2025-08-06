import { useMemo, useCallback, useEffect, useState } from "react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Bill {
  id: string;
  user_id: string;
  vendor_id?: string | null;
  biller_name: string;
  category: 'utilities' | 'mortgage' | 'insurance' | 'tuition' | 'loans' | 'subscriptions' | 'transportation' | 'healthcare' | 'entertainment' | 'other';
  amount: number;
  due_date: string;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  status: 'unpaid' | 'paid' | 'overdue' | 'scheduled';
  payment_method?: string | null;
  is_auto_pay: boolean;
  notes?: string | null;
  reminder_days: number;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  contact_info: any;
  logo_url?: string;
  website_url?: string;
}

export interface BillTransaction {
  id: string;
  bill_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  transaction_status: 'completed' | 'pending' | 'failed';
  confirmation_number?: string;
  notes?: string;
  created_at: string;
}

export interface BillAnalytics {
  monthlyTotal: number;
  activeBills: number;
  automatedPayments: number;
  potentialSavings: number;
  paymentHistory: Array<{
    month: string;
    amount: number;
  }>;
}

// Real Supabase data fetching

export const useBillPayData = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [transactions, setTransactions] = useState<BillTransaction[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bills from Supabase
  const fetchBills = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setBills(data || []);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bills');
    }
  }, []);

  // Fetch transactions from Supabase
  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bill_transactions')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      // Type assertion for transaction_status to ensure it matches our interface
      const typedData = data?.map(t => ({
        ...t,
        transaction_status: t.transaction_status as 'completed' | 'pending' | 'failed'
      })) || [];
      setTransactions(typedData);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, []);

  // Fetch vendors from Supabase
  const fetchVendors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setVendors(data || []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBills(), fetchTransactions(), fetchVendors()]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchBills, fetchTransactions, fetchVendors]);

  const analytics = useMemo((): BillAnalytics => {
    const monthlyTotal = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);
    const activeBills = bills.filter(bill => bill.status !== 'paid').length;
    const automatedPayments = bills.filter(bill => bill.is_auto_pay).length;
    const potentialSavings = bills
      .filter(bill => !bill.is_auto_pay)
      .reduce((sum, bill) => sum + (Number(bill.amount) * 0.02), 0); // 2% potential savings

    // Calculate payment history from actual transactions
    const paymentHistory = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2023, i);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.payment_date);
        return transactionDate.getMonth() === month.getMonth() && 
               transactionDate.getFullYear() === month.getFullYear();
      });
      
      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      };
    });

    return {
      monthlyTotal,
      activeBills,
      automatedPayments,
      potentialSavings,
      paymentHistory
    };
  }, [bills, transactions]);

  const upcomingBills = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return bills
      .filter(bill => {
        const dueDate = new Date(bill.due_date);
        return dueDate <= nextWeek && bill.status !== 'paid';
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [bills]);

  const overdueBills = useMemo(() => {
    const now = new Date();
    return bills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate < now && bill.status !== 'paid';
    });
  }, [bills]);

  // Callback functions
  const addBill = useCallback(async (billData: {
    biller_name: string;
    category: Bill['category'];
    amount: number;
    due_date: string;
    frequency?: Bill['frequency'];
    payment_method?: string;
    is_auto_pay?: boolean;
    notes?: string;
    reminder_days?: number;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bills')
        .insert({
          user_id: user.user.id,
          biller_name: billData.biller_name,
          category: billData.category,
          amount: billData.amount,
          due_date: billData.due_date,
          frequency: billData.frequency || 'monthly',
          payment_method: billData.payment_method,
          is_auto_pay: billData.is_auto_pay || false,
          notes: billData.notes,
          reminder_days: billData.reminder_days || 3,
          status: 'unpaid'
        })
        .select()
        .single();

      if (error) throw error;

      setBills(prev => [...prev, data]);
      toast({
        title: "Bill Added",
        description: `${billData.biller_name} has been added successfully.`
      });
      
      return data;
    } catch (err) {
      console.error('Error adding bill:', err);
      toast({
        title: "Error",
        description: "Failed to add bill. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateBill = useCallback(async (billId: string, updates: Partial<Bill>) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update(updates)
        .eq('id', billId)
        .select()
        .single();

      if (error) throw error;

      setBills(prev => prev.map(bill => bill.id === billId ? data : bill));
      toast({
        title: "Bill Updated",
        description: "Bill has been updated successfully."
      });
    } catch (err) {
      console.error('Error updating bill:', err);
      toast({
        title: "Error",
        description: "Failed to update bill. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const deleteBill = useCallback(async (billId: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

      if (error) throw error;

      setBills(prev => prev.filter(bill => bill.id !== billId));
      toast({
        title: "Bill Deleted",
        description: "Bill has been deleted successfully."
      });
    } catch (err) {
      console.error('Error deleting bill:', err);
      toast({
        title: "Error",
        description: "Failed to delete bill. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const payBill = useCallback(async (billId: string, paymentMethod: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const bill = bills.find(b => b.id === billId);
      if (!bill) throw new Error('Bill not found');

      // Update bill status to paid
      const { error: billError } = await supabase
        .from('bills')
        .update({ status: 'paid' })
        .eq('id', billId);

      if (billError) throw billError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('bill_transactions')
        .insert([{
          bill_id: billId,
          user_id: user.user.id,
          amount: bill.amount,
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
          transaction_status: 'completed'
        }]);

      if (transactionError) throw transactionError;

      // Refresh data
      await Promise.all([fetchBills(), fetchTransactions()]);
      
      toast({
        title: "Payment Processed",
        description: `Payment for ${bill.biller_name} has been recorded.`
      });
    } catch (err) {
      console.error('Error paying bill:', err);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    }
  }, [bills, fetchBills, fetchTransactions, toast]);

  const toggleAutoPay = useCallback(async (billId: string, enabled: boolean) => {
    try {
      await updateBill(billId, { is_auto_pay: enabled });
      toast({
        title: "Auto Pay Updated",
        description: `Auto pay has been ${enabled ? 'enabled' : 'disabled'}.`
      });
    } catch (err) {
      console.error('Error toggling autopay:', err);
    }
  }, [updateBill, toast]);

  const getBillsByCategory = useCallback((category: string) => {
    return bills.filter(bill => bill.category === category);
  }, [bills]);

  const searchBills = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return bills.filter(bill => 
      bill.biller_name.toLowerCase().includes(lowercaseQuery) ||
      bill.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [bills]);

  // Feature access checks
  const hasAutomatedPayments = useMemo(() => 
    checkFeatureAccess('premium'), [checkFeatureAccess]
  );

  const hasAdvancedAnalytics = useMemo(() => 
    checkFeatureAccess('premium'), [checkFeatureAccess]
  );

  return {
    // Data
    bills,
    transactions,
    vendors,
    analytics,
    upcomingBills,
    overdueBills,
    
    // Actions
    addBill,
    updateBill,
    deleteBill,
    payBill,
    toggleAutoPay,
    getBillsByCategory,
    searchBills,
    fetchBills,
    fetchTransactions,
    fetchVendors,
    
    // Feature flags
    hasAutomatedPayments,
    hasAdvancedAnalytics,
    
    // Loading states
    isLoading,
    error
  };
};