
export interface DashboardMetric {
  value: number | null;
  previousValue?: number | null;
  target: number;
  label: string;
  type: 'income' | 'expenses' | 'cashflow' | 'savings';
}

export interface DashboardMetrics {
  income: DashboardMetric;
  expenses: DashboardMetric;
  cashFlow: DashboardMetric;
  savingsRate: DashboardMetric;
}
