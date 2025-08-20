export interface CashFlowPeriod {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

export interface CashFlowData {
  date: string;
  income: number;
  expenses: number;
  net: number;
  period: string;
}

export interface DrilldownData {
  categoryId?: string;
  categoryName?: string;
  merchantId?: string;
  merchantName?: string;
  amount: number;
  transactionCount: number;
  transactions: string[]; // transaction IDs
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  avgMonthlyIncome: number;
  avgMonthlyExpenses: number;
  categoryBreakdown: DrilldownData[];
  merchantBreakdown: DrilldownData[];
}