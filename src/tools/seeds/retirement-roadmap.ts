/**
 * Seeder for retirement-roadmap tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedRetirementRoadmap() {
  try {
    // Create mock proof slips for the retirement roadmap tool
    const proofSlips = [
      {
        id: `rr-${Date.now()}-1`,
        type: 'Retirement Analysis',
        tool: 'retirement-roadmap',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          currentAge: 45,
          retirementAge: 65,
          currentSavings: 250000,
          monthlyContribution: 2000,
          projectedNeeded: 1200000
        }
      },
      {
        id: `rr-${Date.now()}-2`,
        type: 'Gap Analysis',
        tool: 'retirement-roadmap',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          shortfall: 150000,
          recommendedIncrease: 500,
          timeToGoal: 20
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded retirement-roadmap with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed retirement-roadmap:', error);
    return false;
  }
}