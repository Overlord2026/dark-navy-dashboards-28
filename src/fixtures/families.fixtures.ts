// Family demo fixtures
import * as Canonical from '@/lib/canonical';

export const FAMILY_DEMO_DATA = {
  profile: {
    id: '44444444-4444-4444-4444-444444444444',
    family_name: 'The Martinez Family',
    head_of_household: 'Maria Martinez',
    spouse: 'Carlos Martinez',
    children: 2,
    location: 'Austin, TX',
    net_worth: 1250000,
    annual_income: 185000,
    risk_tolerance: 'Moderate',
    life_stage: 'Pre-retirement'
  },

  goals: [
    {
      id: 'goal_001',
      type: 'retirement',
      title: 'Retirement in 15 years',
      target_amount: 2000000,
      current_progress: 650000,
      target_date: '2039-12-31',
      priority: 'high',
      status: 'on_track'
    },
    {
      id: 'goal_002', 
      type: 'education',
      title: 'College fund for twins',
      target_amount: 300000,
      current_progress: 85000,
      target_date: '2030-08-31',
      priority: 'high',
      status: 'on_track'
    },
    {
      id: 'goal_003',
      type: 'emergency',
      title: 'Emergency fund',
      target_amount: 50000,
      current_progress: 35000,
      target_date: '2025-06-30',
      priority: 'medium',
      status: 'behind'
    }
  ],

  accounts: [
    {
      id: 'account_001',
      type: '401k',
      name: 'Maria 401k - TechCorp',
      balance: 285000,
      contribution_rate: 0.15,
      employer_match: 0.06,
      investments: ['Target Date 2040', 'Large Cap Growth', 'International']
    },
    {
      id: 'account_002',
      type: '401k', 
      name: 'Carlos 401k - Healthcare Inc',
      balance: 195000,
      contribution_rate: 0.12,
      employer_match: 0.04,
      investments: ['S&P 500 Index', 'Bond Index', 'Real Estate']
    },
    {
      id: 'account_003',
      type: 'brokerage',
      name: 'Joint Investment Account',
      balance: 425000,
      investments: ['ETF Portfolio', 'Individual Stocks', 'Municipal Bonds']
    }
  ],

  recentActions: [
    {
      id: 'action_001',
      type: 'goal_update',
      description: 'Increased 401k contribution rate to 15%',
      date: '2024-09-15',
      impact: 'On track to meet retirement goal 2 years early'
    },
    {
      id: 'action_002',
      type: 'rebalance',
      description: 'Rebalanced portfolio to target allocation',
      date: '2024-09-10', 
      impact: 'Reduced risk exposure by 5%'
    }
  ],

  insights: [
    {
      id: 'insight_001',
      type: 'opportunity',
      title: 'Roth Conversion Opportunity',
      description: 'Consider converting $25k from traditional IRA to Roth this year',
      priority: 'medium',
      potential_benefit: 'Tax-free growth for 15+ years'
    },
    {
      id: 'insight_002',
      type: 'risk',
      title: 'Emergency Fund Gap',
      description: 'Emergency fund is $15k below target amount',
      priority: 'high', 
      recommendation: 'Increase monthly savings by $500 for 10 months'
    }
  ]
};

export async function loadFamilyFixtures() {
  console.info('[fixtures.families] Loading family demo fixtures');
  
  const profile = FAMILY_DEMO_DATA.profile;
  
  // Generate receipt for financial plan
  const planReceipt = {
    id: `family_plan_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'financial_planning',
    policy_version: 'FAM-2024.09',
    inputs_hash: await Canonical.hash({ 
      family_id: profile.id, 
      goals: FAMILY_DEMO_DATA.goals,
      accounts: FAMILY_DEMO_DATA.accounts 
    }),
    reasons: ['GOALS_REALISTIC', 'RISK_APPROPRIATE', 'TIMELINE_FEASIBLE'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  // Generate receipt for portfolio rebalance
  const rebalanceReceipt = {
    id: `portfolio_rebalance_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'portfolio_rebalance', 
    policy_version: 'FAM-2024.09',
    inputs_hash: await Canonical.hash({ 
      family_id: profile.id,
      current_allocation: { stocks: 70, bonds: 25, alternatives: 5 },
      target_allocation: { stocks: 65, bonds: 30, alternatives: 5 }
    }),
    reasons: ['RISK_REDUCTION', 'AGE_APPROPRIATE', 'DIVERSIFICATION'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true, 
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  return {
    ...FAMILY_DEMO_DATA,
    receipts: [planReceipt, rebalanceReceipt]
  };
}

export function getFamilyGoals() {
  return FAMILY_DEMO_DATA.goals;
}

export function getFamilyAccounts() {
  return FAMILY_DEMO_DATA.accounts;
}

export function getFamilyInsights() {
  return FAMILY_DEMO_DATA.insights;
}

export function getFamilyRecentActions() {
  return FAMILY_DEMO_DATA.recentActions;
}