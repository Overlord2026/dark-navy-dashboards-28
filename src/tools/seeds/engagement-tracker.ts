/**
 * Seeder for engagement-tracker tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedEngagementTracker() {
  try {
    // Create mock proof slips for the engagement tracker tool
    const proofSlips = [
      {
        id: `engage-${Date.now()}-1`,
        type: 'PM Task Add',
        tool: 'engagement-tracker',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          taskTitle: 'Complete Roth IRA conversion analysis',
          clientName: 'Sarah & Michael Chen',
          assignedTo: 'Senior Advisor',
          priority: 'High',
          dueDate: '2024-02-15',
          status: 'In Progress',
          category: 'Tax Planning'
        }
      },
      {
        id: `engage-${Date.now()}-2`,
        type: 'PM Task Add',
        tool: 'engagement-tracker',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          taskTitle: 'Review insurance coverage gaps',
          clientName: 'Sarah & Michael Chen',
          assignedTo: 'Insurance Specialist',
          priority: 'Medium',
          dueDate: '2024-02-20',
          status: 'Pending',
          category: 'Risk Management'
        }
      },
      {
        id: `engage-${Date.now()}-3`,
        type: 'Task Completed',
        tool: 'engagement-tracker',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        anchored: true,
        data: {
          taskTitle: 'Initial portfolio rebalancing',
          clientName: 'Sarah & Michael Chen',
          completedBy: 'Senior Advisor',
          completionDate: new Date(Date.now() - 86400000).toISOString(),
          outcome: 'Portfolio optimized for tax efficiency',
          timeSpent: '2.5 hours'
        }
      },
      {
        id: `engage-${Date.now()}-4`,
        type: 'Task Completed',
        tool: 'engagement-tracker',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        anchored: false,
        data: {
          taskTitle: 'Estate planning document review',
          clientName: 'Sarah & Michael Chen',
          completedBy: 'Estate Planning Attorney',
          completionDate: new Date(Date.now() - 172800000).toISOString(),
          outcome: 'Trust documents updated, beneficiaries confirmed',
          timeSpent: '1.5 hours'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded engagement-tracker with 4 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed engagement-tracker:', error);
    return false;
  }
}