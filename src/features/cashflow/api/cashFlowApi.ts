import { useQuery } from '@tanstack/react-query';
import { CashFlowData, CashFlowSummary, DrilldownData } from '../types';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, format, subDays } from 'date-fns';

// Mock transaction data for cash flow calculations
const mockTransactions = [
  { id: '1', date: '2024-01-15', amount: 5000, type: 'income', categoryId: 'cat-salary', categoryName: 'Salary', merchantId: 'm1', merchantName: 'Employer Corp' },
  { id: '2', date: '2024-01-20', amount: -125, type: 'expense', categoryId: 'cat-groceries', categoryName: 'Groceries', merchantId: 'm2', merchantName: 'Whole Foods' },
  { id: '3', date: '2024-01-25', amount: -15, type: 'expense', categoryId: 'cat-financial', categoryName: 'Financial Services', merchantId: 'm3', merchantName: 'Monarch Money' },
  { id: '4', date: '2024-02-15', amount: 5000, type: 'income', categoryId: 'cat-salary', categoryName: 'Salary', merchantId: 'm1', merchantName: 'Employer Corp' },
  { id: '5', date: '2024-02-18', amount: -1200, type: 'expense', categoryId: 'cat-rent', categoryName: 'Rent', merchantId: 'm4', merchantName: 'Property Management' },
  { id: '6', date: '2024-02-22', amount: -80, type: 'expense', categoryId: 'cat-groceries', categoryName: 'Groceries', merchantId: 'm2', merchantName: 'Whole Foods' },
  { id: '7', date: '2024-03-15', amount: 5000, type: 'income', categoryId: 'cat-salary', categoryName: 'Salary', merchantId: 'm1', merchantName: 'Employer Corp' },
  { id: '8', date: '2024-03-10', amount: -1200, type: 'expense', categoryId: 'cat-rent', categoryName: 'Rent', merchantId: 'm4', merchantName: 'Property Management' },
  { id: '9', date: '2024-03-12', amount: -95, type: 'expense', categoryId: 'cat-groceries', categoryName: 'Groceries', merchantId: 'm2', merchantName: 'Whole Foods' },
  { id: '10', date: '2024-12-15', amount: 5000, type: 'income', categoryId: 'cat-salary', categoryName: 'Salary', merchantId: 'm1', merchantName: 'Employer Corp' },
  { id: '11', date: '2024-12-10', amount: -1200, type: 'expense', categoryId: 'cat-rent', categoryName: 'Rent', merchantId: 'm4', merchantName: 'Property Management' },
  { id: '12', date: '2024-12-18', amount: -200, type: 'expense', categoryId: 'cat-groceries', categoryName: 'Groceries', merchantId: 'm2', merchantName: 'Whole Foods' },
  { id: '13', date: '2024-12-20', amount: -15, type: 'expense', categoryId: 'cat-financial', categoryName: 'Financial Services', merchantId: 'm3', merchantName: 'Monarch Money' },
];

export const getPeriodDates = (period: string) => {
  const now = new Date();
  
  switch (period) {
    case 'MTD':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
    case '3M':
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfMonth(now)
      };
    case '6M':
      return {
        startDate: startOfMonth(subMonths(now, 5)),
        endDate: endOfMonth(now)
      };
    case 'YTD':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now)
      };
    case '1Y':
      return {
        startDate: subDays(now, 365),
        endDate: now
      };
    case 'ALL':
      return {
        startDate: new Date('2020-01-01'),
        endDate: now
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
  }
};

export const cashFlowApi = {
  getCashFlowData: async (period: string): Promise<CashFlowData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { startDate, endDate } = getPeriodDates(period);
    
    // Filter transactions within period
    const filteredTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Group by month and calculate totals
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    filteredTransactions.forEach(transaction => {
      const monthKey = format(new Date(transaction.date), 'yyyy-MM');
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expenses += Math.abs(transaction.amount);
      }
    });
    
    // Convert to array format
    const cashFlowData: CashFlowData[] = Array.from(monthlyData.entries()).map(([month, data]) => ({
      date: month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
      period: format(new Date(month + '-01'), 'MMM yyyy')
    }));
    
    return cashFlowData.sort((a, b) => a.date.localeCompare(b.date));
  },

  getCashFlowSummary: async (period: string): Promise<CashFlowSummary> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { startDate, endDate } = getPeriodDates(period);
    
    // Filter transactions within period
    const filteredTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Category breakdown
    const categoryMap = new Map<string, DrilldownData>();
    const merchantMap = new Map<string, DrilldownData>();
    
    filteredTransactions.forEach(transaction => {
      // Category breakdown
      if (!categoryMap.has(transaction.categoryId)) {
        categoryMap.set(transaction.categoryId, {
          categoryId: transaction.categoryId,
          categoryName: transaction.categoryName,
          amount: 0,
          transactionCount: 0,
          transactions: []
        });
      }
      
      const categoryData = categoryMap.get(transaction.categoryId)!;
      categoryData.amount += Math.abs(transaction.amount);
      categoryData.transactionCount++;
      categoryData.transactions.push(transaction.id);
      
      // Merchant breakdown
      if (!merchantMap.has(transaction.merchantId)) {
        merchantMap.set(transaction.merchantId, {
          merchantId: transaction.merchantId,
          merchantName: transaction.merchantName,
          amount: 0,
          transactionCount: 0,
          transactions: []
        });
      }
      
      const merchantData = merchantMap.get(transaction.merchantId)!;
      merchantData.amount += Math.abs(transaction.amount);
      merchantData.transactionCount++;
      merchantData.transactions.push(transaction.id);
    });
    
    // Calculate monthly averages
    const monthsInPeriod = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    return {
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses,
      avgMonthlyIncome: totalIncome / monthsInPeriod,
      avgMonthlyExpenses: totalExpenses / monthsInPeriod,
      categoryBreakdown: Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount),
      merchantBreakdown: Array.from(merchantMap.values()).sort((a, b) => b.amount - a.amount)
    };
  },

  getDrilldownTransactions: async (filters: {
    period: string;
    categoryId?: string;
    merchantId?: string;
  }): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { startDate, endDate } = getPeriodDates(filters.period);
    
    let filteredTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    if (filters.categoryId) {
      filteredTransactions = filteredTransactions.filter(t => t.categoryId === filters.categoryId);
    }
    
    if (filters.merchantId) {
      filteredTransactions = filteredTransactions.filter(t => t.merchantId === filters.merchantId);
    }
    
    return filteredTransactions;
  }
};

// React Query hooks
export const useCashFlowData = (period: string) => {
  return useQuery({
    queryKey: ['cashflow-data', period],
    queryFn: () => cashFlowApi.getCashFlowData(period)
  });
};

export const useCashFlowSummary = (period: string) => {
  return useQuery({
    queryKey: ['cashflow-summary', period],
    queryFn: () => cashFlowApi.getCashFlowSummary(period)
  });
};

export const useDrilldownTransactions = (filters: {
  period: string;
  categoryId?: string;
  merchantId?: string;
}) => {
  return useQuery({
    queryKey: ['drilldown-transactions', filters],
    queryFn: () => cashFlowApi.getDrilldownTransactions(filters),
    enabled: !!(filters.categoryId || filters.merchantId)
  });
};