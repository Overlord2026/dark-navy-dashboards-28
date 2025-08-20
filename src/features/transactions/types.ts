export interface Transaction {
  id: string;
  date: string; // ISO date
  description: string;
  originalDescription: string;
  amount: number;
  accountId: string;
  accountName: string;
  categoryId?: string;
  category?: Category;
  merchantId?: string;
  merchant?: Merchant;
  tags: string[];
  notes?: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'pending' | 'posted' | 'cleared';
  isHidden: boolean;
  isRecurring: boolean;
  plaidTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  color: string;
  type: 'income' | 'expense' | 'transfer';
  parentId?: string;
  children?: Category[];
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rule {
  id: string;
  name: string;
  isActive: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  appliedCount: number;
  lastApplied?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuleCondition {
  field: 'description' | 'amount' | 'account' | 'merchant';
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  secondValue?: number; // for 'between' operator
  caseSensitive?: boolean;
}

export interface RuleAction {
  type: 'set_category' | 'add_tag' | 'set_merchant' | 'set_description' | 'hide';
  value: string;
}

export interface Merchant {
  id: string;
  name: string;
  displayName: string;
  categoryId?: string;
  website?: string;
  logo?: string;
  transactionCount: number;
  lastTransactionDate?: string;
  averageAmount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilter {
  search?: string;
  accountIds?: string[];
  categoryIds?: string[];
  merchantIds?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  type?: 'income' | 'expense' | 'transfer';
  status?: 'pending' | 'posted' | 'cleared';
  isHidden?: boolean;
}

export interface BulkEditData {
  categoryId?: string;
  merchantId?: string;
  tags?: string[];
  addTags?: string[];
  removeTags?: string[];
  hide?: boolean;
}