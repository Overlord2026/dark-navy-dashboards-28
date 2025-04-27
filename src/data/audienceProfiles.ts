
import { AudienceProfile } from '@/types/audience';

export const aspiringWealthyProfile: AudienceProfile = {
  id: 'aspiring',
  name: 'Aspiring Wealthy',
  description: 'Professionals building wealth with high income potential, focused on growth and establishing financial foundations.',
  icon: '📈',
  segment: 'aspiring',
  minimumNetWorth: 250000,
  recommendedServices: [
    'Investment Portfolio Building',
    'Financial Goal Planning',
    'Tax Optimization Strategies',
    'Educational Resources',
    'Basic Estate Planning'
  ],
  commonGoals: [
    'Building investment portfolio',
    'Saving for home purchase',
    'Starting college funds',
    'Career advancement',
    'Debt management'
  ],
  primaryChallenges: [
    'Balancing growth with security',
    'Managing student loan debt',
    'Building emergency reserves',
    'Maximizing tax advantages',
    'Starting retirement planning'
  ],
  recommendedContent: [
    {
      id: 'a1',
      title: 'Building Your First Portfolio',
      type: 'article',
      description: 'Learn the fundamentals of creating a diversified investment portfolio.'
    },
    {
      id: 'a2',
      title: 'Tax Strategies for Rising Professionals',
      type: 'webinar',
      description: 'Maximize deductions and minimize tax burden as your income grows.'
    },
    {
      id: 'a3',
      title: 'Emergency Fund Calculator',
      type: 'tool',
      description: 'Determine how much you should save for unexpected expenses.'
    }
  ]
};

export const retireeProfile: AudienceProfile = {
  id: 'retiree',
  name: 'Retirees',
  description: 'Individuals in or approaching retirement, focused on income preservation, healthcare planning, and legacy.',
  icon: '🏖️',
  segment: 'retiree',
  minimumNetWorth: 1000000,
  recommendedServices: [
    'Retirement Income Strategies',
    'Estate Planning',
    'Healthcare Planning',
    'Tax-Efficient Withdrawals',
    'Legacy Planning'
  ],
  commonGoals: [
    'Generating reliable income',
    'Minimizing taxes in retirement',
    'Managing healthcare costs',
    'Legacy planning',
    'Protection from market volatility'
  ],
  primaryChallenges: [
    'Longevity risk',
    'Healthcare expenses',
    'Market downturns',
    'Tax-efficient withdrawals',
    'Estate planning complexity'
  ],
  recommendedContent: [
    {
      id: 'r1',
      title: 'Optimizing Social Security Benefits',
      type: 'video',
      description: 'Strategies for maximizing your lifetime benefits.'
    },
    {
      id: 'r2',
      title: 'Healthcare in Retirement',
      type: 'webinar',
      description: 'Understanding Medicare, supplemental insurance, and long-term care options.'
    },
    {
      id: 'r3',
      title: 'Creating a Sustainable Withdrawal Plan',
      type: 'tool',
      description: 'Calculate how to make your retirement savings last.'
    }
  ]
};

export const uhnwProfile: AudienceProfile = {
  id: 'uhnw',
  name: 'Ultra-High Net Worth',
  description: 'Individuals with significant wealth requiring sophisticated planning, family governance, and complex asset management.',
  icon: '💎',
  segment: 'uhnw',
  minimumNetWorth: 10000000,
  recommendedServices: [
    'Family Office Services',
    'Advanced Tax Planning',
    'Private Banking',
    'Custom Investment Solutions',
    'Multi-Generational Wealth Transfer'
  ],
  commonGoals: [
    'Dynasty planning',
    'Family governance',
    'Philanthropy',
    'Business succession',
    'Asset protection'
  ],
  primaryChallenges: [
    'Complex tax situations',
    'Family dynamics',
    'Privacy concerns',
    'Business succession',
    'Concentrated wealth positions'
  ],
  recommendedContent: [
    {
      id: 'u1',
      title: 'Family Governance Structures',
      type: 'article',
      description: 'Building frameworks for multi-generational wealth management.'
    },
    {
      id: 'u2',
      title: 'Advanced Charitable Giving Strategies',
      type: 'webinar',
      description: 'Optimize giving for maximum impact and tax efficiency.'
    },
    {
      id: 'u3',
      title: 'Private Investment Opportunities',
      type: 'service',
      description: 'Access to exclusive alternative investments.'
    }
  ]
};

export const audienceProfiles = {
  aspiring: aspiringWealthyProfile,
  retiree: retireeProfile,
  uhnw: uhnwProfile
};
