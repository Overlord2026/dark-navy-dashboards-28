/**
 * Seeder for roth-ladder tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedRothLadder() {
  try {
    // Create mock proof slips for the Roth ladder tool
    const proofSlips = [
      {
        id: `rl-${Date.now()}-1`,
        type: 'Roth Plan',
        tool: 'roth-ladder',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          conversionPeriod: '5 years',
          annualConversion: 50000,
          totalConverted: 250000,
          taxSavings: 37500,
          strategy: 'Systematic ladder',
          startYear: 2024
        }
      },
      {
        id: `rl-${Date.now()}-2`,
        type: 'Tax Bracket Analysis',
        tool: 'roth-ladder',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        anchored: true,
        data: {
          currentBracket: '22%',
          projectedBracket: '12%',
          conversionWindow: 'Years 60-65',
          taxDeferral: 62500,
          recommendation: 'Accelerate conversions'
        }
      },
      {
        id: `rl-${Date.now()}-3`,
        type: 'Multi-Year Schedule',
        tool: 'roth-ladder',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        anchored: false,
        data: {
          year1: 45000,
          year2: 50000,
          year3: 55000,
          year4: 50000,
          year5: 45000,
          totalPlan: 245000
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded roth-ladder with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed roth-ladder:', error);
    return false;
  }
}