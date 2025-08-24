/**
 * Seeder for proposal-report tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedProposalReport() {
  try {
    // Create mock proof slips for the proposal report tool
    const proofSlips = [
      {
        id: `proposal-${Date.now()}-1`,
        type: 'PM Proposal Export',
        tool: 'proposal-report',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          proposalType: 'Comprehensive Wealth Management',
          documentsGenerated: [
            'Investment Policy Statement',
            'Financial Plan Summary',
            'Fee Schedule',
            'Risk Assessment Report'
          ],
          totalPages: 47,
          deliveryMethod: 'Secure Portal + Print',
          advisor: 'Senior Advisor'
        }
      },
      {
        id: `proposal-${Date.now()}-2`,
        type: 'Proposal Created',
        tool: 'proposal-report',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          proposalId: 'PROP-2024-0156',
          services: ['Investment Management', 'Financial Planning', 'Tax Planning'],
          aum: 2400000,
          annualFee: 24000,
          feeStructure: '1.0% on first $1M, 0.75% thereafter',
          status: 'Ready for Review'
        }
      },
      {
        id: `proposal-${Date.now()}-3`,
        type: 'Compliance Review',
        tool: 'proposal-report',
        timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
        anchored: false,
        data: {
          proposalId: 'PROP-2024-0156',
          reviewer: 'Compliance Officer',
          status: 'Approved',
          disclosures: 'Complete',
          riskWarnings: 'Included',
          regulatoryCompliance: 'SEC/FINRA Compliant'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded proposal-report with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed proposal-report:', error);
    return false;
  }
}