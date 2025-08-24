/**
 * Seeder for financial-poa tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedFinancialPoa() {
  try {
    // Create mock proof slips for the financial POA tool
    const proofSlips = [
      {
        id: `poa-${Date.now()}-1`,
        type: 'Authority Grant',
        tool: 'financial-poa',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          accountType: 'Checking Account',
          agent: 'Spouse',
          scope: 'Limited - Bill paying only',
          restrictions: 'No transfers over $5,000',
          duration: 'Until revoked',
          status: 'Active'
        }
      },
      {
        id: `poa-${Date.now()}-2`,
        type: 'POA Review',
        tool: 'financial-poa',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          existingPOAs: 2,
          needsUpdate: 1,
          missingAccounts: 3,
          recommendation: 'Consolidate and update',
          lastReview: '2023-06-15'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded financial-poa with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed financial-poa:', error);
    return false;
  }
}