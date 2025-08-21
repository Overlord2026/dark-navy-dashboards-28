import { GoalType, Persona } from '@/types/goal';

export type Tier = 'basic' | 'advanced';

export interface GoalTemplate {
  id: string;
  type: GoalType;
  title: string;
  description: string;
  targetAmount?: number;
  imageUrl?: string;
  smartr: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
    rewards?: string;
  };
  monthlyContribution?: number;
  persona: Persona;
  tier: Tier;
}

const goalTemplates: GoalTemplate[] = [
  // Retiree Bucket List Templates
  {
    id: 'retiree-world-travel',
    type: 'bucket_list',
    title: 'World Travel Adventure',
    description: 'Explore the world and visit dream destinations during retirement',
    targetAmount: 50000,
    imageUrl: '/images/goals/world-travel.jpg',
    smartr: {
      specific: 'Save for a comprehensive world travel experience visiting 10 countries over 2 years',
      measurable: '$50,000 total budget covering flights, accommodations, meals, and activities',
      achievable: 'Based on current retirement income and planned travel timeline',
      relevant: 'Fulfilling lifelong dream to explore different cultures and destinations',
      timeBound: 'Complete funding within 3 years, begin travel in year 4 of retirement',
      rewards: 'Create lasting memories and experience diverse cultures around the world'
    },
    monthlyContribution: 1389,
    persona: 'retiree',
    tier: 'basic'
  },
  {
    id: 'retiree-legacy-home',
    type: 'bucket_list',
    title: 'Family Legacy Home',
    description: 'Purchase or renovate a family gathering place for generations',
    targetAmount: 200000,
    imageUrl: '/images/goals/legacy-home.jpg',
    smartr: {
      specific: 'Acquire and prepare a vacation home that can host family gatherings and be passed down',
      measurable: '$200,000 for down payment, renovations, and initial setup costs',
      achievable: 'Leveraging home equity and retirement savings over 5-year timeline',
      relevant: 'Creating a lasting legacy and central gathering place for family traditions',
      timeBound: 'Complete purchase and renovations within 5 years',
      rewards: 'Establish family traditions and create a tangible legacy for future generations'
    },
    monthlyContribution: 3333,
    persona: 'retiree',
    tier: 'basic'
  },

  // Advanced Tier Templates
  {
    id: 'equity-comp-strategy',
    type: 'savings',
    title: 'Equity Compensation Strategy',
    description: 'Optimize stock options, RSUs, and ESPP for maximum value',
    targetAmount: 500000,
    imageUrl: '/images/goals/equity-comp.jpg',
    smartr: {
      specific: 'Diversify and optimize equity compensation through strategic exercise and diversification',
      measurable: 'Accumulate $500,000 in diversified investments from equity compensation',
      achievable: 'Based on current vesting schedule and tax-efficient exercise strategies',
      relevant: 'Reduce concentration risk while maximizing after-tax value of equity compensation',
      timeBound: 'Complete diversification strategy over 4 years with quarterly reviews',
      rewards: 'Reduced portfolio risk and optimized tax efficiency from equity compensation'
    },
    monthlyContribution: 10417,
    persona: 'aspiring',
    tier: 'advanced'
  },
  {
    id: 'donor-advised-fund',
    type: 'custom',
    title: 'Donor Advised Fund',
    description: 'Establish a charitable giving strategy with tax advantages',
    targetAmount: 100000,
    imageUrl: '/images/goals/daf.jpg',
    smartr: {
      specific: 'Establish and fund a donor advised fund for strategic charitable giving',
      measurable: 'Contribute $100,000 to DAF over 3 years for ongoing charitable distributions',
      achievable: 'Using appreciated securities and tax-advantaged contribution strategies',
      relevant: 'Create sustainable charitable giving while optimizing tax benefits',
      timeBound: 'Fully fund DAF within 3 years, begin annual distributions in year 2',
      rewards: 'Make meaningful charitable impact while achieving significant tax benefits'
    },
    monthlyContribution: 2778,
    persona: 'aspiring',
    tier: 'advanced'
  },

  // Basic Templates for Both Personas
  {
    id: 'emergency-fund',
    type: 'emergency',
    title: 'Emergency Fund',
    description: '6 months of expenses for financial security',
    targetAmount: 30000,
    smartr: {
      specific: 'Build an emergency fund covering 6 months of essential expenses',
      measurable: '$30,000 in high-yield savings account',
      achievable: 'Save consistently from monthly budget allocation',
      relevant: 'Provides financial security and peace of mind for unexpected expenses',
      timeBound: 'Complete funding within 18 months',
      rewards: 'Financial security and ability to handle emergencies without debt'
    },
    monthlyContribution: 1667,
    persona: 'aspiring',
    tier: 'basic'
  },
  {
    id: 'retirement-savings',
    type: 'retirement',
    title: 'Retirement Savings',
    description: 'Build wealth for a comfortable retirement',
    targetAmount: 1000000,
    smartr: {
      specific: 'Accumulate retirement savings across 401k, IRA, and investment accounts',
      measurable: '$1,000,000 in retirement accounts by age 65',
      achievable: 'Consistent contributions with employer matching and compound growth',
      relevant: 'Essential for maintaining lifestyle and financial independence in retirement',
      timeBound: 'Reach target by retirement age through 30+ years of consistent saving',
      rewards: 'Financial freedom and ability to retire comfortably'
    },
    monthlyContribution: 2000,
    persona: 'aspiring',
    tier: 'basic'
  }
];

export function getTemplates(persona?: Persona, tier: Tier = 'basic'): GoalTemplate[] {
  let filtered = goalTemplates;

  if (persona) {
    filtered = filtered.filter(template => template.persona === persona);
  }

  // Include basic templates for all tiers, advanced only for advanced tier
  filtered = filtered.filter(template => 
    template.tier === 'basic' || (template.tier === 'advanced' && tier === 'advanced')
  );

  return filtered;
}

export function getTemplateById(id: string): GoalTemplate | undefined {
  return goalTemplates.find(template => template.id === id);
}

export function getTemplatesByType(type: GoalType, persona?: Persona, tier: Tier = 'basic'): GoalTemplate[] {
  return getTemplates(persona, tier).filter(template => template.type === type);
}

export function getBucketListTemplates(persona: Persona = 'retiree', tier: Tier = 'basic'): GoalTemplate[] {
  return getTemplatesByType('bucket_list', persona, tier);
}