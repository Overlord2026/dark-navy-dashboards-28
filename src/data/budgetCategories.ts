import { BudgetCategory } from '@/types/budget';

export const defaultBudgetCategories: BudgetCategory[] = [
  // Housing & Utilities
  {
    id: 'housing',
    name: 'Housing & Utilities',
    type: 'expense',
    color: 'hsl(var(--primary))',
    icon: 'Home',
    isDefault: true,
  },
  {
    id: 'rent-mortgage',
    name: 'Rent/Mortgage',
    type: 'expense',
    color: 'hsl(var(--primary))',
    icon: 'Home',
    isDefault: true,
    parentCategory: 'housing',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    type: 'expense',
    color: 'hsl(var(--primary))',
    icon: 'Zap',
    isDefault: true,
    parentCategory: 'housing',
  },
  
  // Transportation
  {
    id: 'transportation',
    name: 'Transportation',
    type: 'expense',
    color: 'hsl(var(--secondary))',
    icon: 'Car',
    isDefault: true,
  },
  {
    id: 'car-payment',
    name: 'Car Payment',
    type: 'expense',
    color: 'hsl(var(--secondary))',
    icon: 'Car',
    isDefault: true,
    parentCategory: 'transportation',
  },
  {
    id: 'gas',
    name: 'Gas & Fuel',
    type: 'expense',
    color: 'hsl(var(--secondary))',
    icon: 'Fuel',
    isDefault: true,
    parentCategory: 'transportation',
  },
  
  // Food & Dining
  {
    id: 'food',
    name: 'Food & Dining',
    type: 'expense',
    color: 'hsl(var(--accent))',
    icon: 'UtensilsCrossed',
    isDefault: true,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    type: 'expense',
    color: 'hsl(var(--accent))',
    icon: 'ShoppingCart',
    isDefault: true,
    parentCategory: 'food',
  },
  {
    id: 'dining-out',
    name: 'Dining Out',
    type: 'expense',
    color: 'hsl(var(--accent))',
    icon: 'UtensilsCrossed',
    isDefault: true,
    parentCategory: 'food',
  },
  
  // Healthcare & Wellness
  {
    id: 'healthcare',
    name: 'Healthcare & Wellness',
    type: 'expense',
    color: 'hsl(var(--success))',
    icon: 'Heart',
    isDefault: true,
  },
  {
    id: 'medical',
    name: 'Medical & Dental',
    type: 'expense',
    color: 'hsl(var(--success))',
    icon: 'Stethoscope',
    isDefault: true,
    parentCategory: 'healthcare',
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    type: 'expense',
    color: 'hsl(var(--success))',
    icon: 'Dumbbell',
    isDefault: true,
    parentCategory: 'healthcare',
  },
  
  // Travel & Entertainment
  {
    id: 'travel',
    name: 'Travel & Experiences',
    type: 'expense',
    color: 'hsl(var(--warning))',
    icon: 'Plane',
    isDefault: true,
  },
  {
    id: 'vacation',
    name: 'Vacation',
    type: 'expense',
    color: 'hsl(var(--warning))',
    icon: 'Palmtree',
    isDefault: true,
    parentCategory: 'travel',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    color: 'hsl(var(--warning))',
    icon: 'Ticket',
    isDefault: true,
    parentCategory: 'travel',
  },
  
  // Taxes & Professional
  {
    id: 'taxes',
    name: 'Taxes & Professional',
    type: 'expense',
    color: 'hsl(var(--destructive))',
    icon: 'Calculator',
    isDefault: true,
  },
  {
    id: 'income-tax',
    name: 'Income Tax',
    type: 'expense',
    color: 'hsl(var(--destructive))',
    icon: 'Receipt',
    isDefault: true,
    parentCategory: 'taxes',
  },
  {
    id: 'professional-fees',
    name: 'Professional Fees',
    type: 'expense',
    color: 'hsl(var(--destructive))',
    icon: 'Briefcase',
    isDefault: true,
    parentCategory: 'taxes',
  },
  
  // Income Categories
  {
    id: 'salary',
    name: 'Salary & Wages',
    type: 'income',
    color: 'hsl(var(--success))',
    icon: 'DollarSign',
    isDefault: true,
  },
  {
    id: 'investments',
    name: 'Investment Income',
    type: 'income',
    color: 'hsl(var(--success))',
    icon: 'TrendingUp',
    isDefault: true,
  },
  {
    id: 'business',
    name: 'Business Income',
    type: 'income',
    color: 'hsl(var(--success))',
    icon: 'Building',
    isDefault: true,
  },
  {
    id: 'other-income',
    name: 'Other Income',
    type: 'income',
    color: 'hsl(var(--success))',
    icon: 'Plus',
    isDefault: true,
  },
];

export const getBudgetCategoryById = (id: string): BudgetCategory | undefined => {
  return defaultBudgetCategories.find(category => category.id === id);
};

export const getBudgetCategoriesByType = (type: 'income' | 'expense'): BudgetCategory[] => {
  return defaultBudgetCategories.filter(category => category.type === type);
};

export const getMainBudgetCategories = (): BudgetCategory[] => {
  return defaultBudgetCategories.filter(category => !category.parentCategory);
};

export const getSubcategories = (parentId: string): BudgetCategory[] => {
  return defaultBudgetCategories.filter(category => category.parentCategory === parentId);
};