import { useMemo, useCallback } from "react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: 'pending' | 'paid' | 'overdue' | 'scheduled';
  isAutoPay: boolean;
}

export interface BillTransaction {
  id: string;
  billId: string;
  billName: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
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

// Mock data - replace with actual API calls
const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Electric Bill',
    amount: 150.00,
    dueDate: new Date('2024-01-15'),
    category: 'utilities',
    status: 'pending',
    isAutoPay: true
  },
  {
    id: '2',
    name: 'Internet Service',
    amount: 79.99,
    dueDate: new Date('2024-01-20'),
    category: 'utilities',
    status: 'scheduled',
    isAutoPay: true
  },
  {
    id: '3',
    name: 'Credit Card Payment',
    amount: 250.00,
    dueDate: new Date('2024-01-25'),
    category: 'credit',
    status: 'pending',
    isAutoPay: false
  }
];

const mockTransactions: BillTransaction[] = [
  {
    id: '1',
    billId: '1',
    billName: 'Electric Bill',
    amount: 150.00,
    date: new Date('2024-01-01'),
    status: 'completed',
    paymentMethod: 'Auto Pay'
  },
  {
    id: '2',
    billId: '2',
    billName: 'Internet Service',
    amount: 79.99,
    date: new Date('2024-01-05'),
    status: 'completed',
    paymentMethod: 'Auto Pay'
  }
];

export const useBillPayData = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();

  // Memoized calculations
  const bills = useMemo(() => mockBills, []);
  const transactions = useMemo(() => mockTransactions, []);

  const analytics = useMemo((): BillAnalytics => {
    const monthlyTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
    const activeBills = bills.filter(bill => bill.status !== 'paid').length;
    const automatedPayments = bills.filter(bill => bill.isAutoPay).length;
    const potentialSavings = bills
      .filter(bill => !bill.isAutoPay)
      .reduce((sum, bill) => sum + (bill.amount * 0.02), 0); // 2% potential savings

    const paymentHistory = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2023, i).toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.random() * 500 + 200
    }));

    return {
      monthlyTotal,
      activeBills,
      automatedPayments,
      potentialSavings,
      paymentHistory
    };
  }, [bills]);

  const upcomingBills = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return bills
      .filter(bill => bill.dueDate <= nextWeek && bill.status !== 'paid')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [bills]);

  const overdueBills = useMemo(() => {
    const now = new Date();
    return bills.filter(bill => bill.dueDate < now && bill.status !== 'paid');
  }, [bills]);

  // Callback functions
  const addBill = useCallback((billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString()
    };
    // In real app: make API call to add bill
    console.info('Adding bill:', newBill);
    return newBill;
  }, []);

  const updateBill = useCallback((billId: string, updates: Partial<Bill>) => {
    // In real app: make API call to update bill
    console.info('Updating bill:', billId, updates);
  }, []);

  const deleteBill = useCallback((billId: string) => {
    // In real app: make API call to delete bill
    console.info('Deleting bill:', billId);
  }, []);

  const payBill = useCallback((billId: string, paymentMethod: string) => {
    // In real app: process payment and update bill status
    console.info('Paying bill:', billId, 'with', paymentMethod);
  }, []);

  const toggleAutoPay = useCallback((billId: string, enabled: boolean) => {
    // In real app: update autopay settings
    console.info('Toggle autopay for bill:', billId, 'enabled:', enabled);
  }, []);

  const getBillsByCategory = useCallback((category: string) => {
    return bills.filter(bill => bill.category === category);
  }, [bills]);

  const searchBills = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return bills.filter(bill => 
      bill.name.toLowerCase().includes(lowercaseQuery) ||
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
    
    // Feature flags
    hasAutomatedPayments,
    hasAdvancedAnalytics,
    
    // Loading states (for real API integration)
    isLoading: false,
    error: null
  };
};