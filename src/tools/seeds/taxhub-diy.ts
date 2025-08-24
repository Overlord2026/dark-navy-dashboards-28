/**
 * Seeder for taxhub-diy tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedTaxhubDiy() {
  try {
    // Create mock proof slips for the TaxHub DIY tool
    const proofSlips = [
      {
        id: `tax-${Date.now()}-1`,
        type: 'Tax Scenario',
        tool: 'taxhub-diy',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          scenario: 'Roth conversion optimization',
          currentYear: 2024,
          bracketAnalysis: '22% → 12%',
          conversionAmount: 75000,
          taxSavings: 7500,
          recommendation: 'Proceed with conversion'
        }
      },
      {
        id: `tax-${Date.now()}-2`,
        type: 'Step Receipt',
        tool: 'taxhub-diy',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          step: 'Step 3: Loss harvesting',
          action: 'Realized losses',
          amount: 12500,
          taxBenefit: 3125,
          carryforward: 8000,
          status: 'Completed'
        }
      },
      {
        id: `tax-${Date.now()}-3`,
        type: 'Multi-Year Plan',
        tool: 'taxhub-diy',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: false,
        data: {
          years: '2024-2028',
          totalSavings: 45000,
          strategies: 4,
          riskLevel: 'Conservative',
          reviewed: true
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded taxhub-diy with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed taxhub-diy:', error);
    return false;
  }
}