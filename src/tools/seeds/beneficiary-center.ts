/**
 * Seeder for beneficiary-center tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedBeneficiaryCenter() {
  try {
    // Create mock proof slips for the beneficiary center tool
    const proofSlips = [
      {
        id: `bc-${Date.now()}-1`,
        type: 'Beneficiary Warning',
        tool: 'beneficiary-center',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          account: '401k - Primary',
          issue: 'Outdated beneficiary',
          risk: 'High',
          currentBeneficiary: 'Ex-spouse',
          suggestedUpdate: 'Current spouse',
          impact: 'Estate planning conflict'
        }
      },
      {
        id: `bc-${Date.now()}-2`,
        type: 'Fix Suggestion',
        tool: 'beneficiary-center',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          account: 'Life Insurance Policy',
          suggestion: 'Add contingent beneficiary',
          benefit: 'Avoid probate',
          priority: 'Medium',
          estimatedTime: '15 minutes',
          status: 'Pending'
        }
      },
      {
        id: `bc-${Date.now()}-3`,
        type: 'Compliance Check',
        tool: 'beneficiary-center',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: false,
        data: {
          accountsReviewed: 8,
          mismatches: 2,
          missing: 1,
          upToDate: 5,
          lastReview: '2024-01-15'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded beneficiary-center with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed beneficiary-center:', error);
    return false;
  }
}