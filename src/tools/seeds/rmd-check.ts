/**
 * Seeder for rmd-check tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedRmdCheck() {
  try {
    // Create mock proof slips for the RMD check tool
    const proofSlips = [
      {
        id: `rmd-${Date.now()}-1`,
        type: 'RMD Preview',
        tool: 'rmd-check',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          age: 74,
          accountType: '401k',
          balance: 485000,
          requiredDistribution: 18653,
          penalty: 0,
          timing: 'On schedule'
        }
      },
      {
        id: `rmd-${Date.now()}-2`,
        type: 'RMD Alert',
        tool: 'rmd-check',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          age: 73,
          accountType: 'Traditional IRA',
          balance: 125000,
          requiredDistribution: 4807,
          penalty: 2403.50,
          timing: 'Overdue - 6 months'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded rmd-check with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed rmd-check:', error);
    return false;
  }
}