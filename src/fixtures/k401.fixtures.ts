// 401k cohort demo fixtures
import * as Canonical from '@/lib/canonical';

export const K401_DEMO_DATA = {
  cohortAnalysis: {
    id: 'cohort_tech_2024',
    name: 'Technology Sector 401k Participants',
    size: 12847,
    demographics: {
      avg_age: 34.2,
      avg_tenure: 4.8,
      avg_salary: 125000,
      participation_rate: 0.87
    },
    benchmarks: {
      contribution_rate: {
        P10: 0.03,
        P25: 0.06,
        P50: 0.10,
        P75: 0.15,
        P90: 0.20
      },
      balance_by_age: {
        '20-29': { P50: 15000, P90: 45000 },
        '30-39': { P50: 85000, P90: 210000 },
        '40-49': { P50: 185000, P90: 425000 },
        '50-59': { P50: 315000, P90: 680000 },
        '60+': { P50: 485000, P90: 950000 }
      },
      allocation_trends: {
        target_date_funds: 0.42,
        index_funds: 0.28,
        company_stock: 0.08,
        bond_funds: 0.12,
        other: 0.10
      }
    }
  },

  userPosition: {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Alex Thompson',
    age: 32,
    tenure: 3.5,
    salary: 115000,
    contribution_rate: 0.12,
    employer_match: 0.06,
    current_balance: 68000,
    percentile_ranking: {
      contribution_rate: 65, // 65th percentile
      balance: 58, // 58th percentile  
      allocation_score: 72 // 72nd percentile
    }
  },

  recommendations: [
    {
      id: 'rec_001',
      type: 'contribution_increase',
      priority: 'high',
      title: 'Increase contribution to reach 75th percentile',
      description: 'Consider increasing from 12% to 15% to match top performers',
      potential_impact: '$42k additional retirement wealth',
      timeline: 'Immediate'
    },
    {
      id: 'rec_002',
      type: 'allocation_optimization',
      priority: 'medium', 
      title: 'Optimize asset allocation for age',
      description: 'Reduce bond allocation from 20% to 10% given young age',
      potential_impact: '0.8% higher expected annual return',
      timeline: 'Next rebalancing period'
    },
    {
      id: 'rec_003',
      type: 'catch_up_opportunity',
      priority: 'low',
      title: 'Consider Roth 401k for portion of contributions',
      description: 'Split contributions 70% traditional / 30% Roth for tax diversity',
      potential_impact: 'Tax-free withdrawals in retirement',
      timeline: 'Next enrollment period'
    }
  ],

  peerComparison: {
    similar_cohort: 'Tech workers, age 30-35, tenure 3-5 years',
    cohort_size: 2845,
    your_rank: 658, // out of 2845
    percentile: 77,
    top_performers_profile: {
      avg_contribution_rate: 0.18,
      avg_balance: 95000,
      common_allocations: ['Target Date 2055 (60%)', 'S&P 500 Index (25%)', 'International (15%)']
    }
  }
};

export async function loadK401Fixtures() {
  console.info('[fixtures.k401] Loading 401k cohort demo fixtures');
  
  const { cohortAnalysis, userPosition, recommendations } = K401_DEMO_DATA;
  
  // Generate receipt for cohort analysis
  const cohortReceipt = {
    id: `k401_cohort_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'cohort_analysis',
    policy_version: 'K401-2024.09',
    inputs_hash: await Canonical.hash({
      user_id: userPosition.id,
      cohort_id: cohortAnalysis.id,
      age: userPosition.age,
      tenure: userPosition.tenure,
      salary: userPosition.salary
    }),
    reasons: ['PEER_GROUP_IDENTIFIED', 'BENCHMARKS_CALCULATED', 'PRIVACY_PRESERVED'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  // Generate receipt for recommendations
  const recommendationReceipt = {
    id: `k401_recommendations_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'contribution_recommendations',
    policy_version: 'K401-2024.09',
    inputs_hash: await Canonical.hash({
      user_id: userPosition.id,
      current_contribution: userPosition.contribution_rate,
      current_balance: userPosition.current_balance,
      peer_benchmarks: cohortAnalysis.benchmarks
    }),
    reasons: ['OPTIMIZATION_OPPORTUNITY', 'AGE_APPROPRIATE', 'EMPLOYER_MATCH_MAXIMIZED'],
    result: 'approve',
    anchor_ref: {
      type: 'merkle_inclusion', 
      proof_ok: true,
      timestamp: new Date().toISOString()
    },
    ts: new Date().toISOString()
  };

  return {
    ...K401_DEMO_DATA,
    receipts: [cohortReceipt, recommendationReceipt]
  };
}

export function getCohortBenchmarks() {
  return K401_DEMO_DATA.cohortAnalysis.benchmarks;
}

export function getUserPosition() {
  return K401_DEMO_DATA.userPosition;
}

export function getRecommendations() {
  return K401_DEMO_DATA.recommendations;
}

export function getPeerComparison() {
  return K401_DEMO_DATA.peerComparison;
}

// Calculate user's position relative to cohort
export function calculatePositionMetrics(userContribution: number, userBalance: number, userAge: number) {
  const benchmarks = getCohortBenchmarks();
  
  // Find contribution percentile
  const contribPercentile = Object.entries(benchmarks.contribution_rate)
    .reverse()
    .find(([, value]) => userContribution >= value)?.[0] || 'P10';
  
  // Find balance percentile for age group
  const ageGroup = userAge < 30 ? '20-29' : 
                   userAge < 40 ? '30-39' :
                   userAge < 50 ? '40-49' :
                   userAge < 60 ? '50-59' : '60+';
                   
  const balanceBenchmark = benchmarks.balance_by_age[ageGroup];
  const balancePercentile = userBalance >= balanceBenchmark.P90 ? 'P90' :
                           userBalance >= balanceBenchmark.P50 ? 'P50' : 'Below P50';
  
  return {
    contribution_percentile: contribPercentile,
    balance_percentile: balancePercentile,
    age_group: ageGroup,
    recommendations_count: getRecommendations().length
  };
}