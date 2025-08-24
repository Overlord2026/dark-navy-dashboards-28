import { recordReceipt } from '@/features/receipts/record';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'client' | 'closed';
  priority: 'high' | 'medium' | 'low';
  assets: number;
  notes: string;
  createdAt: string;
  lastContact?: string;
}

export interface ClientProfile {
  id: string;
  leadId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    dependents: number;
  };
  financialInfo: {
    annualIncome: number;
    totalAssets: number;
    totalDebt: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentExperience: 'beginner' | 'intermediate' | 'advanced';
  };
  goals: string[];
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Roadmap {
  id: string;
  clientId: string;
  phases: {
    id: string;
    name: string;
    duration: string;
    priority: 'high' | 'medium' | 'low';
    actions: string[];
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  createdAt: string;
  lastUpdated: string;
}

export interface Proposal {
  id: string;
  clientId: string;
  type: 'initial' | 'quarterly' | 'annual' | 'ad_hoc';
  title: string;
  recommendations: {
    category: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    implementation: string;
  }[];
  projectedOutcome: {
    timeframe: string;
    expectedReturn: number;
    riskLevel: string;
  };
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export async function seedAdvisorWorkspace() {
  // Create demo leads
  const leads: Lead[] = [
    {
      id: 'lead_1',
      firstName: 'Jennifer',
      lastName: 'Chen',
      email: 'jennifer.chen@email.com',
      phone: '(555) 123-4567',
      source: 'referral',
      status: 'qualified',
      priority: 'high',
      assets: 2500000,
      notes: 'Referred by existing client. Looking for comprehensive wealth management.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lead_2',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'mrodriguez@company.com',
      phone: '(555) 987-6543',
      source: 'website',
      status: 'new',
      priority: 'medium',
      assets: 1200000,
      notes: 'Business owner interested in retirement planning strategies.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lead_3',
      firstName: 'Sarah',
      lastName: 'Thompson',
      email: 'sarah.t@email.com',
      phone: '(555) 456-7890',
      source: 'linkedin',
      status: 'contacted',
      priority: 'high',
      assets: 3800000,
      notes: 'Recently divorced, needs comprehensive financial restructuring.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Create client profiles for onboarded leads
  const clientProfiles: ClientProfile[] = [
    {
      id: 'client_1',
      leadId: 'lead_1',
      personalInfo: {
        firstName: 'Jennifer',
        lastName: 'Chen',
        dateOfBirth: '1978-03-15',
        maritalStatus: 'married',
        dependents: 2
      },
      financialInfo: {
        annualIncome: 450000,
        totalAssets: 2500000,
        totalDebt: 320000,
        riskTolerance: 'moderate',
        investmentExperience: 'intermediate'
      },
      goals: [
        'Retirement planning for age 60',
        'Children\'s college funding',
        'Tax optimization strategies',
        'Estate planning'
      ],
      onboardingComplete: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Create roadmaps
  const roadmaps: Roadmap[] = [
    {
      id: 'roadmap_1',
      clientId: 'client_1',
      phases: [
        {
          id: 'phase_1',
          name: 'Financial Foundation',
          duration: '3 months',
          priority: 'high',
          actions: [
            'Emergency fund optimization',
            'Debt restructuring plan',
            'Insurance coverage review',
            'Estate planning basics'
          ],
          status: 'completed'
        },
        {
          id: 'phase_2',
          name: 'Investment Strategy',
          duration: '6 months',
          priority: 'high',
          actions: [
            'Asset allocation review',
            'Tax-advantaged account maximization',
            'Investment policy statement',
            'Portfolio rebalancing'
          ],
          status: 'in_progress'
        },
        {
          id: 'phase_3',
          name: 'Advanced Planning',
          duration: '12 months',
          priority: 'medium',
          actions: [
            'Trust structure evaluation',
            'Tax optimization strategies',
            'Succession planning',
            'Charitable giving strategy'
          ],
          status: 'pending'
        }
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Create proposals
  const proposals: Proposal[] = [
    {
      id: 'proposal_1',
      clientId: 'client_1',
      type: 'initial',
      title: 'Comprehensive Wealth Management Strategy',
      recommendations: [
        {
          category: 'Asset Allocation',
          description: 'Diversified portfolio with 70% equity, 25% fixed income, 5% alternatives',
          priority: 'high',
          implementation: 'Immediate rebalancing over 30 days'
        },
        {
          category: 'Tax Planning',
          description: 'Maximize 401(k) and backdoor Roth IRA contributions',
          priority: 'high',
          implementation: 'Implement before year-end'
        },
        {
          category: 'Estate Planning',
          description: 'Revocable living trust with tax-efficient wealth transfer strategies',
          priority: 'medium',
          implementation: 'Complete within 6 months'
        }
      ],
      projectedOutcome: {
        timeframe: '10 years',
        expectedReturn: 8.5,
        riskLevel: 'Moderate'
      },
      status: 'sent',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Store in localStorage for demo
  localStorage.setItem('advisor_leads', JSON.stringify(leads));
  localStorage.setItem('advisor_clients', JSON.stringify(clientProfiles));
  localStorage.setItem('advisor_roadmaps', JSON.stringify(roadmaps));
  localStorage.setItem('advisor_proposals', JSON.stringify(proposals));

  // Create proof slips for advisor workflow
  const now = new Date().toISOString();
  
  // Lead management proof
  recordReceipt({
    id: `advisor_lead_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['LEAD_QUALIFIED'],
    created_at: now
  } as any);

  // Client onboarding proof
  recordReceipt({
    id: `advisor_onboard_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['CLIENT_ONBOARDED'],
    created_at: now
  } as any);

  // Roadmap creation proof
  recordReceipt({
    id: `advisor_roadmap_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['ROADMAP_CREATED'],
    created_at: now
  } as any);

  // Proposal generation proof
  recordReceipt({
    id: `advisor_proposal_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['PROPOSAL_GENERATED'],
    created_at: now
  } as any);

  // Supervisor review proof
  recordReceipt({
    id: `advisor_review_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['SUPERVISOR_REVIEWED'],
    created_at: now
  } as any);

  return {
    leads,
    clients: clientProfiles,
    roadmaps,
    proposals
  };
}

export function getAdvisorLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem('advisor_leads') || '[]');
  } catch {
    return [];
  }
}

export function getAdvisorClients(): ClientProfile[] {
  try {
    return JSON.parse(localStorage.getItem('advisor_clients') || '[]');
  } catch {
    return [];
  }
}

export function getAdvisorRoadmaps(): Roadmap[] {
  try {
    return JSON.parse(localStorage.getItem('advisor_roadmaps') || '[]');
  } catch {
    return [];
  }
}

export function getAdvisorProposals(): Proposal[] {
  try {
    return JSON.parse(localStorage.getItem('advisor_proposals') || '[]');
  } catch {
    return [];
  }
}