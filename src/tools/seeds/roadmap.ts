/**
 * Seeder for advisor roadmap tool (reuses retirement-roadmap)
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedRoadmap() {
  try {
    // Create mock proof slips for the advisor roadmap tool
    const proofSlips = [
      {
        id: `roadmap-${Date.now()}-1`,
        type: 'Plan Saved',
        tool: 'roadmap',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          planType: 'Comprehensive Financial Plan',
          retirementAge: 62,
          currentAge: 45,
          currentSavings: 2400000,
          projectedRetirementIncome: 180000,
          confidenceLevel: '85%',
          advisor: 'Senior Advisor'
        }
      },
      {
        id: `roadmap-${Date.now()}-2`,
        type: 'Decision-RDS',
        tool: 'roadmap', 
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          decision: 'PLAN_SAVED',
          scenario: 'Base Case with 7% return',
          monteCarloRuns: 10000,
          successProbability: 0.85,
          shortfall: 0,
          recommendations: ['Increase 401k contribution', 'Roth conversions', 'Tax-loss harvesting']
        }
      },
      {
        id: `roadmap-${Date.now()}-3`,
        type: 'Gap Analysis',
        tool: 'roadmap',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: false,
        data: {
          clientName: 'Sarah & Michael Chen',
          currentTrajectory: 'On track',
          adjustmentsNeeded: 'Minor optimization',
          savingsRate: '22%',
          targetRate: '25%',
          timeToGoal: 17
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded roadmap with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed roadmap:', error);
    return false;
  }
}