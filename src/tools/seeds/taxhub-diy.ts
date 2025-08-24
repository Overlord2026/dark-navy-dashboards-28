/**
 * Seeder for taxhub-diy tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedTaxhubDiy() {
  try {
    // Create mock proof slips for the taxhub DIY tool
    const proofSlips = [
      {
        id: `th-${Date.now()}-1`,
        type: 'Tax Strategy Analysis',
        tool: 'taxhub-diy',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          taxYear: 2024,
          estimatedSavings: 8500,
          strategiesApplied: ['Roth Conversion', 'Tax-Loss Harvesting', 'HSA Maximization'],
          riskLevel: 'Conservative'
        }
      },
      {
        id: `th-${Date.now()}-2`,
        type: 'Deduction Optimization',
        tool: 'taxhub-diy',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          standardDeduction: 27700,
          itemizedDeductions: 31200,
          recommendation: 'Itemize - save $3,500',
          charitableGiving: 12000,
          stateLocalTax: 10000
        }
      },
      {
        id: `th-${Date.now()}-3`,
        type: 'Quarterly Planning',
        tool: 'taxhub-diy',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        anchored: false,
        data: {
          quarter: 'Q1 2024',
          estimatedPayments: 15000,
          withholdings: 45000,
          projectedRefund: 2100
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