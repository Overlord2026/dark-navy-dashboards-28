
export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  timeframe: 'monthly' | 'yearly';
}
