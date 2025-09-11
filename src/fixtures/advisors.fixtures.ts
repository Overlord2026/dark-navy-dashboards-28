// Advisor demo fixtures
import * as Canonical from '@/lib/canonical';

export const ADVISOR_DEMO_DATA = {
  profile: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Sarah J. Financial',
    title: 'Senior Wealth Advisor',
    certifications: ['CFP®', 'CFA', 'CIMA®'],
    firm: 'Elite Wealth Partners',
    aum: 125000000,
    client_count: 48,
    years_experience: 12,
    specialties: ['Retirement Planning', 'Estate Planning', 'Tax Optimization']
  },
  
  clients: [
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'The Johnson Family',
      type: 'High Net Worth',
      aum: 2500000,
      relationship_start: '2020-03-15',
      risk_tolerance: 'Moderate',
      goals: ['Retirement in 10 years', 'College funding', 'Estate planning']
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Robert & Mary Chen',
      type: 'Ultra High Net Worth',
      aum: 8750000,
      relationship_start: '2018-11-20',
      risk_tolerance: 'Aggressive',
      goals: ['Wealth preservation', 'Tax efficiency', 'Legacy planning']
    }
  ],

  benchmarkData: {
    cohort_id: 'senior_advisors_2024',
    peer_group: 'wealth_management_12plus_years',
    quantiles: {
      P10: 75,  // 75 bps
      P50: 95,  // 95 bps  
      P90: 125  // 125 bps
    },
    your_fee: 85,  // 85 bps
    delta_bp: -10,  // 10 bps below median
    performance_rating: 'Above Average',
    proof_ok: true
  },

  meetings: [
    {
      id: 'meeting_001',
      client_name: 'Johnson Family',
      date: '2024-09-15',
      duration: 90,
      type: 'Quarterly Review',
      status: 'completed',
      recording_status: 'uploaded',
      summary_generated: true,
      action_items: 3
    },
    {
      id: 'meeting_002', 
      client_name: 'Chen Family',
      date: '2024-09-20',
      duration: 75,
      type: 'Tax Strategy Session',
      status: 'completed',
      recording_status: 'uploaded',
      summary_generated: true,
      action_items: 5
    }
  ],

  actionItems: [
    {
      id: 'action_001',
      client_id: '22222222-2222-2222-2222-222222222222',
      description: 'Review 401k allocation recommendations',
      due_date: '2024-09-25',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'action_002',
      client_id: '33333333-3333-3333-3333-333333333333', 
      description: 'Prepare estate planning documents for review',
      due_date: '2024-09-30',
      priority: 'medium',
      status: 'in_progress'
    }
  ]
};

export async function loadAdvisorFixtures() {
  console.info('[fixtures.advisors] Loading advisor demo fixtures');
  
  // Simulate loading advisor profile
  const profile = ADVISOR_DEMO_DATA.profile;
  
  // Generate receipt for advisor onboarding/compliance
  const complianceReceipt = {
    id: `advisor_compliance_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'compliance_check',
    policy_version: 'ADV-2024.09',
    inputs_hash: await Canonical.hash({ advisor_id: profile.id, certifications: profile.certifications }),
    reasons: ['CERTIFICATIONS_CURRENT', 'FIDUCIARY_CONFIRMED'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  // Generate receipt for fee benchmark
  const benchmarkReceipt = {
    id: `fee_benchmark_${Date.now()}`,
    type: 'Decision-RDS', 
    action: 'fee_benchmark',
    policy_version: 'ADV-2024.09',
    inputs_hash: await Canonical.hash(ADVISOR_DEMO_DATA.benchmarkData),
    reasons: ['PEER_GROUP_VALIDATED', 'COMPETITIVE_POSITIONING'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion', 
      proof_ok: true,
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  return {
    ...ADVISOR_DEMO_DATA,
    receipts: [complianceReceipt, benchmarkReceipt]
  };
}

export function getAdvisorBenchmarkData() {
  return ADVISOR_DEMO_DATA.benchmarkData;
}

export function getAdvisorClients() {
  return ADVISOR_DEMO_DATA.clients;
}

export function getAdvisorMeetings() {
  return ADVISOR_DEMO_DATA.meetings;
}

export function getAdvisorActionItems() {
  return ADVISOR_DEMO_DATA.actionItems;
}