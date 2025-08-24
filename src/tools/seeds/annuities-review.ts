/**
 * Seeder for annuities-review tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedAnnuitiesReview() {
  try {
    // Create mock proof slips for the annuities review tool
    const proofSlips = [
      {
        id: `ar-${Date.now()}-1`,
        type: 'Annuity Analysis',
        tool: 'annuities-review',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          provider: 'Example Life Insurance Co.',
          productType: 'Fixed Indexed Annuity',
          premiumAmount: 100000,
          guaranteedRate: 3.5,
          capRate: 7.0,
          recommendation: 'Proceed with caution - high fees'
        }
      },
      {
        id: `ar-${Date.now()}-2`,
        type: 'Fee Analysis',
        tool: 'annuities-review',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        anchored: false,
        data: {
          managementFee: 1.25,
          surrenderPeriod: 8,
          liquidityScore: 3,
          complexityRating: 'High'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded annuities-review with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed annuities-review:', error);
    return false;
  }
}