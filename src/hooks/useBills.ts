
import { useState, useEffect } from 'react';
import { Bill, BillFrequency } from '@/types/bill';
import { addDays, addWeeks, addMonths, isBefore } from 'date-fns';

export function useBills() {
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('bills');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  const addBill = (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBills(prev => [...prev, newBill]);
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills(prev =>
      prev.map(bill =>
        bill.id === id ? { ...bill, ...updates } : bill
      )
    );
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  const getNextDueDate = (bill: Bill): string => {
    const currentDueDate = new Date(bill.dueDate);
    const today = new Date();

    if (bill.frequency === 'once' || !isBefore(currentDueDate, today)) {
      return bill.dueDate;
    }

    let nextDate = currentDueDate;
    switch (bill.frequency) {
      case 'daily':
        nextDate = addDays(currentDueDate, 1);
        break;
      case 'weekly':
        nextDate = addWeeks(currentDueDate, 1);
        break;
      case 'monthly':
        nextDate = addMonths(currentDueDate, 1);
        break;
    }

    return nextDate.toISOString();
  };

  return {
    bills,
    addBill,
    updateBill,
    deleteBill,
    getNextDueDate
  };
}
