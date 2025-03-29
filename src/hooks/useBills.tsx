
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bill, BillCategory, BillOptimizationInsight } from '@/types/bill';

interface BillsContextProps {
  bills: Bill[];
  insights: BillOptimizationInsight[];
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  removeBill: (id: string) => void;
  getBillById: (id: string) => Bill | undefined;
  getBillsByCategory: (category: BillCategory) => Bill[];
  getBillsByStatus: (status: "Paid" | "Upcoming" | "Overdue" | "Pending") => Bill[];
  getUpcomingBills: (days: number) => Bill[];
  applyInsight: (insightId: string) => void;
}

// Sample data for initial bills
const initialBills: Bill[] = [
  {
    id: 'bill-1',
    name: 'Mortgage',
    amount: 1850.00,
    dueDate: '2023-06-01',
    category: 'Housing',
    status: 'Paid',
    paymentAccount: 'Checking Account',
    recurring: true,
    recurringPeriod: 'Monthly',
    autoPay: true,
    provider: 'First National Bank',
  },
  {
    id: 'bill-2',
    name: 'Electric Bill',
    amount: 145.75,
    dueDate: '2023-06-15',
    category: 'Utilities',
    status: 'Upcoming',
    paymentAccount: 'Checking Account',
    recurring: true,
    recurringPeriod: 'Monthly',
    provider: 'City Power & Light',
  },
  {
    id: 'bill-3',
    name: 'Auto Insurance',
    amount: 210.50,
    dueDate: '2023-07-01',
    category: 'Insurance',
    status: 'Upcoming',
    paymentAccount: 'Credit Card',
    recurring: true,
    recurringPeriod: 'Monthly',
    provider: 'AllState Insurance',
  },
  {
    id: 'bill-4',
    name: 'Netflix Subscription',
    amount: 17.99,
    dueDate: '2023-06-10',
    category: 'Subscriptions',
    status: 'Upcoming',
    paymentAccount: 'Credit Card',
    recurring: true,
    recurringPeriod: 'Monthly',
    autoPay: true,
    provider: 'Netflix',
  },
  {
    id: 'bill-5',
    name: 'Home Insurance',
    amount: 1200.00,
    dueDate: '2023-08-15',
    category: 'Insurance',
    status: 'Upcoming',
    recurring: true,
    recurringPeriod: 'Annually',
    provider: 'State Farm Insurance',
  }
];

// Sample insights based on the bills data
const initialInsights: BillOptimizationInsight[] = [
  {
    id: 'insight-1',
    billId: 'bill-3',
    title: 'Auto Insurance Review',
    description: 'Your auto insurance premium is 15% higher than average. Consider shopping around for better rates.',
    potentialSavings: 420,
    actionType: 'Review',
    recommended: true,
    relevantProviders: ['Geico', 'Progressive', 'Liberty Mutual'],
  },
  {
    id: 'insight-2',
    billId: 'bill-2',
    title: 'Energy Audit Recommended',
    description: 'Your electric bill is consistently higher than similar households. An energy audit could identify savings opportunities.',
    potentialSavings: 250,
    actionType: 'Switch Provider',
    recommended: true,
    relevantProviders: ['Green Energy Solutions', 'SolarCity'],
  },
  {
    id: 'insight-3',
    billId: 'bill-5',
    title: 'Home Insurance Annual Review',
    description: 'It\'s time for your annual home insurance review. Bundling with your auto insurance could save up to 20%.',
    potentialSavings: 240,
    actionType: 'Negotiate',
    recommended: true,
    relevantProviders: ['AllState Insurance', 'State Farm Insurance'],
  },
  {
    id: 'insight-4',
    billId: 'bill-4',
    title: 'Subscription Optimization',
    description: 'You could save by switching to an annual plan or the ad-supported tier.',
    potentialSavings: 48,
    actionType: 'Switch Provider',
    recommended: false,
  }
];

const BillsContext = createContext<BillsContextProps | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [insights, setInsights] = useState<BillOptimizationInsight[]>(initialInsights);

  const addBill = (bill: Bill) => {
    setBills((prevBills) => [...prevBills, bill]);
  };

  const updateBill = (bill: Bill) => {
    setBills((prevBills) =>
      prevBills.map((b) => (b.id === bill.id ? bill : b))
    );
  };

  const removeBill = (id: string) => {
    setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
    // Also remove any insights related to this bill
    setInsights((prevInsights) => prevInsights.filter((insight) => insight.billId !== id));
  };

  const getBillById = (id: string) => {
    return bills.find((bill) => bill.id === id);
  };

  const getBillsByCategory = (category: BillCategory) => {
    return bills.filter((bill) => bill.category === category);
  };

  const getBillsByStatus = (status: "Paid" | "Upcoming" | "Overdue" | "Pending") => {
    return bills.filter((bill) => bill.status === status);
  };

  const getUpcomingBills = (days: number) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    
    return bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= futureDate && bill.status !== 'Paid';
    });
  };

  const applyInsight = (insightId: string) => {
    // In a real app, this would implement the recommended action
    // For now, we'll just mark the insight as applied by removing it
    setInsights((prevInsights) => 
      prevInsights.filter((insight) => insight.id !== insightId)
    );
  };

  return (
    <BillsContext.Provider
      value={{
        bills,
        insights,
        addBill,
        updateBill,
        removeBill,
        getBillById,
        getBillsByCategory,
        getBillsByStatus,
        getUpcomingBills,
        applyInsight,
      }}
    >
      {children}
    </BillsContext.Provider>
  );
}

export const useBills = () => {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillsProvider');
  }
  return context;
};
