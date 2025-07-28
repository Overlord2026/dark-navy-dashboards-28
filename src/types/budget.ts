export interface BudgetCategory {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon?: string;
  isDefault: boolean;
  parentCategory?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  targetAmount: number;
  actualAmount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  tags?: string[];
  merchantName?: string;
  plaidTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  remainingBudget: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    budgeted: number;
    spent: number;
  }[];
}

export interface SpendingAnalysis {
  topCategories: {
    categoryId: string;
    categoryName: string;
    amount: number;
    transactionCount: number;
    percentage: number;
  }[];
  monthlyBreakdown: {
    month: string;
    totalSpent: number;
    categoryBreakdown: Record<string, number>;
  }[];
  budgetComparison: {
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    variance: number;
    status: 'under' | 'over' | 'on-track';
  }[];
}