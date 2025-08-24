/**
 * Seeder for consent-passport tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedConsentPassport() {
  try {
    // Create mock proof slips for the consent passport tool
    const proofSlips = [
      {
        id: `cp-${Date.now()}-1`,
        type: 'Surrogate Grant',
        tool: 'consent-passport',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          grantType: 'Minimum-necessary view',
          surrogate: 'Adult child',
          scope: 'Emergency medical decisions',
          duration: 'Until capacity restored',
          restrictions: 'No experimental treatments',
          status: 'Active'
        }
      },
      {
        id: `cp-${Date.now()}-2`,
        type: 'Healthcare Directive',
        tool: 'consent-passport',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          directiveType: 'Advance directive',
          preferences: 'Comfort care priority',
          durable: true,
          witnesses: 2,
          notarized: true,
          lastUpdated: '2024-01-10'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded consent-passport with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed consent-passport:', error);
    return false;
  }
}