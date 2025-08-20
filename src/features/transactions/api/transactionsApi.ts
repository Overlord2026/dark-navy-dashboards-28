import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, Category, Rule, Merchant, TransactionFilter, BulkEditData } from '../types';

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Monarch Subscription',
    originalDescription: 'MONARCH MONEY SUB',
    amount: -14.99,
    accountId: 'acc1',
    accountName: 'Chase Checking',
    categoryId: 'cat-financial',
    type: 'expense',
    status: 'posted',
    isHidden: false,
    isRecurring: true,
    tags: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Grocery Store',
    originalDescription: 'WHOLE FOODS MARKET',
    amount: -125.43,
    accountId: 'acc1',
    accountName: 'Chase Checking',
    categoryId: 'cat-groceries',
    type: 'expense',
    status: 'posted',
    isHidden: false,
    isRecurring: false,
    tags: ['weekly'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  }
];

const mockCategories: Category[] = [
  {
    id: 'cat-income',
    name: 'Income',
    emoji: '💰',
    color: 'hsl(var(--success))',
    type: 'income',
    isDefault: true,
    isActive: true,
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-salary',
    name: 'Salary',
    emoji: '💼',
    color: 'hsl(var(--success))',
    type: 'income',
    parentId: 'cat-income',
    isDefault: true,
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-expenses',
    name: 'Expenses',
    emoji: '💸',
    color: 'hsl(var(--destructive))',
    type: 'expense',
    isDefault: true,
    isActive: true,
    sortOrder: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-groceries',
    name: 'Groceries',
    emoji: '🛒',
    color: 'hsl(var(--destructive))',
    type: 'expense',
    parentId: 'cat-expenses',
    isDefault: true,
    isActive: true,
    sortOrder: 101,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-financial',
    name: 'Financial & Legal Services',
    emoji: '🏦',
    color: 'hsl(var(--destructive))',
    type: 'expense',
    parentId: 'cat-expenses',
    isDefault: true,
    isActive: true,
    sortOrder: 102,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'Monarch Subscription Rule',
    isActive: true,
    priority: 1,
    conditions: [
      {
        field: 'description',
        operator: 'contains',
        value: 'Monarch',
        caseSensitive: false
      }
    ],
    actions: [
      {
        type: 'set_category',
        value: 'cat-financial'
      },
      {
        type: 'add_tag',
        value: 'Subscription'
      }
    ],
    appliedCount: 3,
    lastApplied: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: 'MONARCH MONEY SUB',
    displayName: 'Monarch Money',
    categoryId: 'cat-financial',
    website: 'monarchmoney.com',
    transactionCount: 3,
    lastTransactionDate: '2024-01-15',
    averageAmount: 14.99,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'WHOLE FOODS MARKET',
    displayName: 'Whole Foods Market',
    categoryId: 'cat-groceries',
    transactionCount: 12,
    lastTransactionDate: '2024-01-14',
    averageAmount: 89.45,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  }
];

// API functions
export const transactionsApi = {
  getTransactions: async (filter?: TransactionFilter): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...mockTransactions];
    
    if (filter) {
      if (filter.search) {
        filtered = filtered.filter(t => 
          t.description.toLowerCase().includes(filter.search!.toLowerCase())
        );
      }
      if (filter.isHidden !== undefined) {
        filtered = filtered.filter(t => t.isHidden === filter.isHidden);
      }
      if (filter.categoryIds?.length) {
        filtered = filtered.filter(t => filter.categoryIds!.includes(t.categoryId || ''));
      }
    }
    
    return filtered;
  },

  getTransaction: async (id: string): Promise<Transaction | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransactions.find(t => t.id === id) || null;
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    mockTransactions[index] = { ...mockTransactions[index], ...data, updatedAt: new Date().toISOString() };
    return mockTransactions[index];
  },

  bulkUpdateTransactions: async (ids: string[], data: BulkEditData): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    ids.forEach(id => {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        if (data.categoryId) mockTransactions[index].categoryId = data.categoryId;
        if (data.hide !== undefined) mockTransactions[index].isHidden = data.hide;
        if (data.addTags) {
          mockTransactions[index].tags = [...new Set([...mockTransactions[index].tags, ...data.addTags])];
        }
        mockTransactions[index].updatedAt = new Date().toISOString();
      }
    });
  },

  hideTransactions: async (ids: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    ids.forEach(id => {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTransactions[index].isHidden = true;
        mockTransactions[index].updatedAt = new Date().toISOString();
      }
    });
  },

  restoreTransactions: async (ids: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    ids.forEach(id => {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTransactions[index].isHidden = false;
        mockTransactions[index].updatedAt = new Date().toISOString();
      }
    });
  }
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },

  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    mockCategories[index] = { ...mockCategories[index], ...data, updatedAt: new Date().toISOString() };
    return mockCategories[index];
  },

  deleteCategory: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    mockCategories.splice(index, 1);
  }
};

export const rulesApi = {
  getRules: async (): Promise<Rule[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRules;
  },

  createRule: async (data: Omit<Rule, 'id' | 'appliedCount' | 'createdAt' | 'updatedAt'>): Promise<Rule> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRule: Rule = {
      ...data,
      id: `rule-${Date.now()}`,
      appliedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRules.push(newRule);
    return newRule;
  },

  updateRule: async (id: string, data: Partial<Rule>): Promise<Rule> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    mockRules[index] = { ...mockRules[index], ...data, updatedAt: new Date().toISOString() };
    return mockRules[index];
  },

  deleteRule: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    mockRules.splice(index, 1);
  }
};

export const merchantsApi = {
  getMerchants: async (): Promise<Merchant[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMerchants;
  },

  updateMerchant: async (id: string, data: Partial<Merchant>): Promise<Merchant> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMerchants.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Merchant not found');
    
    mockMerchants[index] = { ...mockMerchants[index], ...data, updatedAt: new Date().toISOString() };
    return mockMerchants[index];
  }
};

// React Query hooks
export const useTransactions = (filter?: TransactionFilter) => {
  return useQuery({
    queryKey: ['transactions', filter],
    queryFn: () => transactionsApi.getTransactions(filter)
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionsApi.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};

export const useBulkUpdateTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: BulkEditData }) =>
      transactionsApi.bulkUpdateTransactions(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};

export const useHideTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.hideTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};

export const useRestoreTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.restoreTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useRules = () => {
  return useQuery({
    queryKey: ['rules'],
    queryFn: rulesApi.getRules
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rulesApi.createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    }
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Rule> }) =>
      rulesApi.updateRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    }
  });
};

export const useMerchants = () => {
  return useQuery({
    queryKey: ['merchants'],
    queryFn: merchantsApi.getMerchants
  });
};

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Merchant> }) =>
      merchantsApi.updateMerchant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
    }
  });
};