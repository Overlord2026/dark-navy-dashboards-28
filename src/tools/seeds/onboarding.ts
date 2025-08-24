/**
 * Seeder for onboarding tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedOnboarding() {
  try {
    // Create mock proof slips for the onboarding tool
    const proofSlips = [
      {
        id: `onboard-${Date.now()}-1`,
        type: 'PM Onboard Complete',
        tool: 'onboarding',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          documentsReceived: [
            'Financial Statements',
            'Tax Returns (3 years)',
            'Insurance Policies',
            'Investment Statements',
            'Estate Documents'
          ],
          riskProfile: 'Moderate Conservative',
          objectives: ['Retirement Planning', 'Tax Optimization', 'Estate Planning'],
          aum: 2400000,
          status: 'Complete'
        }
      },
      {
        id: `onboard-${Date.now()}-2`,
        type: 'KYC Verification',
        tool: 'onboarding',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          clientName: 'Sarah & Michael Chen',
          verificationType: 'Enhanced Due Diligence',
          documentsVerified: ['Driver License', 'Passport', 'Utility Bill'],
          riskRating: 'Low',
          complianceOfficer: 'Jane Smith',
          approvalDate: new Date().toISOString()
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded onboarding with 2 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed onboarding:', error);
    return false;
  }
}