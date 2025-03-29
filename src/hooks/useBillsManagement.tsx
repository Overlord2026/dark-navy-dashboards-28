
import { useState } from 'react';
import { Bill, BillCategory } from '@/types/bill';

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

export interface BillsManagementHook {
  bills: Bill[];
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  removeBill: (id: string) => void;
  getBillById: (id: string) => Bill | undefined;
  getBillsByCategory: (category: BillCategory) => Bill[];
  getBillsByStatus: (status: "Paid" | "Upcoming" | "Overdue" | "Pending") => Bill[];
  getUpcomingBills: (days: number) => Bill[];
}

export function useBillsManagement(): BillsManagementHook {
  const [bills, setBills] = useState<Bill[]>(initialBills);

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

  return {
    bills,
    addBill,
    updateBill,
    removeBill,
    getBillById,
    getBillsByCategory,
    getBillsByStatus,
    getUpcomingBills,
  };
}
