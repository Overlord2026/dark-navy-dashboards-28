
export type BillFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  frequency: BillFrequency;
  accountNumber?: string;
  createdAt: string;
}

export const BILL_CATEGORIES = [
  'Utilities',
  'Housing',
  'Entertainment',
  'Insurance',
  'Transportation',
  'Other'
] as const;

export type BillCategory = typeof BILL_CATEGORIES[number];
