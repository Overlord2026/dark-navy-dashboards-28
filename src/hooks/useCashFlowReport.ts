
import { useState, useEffect } from 'react';

export interface CashFlowEntry {
  id: string;
  name: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  date?: string;
}

export interface CashFlowTimeframe {
  type: 'monthly' | 'quarterly' | 'annual' | 'ytd';
  multiplier: number;
}

export function useCashFlowReport() {
  const [entries, setEntries] = useState<CashFlowEntry[]>(() => {
    const saved = localStorage.getItem('cashflow-report-data');
    return saved ? JSON.parse(saved) : [];
  });

  const [timeframe, setTimeframe] = useState<CashFlowTimeframe>(() => {
    const saved = localStorage.getItem('cashflow-report-timeframe');
    return saved ? JSON.parse(saved) : { type: 'monthly', multiplier: 1 };
  });

  useEffect(() => {
    localStorage.setItem('cashflow-report-data', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('cashflow-report-timeframe', JSON.stringify(timeframe));
  }, [timeframe]);

  const addEntry = (type: 'income' | 'expense') => {
    const newEntry: CashFlowEntry = {
      id: `cashflow-${Date.now()}`,
      name: '',
      type,
      amount: 0
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<CashFlowEntry>) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const getTotalIncome = () => {
    return entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  };

  const getTotalExpenses = () => {
    return entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
  };

  const getNetCashFlow = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return {
    entries,
    timeframe,
    setTimeframe,
    addEntry,
    updateEntry,
    deleteEntry,
    getTotalIncome,
    getTotalExpenses,
    getNetCashFlow
  };
}
