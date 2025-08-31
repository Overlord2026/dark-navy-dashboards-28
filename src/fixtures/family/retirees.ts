// Family Retirees Demo Fixtures
// This module provides sample data for the retiree family roadmap demo

export interface RetireeBucketItem {
  id: string;
  title: string;
  destination: string;
  targetDate: string;
  budget: number;
  saved: number;
  category: 'travel' | 'experience' | 'purchase' | 'family';
  images: string[];
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface RetireeGoal {
  id: string;
  title: string;
  category: 'income' | 'health' | 'tax' | 'estate';
  description: string;
  targetValue: number;
  currentValue: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'completed' | 'at-risk';
  metrics: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }>;
  nextActions: string[];
}

export interface RetireeTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  account: string;
}

export interface RetireeDocument {
  id: string;
  name: string;
  category: 'estate' | 'financial' | 'health' | 'insurance' | 'tax';
  type: string;
  lastUpdated: string;
  expiryDate?: string;
  status: 'current' | 'expiring' | 'expired' | 'needs-review';
  size: string;
  isPrivate: boolean;
}

export const RETIREE_BUCKET_LIST: RetireeBucketItem[] = [
  {
    id: '1',
    title: 'European River Cruise',
    destination: 'Rhine River, Europe',
    targetDate: '2025-05-15',
    budget: 8500,
    saved: 6200,
    category: 'travel',
    images: ['/placeholder.svg', '/placeholder.svg'],
    priority: 'high',
    description: '14-day luxury river cruise through Germany, France, and Netherlands'
  },
  {
    id: '2',
    title: 'Dream Kitchen Renovation',
    destination: 'Home',
    targetDate: '2025-03-01',
    budget: 45000,
    saved: 32000,
    category: 'purchase',
    images: ['/placeholder.svg'],
    priority: 'medium',
    description: 'Complete kitchen remodel with premium appliances and finishes'
  },
  {
    id: '3',
    title: 'Visit Grandchildren',
    destination: 'Seattle, WA',
    targetDate: '2025-07-04',
    budget: 3200,
    saved: 3200,
    category: 'family',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    priority: 'high',
    description: 'Two-week summer visit with the grandkids'
  },
  {
    id: '4',
    title: 'African Safari',
    destination: 'Kenya & Tanzania',
    targetDate: '2026-09-15',
    budget: 12000,
    saved: 2800,
    category: 'travel',
    images: ['/placeholder.svg'],
    priority: 'medium',
    description: 'Once-in-a-lifetime wildlife photography expedition'
  }
];

export const RETIREE_GOALS: RetireeGoal[] = [
  {
    id: '1',
    title: 'Income Replacement Strategy',
    category: 'income',
    description: 'Achieve 85% income replacement through diversified retirement sources',
    targetValue: 85,
    currentValue: 78,
    targetDate: '2025-01-01',
    priority: 'high',
    status: 'on-track',
    metrics: [
      { label: 'Social Security', value: '42%', trend: 'stable' },
      { label: '401(k) Withdrawal', value: '28%', trend: 'up' },
      { label: 'Pension', value: '8%', trend: 'stable' }
    ],
    nextActions: [
      'Review withdrawal strategy for Q1 2025',
      'Optimize Social Security timing',
      'Consider Roth conversion ladder'
    ]
  },
  {
    id: '2',
    title: 'Required Minimum Distributions',
    category: 'tax',
    description: 'Efficiently manage RMDs to minimize tax impact',
    targetValue: 100,
    currentValue: 92,
    targetDate: '2024-12-31',
    priority: 'high',
    status: 'on-track',
    metrics: [
      { label: '2024 RMD Amount', value: '$18,750' },
      { label: 'Tax Efficiency', value: '92%', trend: 'up' },
      { label: 'Estimated Tax', value: '$3,375' }
    ],
    nextActions: [
      'Take Q4 RMD by December 31st',
      'Plan 2025 distribution timing',
      'Consider QCD for charity'
    ]
  },
  {
    id: '3',
    title: 'Healthcare Cost Planning',
    category: 'health',
    description: 'Comprehensive healthcare coverage and cost management',
    targetValue: 100,
    currentValue: 65,
    targetDate: '2025-03-01',
    priority: 'high',
    status: 'behind',
    metrics: [
      { label: 'Annual Premium', value: '$4,200' },
      { label: 'HSA Balance', value: '$12,500', trend: 'up' },
      { label: 'Coverage Score', value: '85%' }
    ],
    nextActions: [
      'Review Medicare supplement options',
      'Schedule annual wellness visit',
      'Research long-term care insurance'
    ]
  }
];

export const RETIREE_TRANSACTIONS: RetireeTransaction[] = [
  { id: '1', date: '2024-12-01', description: 'Social Security Payment', category: 'Income', amount: 3420, type: 'income', account: 'Checking' },
  { id: '2', date: '2024-12-01', description: 'Pension Payment', category: 'Income', amount: 1850, type: 'income', account: 'Checking' },
  { id: '3', date: '2024-11-30', description: 'Costco Pharmacy', category: 'Healthcare', amount: -185, type: 'expense', account: 'Checking' },
  { id: '4', date: '2024-11-29', description: 'Electric Bill', category: 'Utilities', amount: -234, type: 'expense', account: 'Checking' },
  { id: '5', date: '2024-11-28', description: 'Grocery Shopping', category: 'Food & Dining', amount: -127, type: 'expense', account: 'Credit Card' },
  { id: '6', date: '2024-11-27', description: 'Gas Station', category: 'Transportation', amount: -65, type: 'expense', account: 'Credit Card' },
  { id: '7', date: '2024-11-26', description: 'Restaurant Dinner', category: 'Food & Dining', amount: -89, type: 'expense', account: 'Credit Card' },
  { id: '8', date: '2024-11-25', description: 'Amazon Purchase', category: 'Shopping', amount: -156, type: 'expense', account: 'Credit Card' }
];

export const RETIREE_DOCUMENTS: RetireeDocument[] = [
  {
    id: '1',
    name: 'Last Will and Testament',
    category: 'estate',
    type: 'PDF',
    lastUpdated: '2024-03-15',
    status: 'current',
    size: '2.1 MB',
    isPrivate: true
  },
  {
    id: '2',
    name: 'Living Trust Document',
    category: 'estate',
    type: 'PDF',
    lastUpdated: '2024-03-15',
    status: 'current',
    size: '3.8 MB',
    isPrivate: true
  },
  {
    id: '3',
    name: 'Medicare Supplement Policy',
    category: 'insurance',
    type: 'PDF',
    lastUpdated: '2024-01-01',
    expiryDate: '2024-12-31',
    status: 'expiring',
    size: '1.2 MB',
    isPrivate: false
  },
  {
    id: '4',
    name: 'Financial Power of Attorney',
    category: 'estate',
    type: 'PDF',
    lastUpdated: '2023-08-10',
    status: 'needs-review',
    size: '892 KB',
    isPrivate: true
  }
];

// Main fixture loader function
export async function loadRetireeFixtures() {
  console.log('🔄 Loading retiree family fixtures...');
  
  // Simulate API calls to populate the state
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const fixtures = {
    bucketList: RETIREE_BUCKET_LIST,
    goals: RETIREE_GOALS,
    transactions: RETIREE_TRANSACTIONS,
    documents: RETIREE_DOCUMENTS,
    profile: {
      name: 'Robert & Linda Thompson',
      age: '68 & 65',
      location: 'Scottsdale, AZ',
      retirementDate: '2022-06-30',
      netWorth: 1250000,
      monthlyIncome: 5270,
      monthlyExpenses: 4150
    }
  };
  
  console.log('✅ Retiree family fixtures loaded:', fixtures);
  return fixtures;
}

// Clear fixtures function
export function clearRetireeFixtures() {
  console.log('🗑️ Clearing retiree family fixtures...');
  // Implementation would clear any stored state
  return true;
}