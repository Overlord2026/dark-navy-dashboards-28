/**
 * Seeder for supervisor-dashboard tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedSupervisorDashboard() {
  try {
    // Create mock proof slips for the supervisor dashboard tool
    const proofSlips = [
      {
        id: `supervisor-${Date.now()}-1`,
        type: 'Supervision Export',
        tool: 'supervisor-dashboard',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          reportType: 'Compliance Pack',
          period: 'Q4 2023',
          itemsReviewed: 15,
          exceptions: 2,
          escalations: 0,
          reviewedBy: 'Chief Compliance Officer',
          status: 'Complete'
        }
      },
      {
        id: `supervisor-${Date.now()}-2`,
        type: 'Review Required',
        tool: 'supervisor-dashboard',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          itemType: 'Client Communication',
          advisor: 'Senior Advisor',
          clientName: 'Sarah & Michael Chen',
          riskLevel: 'Medium',
          reason: 'Investment recommendation outside model',
          dueDate: '2024-02-12',
          supervisor: 'Branch Manager'
        }
      },
      {
        id: `supervisor-${Date.now()}-3`,
        type: 'Review Required',
        tool: 'supervisor-dashboard',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          itemType: 'Trade Justification',
          advisor: 'Junior Advisor',
          clientName: 'Robert Thompson',
          riskLevel: 'Low',
          reason: 'Concentration limit exceeded',
          dueDate: '2024-02-10',
          supervisor: 'Senior Manager'
        }
      },
      {
        id: `supervisor-${Date.now()}-4`,
        type: 'Review Required',
        tool: 'supervisor-dashboard',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        anchored: false,
        data: {
          itemType: 'Fee Waiver Request',
          advisor: 'Senior Advisor',
          clientName: 'Jennifer Martinez',
          riskLevel: 'Low',
          reason: 'Client retention strategy',
          dueDate: '2024-02-14',
          supervisor: 'Regional Director'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded supervisor-dashboard with 4 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed supervisor-dashboard:', error);
    return false;
  }
}