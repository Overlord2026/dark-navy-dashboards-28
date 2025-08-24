/**
 * Seeder for social-security tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedSocialSecurity() {
  try {
    // Create mock proof slips for the social security tool
    const proofSlips = [
      {
        id: `ss-${Date.now()}-1`,
        type: 'SS Timing Preview',
        tool: 'social-security',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          filingAge: 67,
          monthlyBenefit: 2850,
          earlyFilingAge: 62,
          earlyBenefit: 1995,
          delayedFilingAge: 70,
          delayedBenefit: 3762,
          recommendation: 'Consider delaying to age 70'
        }
      },
      {
        id: `ss-${Date.now()}-2`,
        type: 'Spousal Strategy',
        tool: 'social-security',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          primaryBenefit: 2850,
          spousalBenefit: 1425,
          strategy: 'File and suspend',
          lifetimeValue: 687500,
          optimization: 'Maximized family benefit'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded social-security with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed social-security:', error);
    return false;
  }
}