// Goals API with React Query integration

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Goal, Account, CreateGoalRequest, UpdateGoalRequest, AssignAccountsRequest, SetContributionPlanRequest, PersonaDefaults } from '@/types/goal';
import { v4 as uuidv4 } from 'uuid';

// Mock data storage - replace with actual API calls
let mockGoals: Goal[] = [
  {
    id: 'goal-1',
    type: 'emergency',
    title: 'Emergency Fund',
    targetAmount: 10000,
    targetDate: '2024-12-31',
    assignedAccountIds: ['account-1'],
    monthlyContribution: 500,
    persona: 'aspiring',
    priority: 1,
    progress: { current: 3500, pct: 35 },
    smartr: {
      specific: 'Build an emergency fund to cover 6 months of expenses',
      measurable: '$10,000 in a high-yield savings account',
      achievable: 'Save $500 per month from monthly income',
      relevant: 'Essential for financial security and peace of mind',
      timeBound: 'Complete by December 31, 2024'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'goal-2',
    type: 'bucket_list',
    title: 'Greece Trip 2026',
    imageUrl: '/images/greece.jpg',
    targetAmount: 5000,
    targetDate: '2026-07-15',
    assignedAccountIds: ['account-2'],
    monthlyContribution: 200,
    persona: 'retiree',
    priority: 1,
    progress: { current: 800, pct: 16 },
    smartr: {
      specific: 'Plan and fund a 2-week trip to Greece including islands',
      measurable: '$5,000 for flights, accommodation, and activities',
      achievable: 'Save $200 per month for 25 months',
      relevant: 'Fulfilling a lifelong dream of visiting ancient sites',
      timeBound: 'Trip planned for July 2026'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockAccounts: Account[] = [
  { id: 'account-1', name: 'High-Yield Savings', type: 'savings', balance: 15000, institution: 'Ally Bank' },
  { id: 'account-2', name: 'Travel Fund', type: 'savings', balance: 2500, institution: 'Capital One' },
  { id: 'account-3', name: 'Checking Account', type: 'checking', balance: 5000, institution: 'Chase' },
  { id: 'account-4', name: 'Investment Account', type: 'investment', balance: 25000, institution: 'Vanguard' }
];

// Persona defaults configuration
const personaDefaults: PersonaDefaults[] = [
  {
    persona: 'aspiring',
    goals: [
      {
        type: 'emergency',
        title: 'Emergency Fund',
        targetAmount: 10000,
        monthlyContribution: 500,
        persona: 'aspiring',
        priority: 1,
        smartr: {
          specific: 'Build an emergency fund to cover 6 months of expenses',
          measurable: '$10,000 in a high-yield savings account',
          achievable: 'Save $500 per month from monthly income',
          relevant: 'Essential for financial security and peace of mind',
          timeBound: 'Complete within 20 months'
        }
      },
      {
        type: 'down_payment',
        title: 'House Down Payment',
        targetAmount: 50000,
        monthlyContribution: 1000,
        persona: 'aspiring',
        priority: 2,
        progress: { current: 0, pct: 0 },
        smartr: {
          specific: 'Save for a 20% down payment on a home',
          measurable: '$50,000 for down payment and closing costs',
          achievable: 'Save $1,000 per month',
          relevant: 'Building wealth through homeownership',
          timeBound: 'Ready to buy within 4-5 years'
        }
      },
      {
        type: 'savings',
        title: 'General Savings Goal',
        targetAmount: 25000,
        monthlyContribution: 300,
        persona: 'aspiring',
        priority: 3,
        progress: { current: 0, pct: 0 },
        smartr: {
          specific: 'Build general savings for opportunities and security',
          measurable: '$25,000 in diversified savings',
          achievable: 'Save $300 per month consistently',
          relevant: 'Provides flexibility and financial options',
          timeBound: 'Achieve within 7 years'
        }
      }
    ]
  },
  {
    persona: 'retiree',
    goals: [
      {
        type: 'bucket_list',
        title: 'European River Cruise',
        targetAmount: 8000,
        monthlyContribution: 400,
        persona: 'retiree',
        priority: 1,
        progress: { current: 0, pct: 0 },
        smartr: {
          specific: 'Take a luxury river cruise through Europe',
          measurable: '$8,000 for cruise, flights, and excursions',
          achievable: 'Save $400 per month from retirement income',
          relevant: 'Fulfilling travel dreams in retirement',
          timeBound: 'Book cruise for next year'
        }
      },
      {
        type: 'retirement',
        title: 'Health/HSA Reserve',
        targetAmount: 15000,
        monthlyContribution: 250,
        persona: 'retiree',
        priority: 2,
        progress: { current: 0, pct: 0 },
        smartr: {
          specific: 'Build health expense reserve for medical costs',
          measurable: '$15,000 in HSA or health savings',
          achievable: 'Contribute $250 monthly to health fund',
          relevant: 'Managing healthcare costs in retirement',
          timeBound: 'Build reserve over 5 years'
        }
      },
      {
        type: 'custom',
        title: 'Charitable Giving Fund',
        targetAmount: 20000,
        monthlyContribution: 200,
        persona: 'retiree',
        priority: 3,
        progress: { current: 0, pct: 0 },
        smartr: {
          specific: 'Create a fund for charitable donations',
          measurable: '$20,000 for annual giving',
          achievable: 'Set aside $200 monthly for charity',
          relevant: 'Giving back to community in retirement',
          timeBound: 'Build fund over 8 years'
        }
      }
    ]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const goalsApi = {
  // List goals
  listGoals: async (): Promise<Goal[]> => {
    await delay(300);
    return [...mockGoals];
  },

  // Create goal
  createGoal: async (goalData: CreateGoalRequest): Promise<Goal> => {
    await delay(500);
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      assignedAccountIds: [],
      progress: { current: 0, pct: 0 },
      priority: goalData.priority || mockGoals.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockGoals.push(newGoal);
    return newGoal;
  },

  // Update goal
  updateGoal: async (goalData: UpdateGoalRequest): Promise<Goal> => {
    await delay(400);
    const index = mockGoals.findIndex(g => g.id === goalData.id);
    if (index === -1) throw new Error('Goal not found');
    
    const updatedGoal = {
      ...mockGoals[index],
      ...goalData,
      updatedAt: new Date().toISOString()
    };
    
    // Recalculate progress percentage
    if (updatedGoal.targetAmount && updatedGoal.progress) {
      updatedGoal.progress.pct = Math.round((updatedGoal.progress.current / updatedGoal.targetAmount) * 100);
    }
    
    mockGoals[index] = updatedGoal;
    return updatedGoal;
  },

  // Delete goal
  deleteGoal: async (goalId: string): Promise<void> => {
    await delay(300);
    const index = mockGoals.findIndex(g => g.id === goalId);
    if (index === -1) throw new Error('Goal not found');
    mockGoals.splice(index, 1);
  },

  // Assign accounts to goal
  assignAccounts: async ({ goalId, accountIds }: AssignAccountsRequest): Promise<Goal> => {
    await delay(300);
    const index = mockGoals.findIndex(g => g.id === goalId);
    if (index === -1) throw new Error('Goal not found');
    
    mockGoals[index] = {
      ...mockGoals[index],
      assignedAccountIds: accountIds,
      updatedAt: new Date().toISOString()
    };
    
    return mockGoals[index];
  },

  // Set contribution plan
  setContributionPlan: async ({ goalId, monthlyContribution, targetDate }: SetContributionPlanRequest): Promise<Goal> => {
    await delay(300);
    const index = mockGoals.findIndex(g => g.id === goalId);
    if (index === -1) throw new Error('Goal not found');
    
    mockGoals[index] = {
      ...mockGoals[index],
      monthlyContribution,
      targetDate: targetDate || mockGoals[index].targetDate,
      updatedAt: new Date().toISOString()
    };
    
    return mockGoals[index];
  },

  // Get accounts for assignment
  getAccounts: async (): Promise<Account[]> => {
    await delay(200);
    return [...mockAccounts];
  },

  // Get persona defaults
  getPersonaDefaults: async (persona: 'aspiring' | 'retiree'): Promise<PersonaDefaults> => {
    await delay(200);
    const defaults = personaDefaults.find(p => p.persona === persona);
    if (!defaults) throw new Error('Persona defaults not found');
    return defaults;
  },

  // Reorder goals (for top 3 priorities)
  reorderGoals: async (goalIds: string[]): Promise<Goal[]> => {
    await delay(300);
    goalIds.forEach((goalId, index) => {
      const goalIndex = mockGoals.findIndex(g => g.id === goalId);
      if (goalIndex !== -1) {
        mockGoals[goalIndex] = {
          ...mockGoals[goalIndex],
          priority: index + 1,
          updatedAt: new Date().toISOString()
        };
      }
    });
    return mockGoals.sort((a, b) => a.priority - b.priority);
  }
};

// React Query keys
export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: string) => [...goalKeys.lists(), { filters }] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  accounts: ['accounts'] as const,
  personaDefaults: (persona: string) => ['personaDefaults', persona] as const,
};