
export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  isComplete?: boolean;
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Investment' | 'Retirement' | 'Other';
  balance: number;
  isSelected?: boolean;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  type: 'Healthcare' | 'Transportation' | 'Living' | 'Housing';
  period: 'Before Retirement' | 'After Retirement';
  owner: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: 'Monthly' | 'Annual';
  isPassive: boolean;
}

export interface Saving {
  id: string;
  accountId: string;
  amount: number;
  frequency: 'Monthly' | 'Annual';
}

export interface Insurance {
  id: string;
  type: string;
  provider: string;
  premium: number;
  coverage: number;
}

export interface FinancialPlan {
  id: string;
  name: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  isDraft: boolean;
  isActive: boolean;
  isFavorite: boolean;
  successRate: number;
  status: 'Draft' | 'Active' | 'Archived';
  goals: FinancialGoal[];
  accounts: FinancialAccount[];
  expenses: Expense[];
  income?: Income[];
  savings?: Saving[];
  insurance?: Insurance[];
  draftData?: any;
  step?: number;
}

export interface FinancialPlansSummary {
  activePlans: number;
  draftPlans: number;
  totalGoals: number;
  averageSuccessRate: number;
}
