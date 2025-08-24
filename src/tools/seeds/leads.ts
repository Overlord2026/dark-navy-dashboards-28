/**
 * Seeder for leads tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export default async function seedLeads() {
  try {
    // Create mock proof slips for the leads tool
    const proofSlips = [
      {
        id: `leads-${Date.now()}-1`,
        type: 'PM Lead Add',
        tool: 'leads',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          leadName: 'Sarah & Michael Chen',
          status: 'Qualified',
          source: 'Referral - Estate Attorney',
          netWorth: 2400000,
          priority: 'High',
          nextAction: 'Schedule discovery call',
          assignedTo: 'Senior Advisor'
        }
      },
      {
        id: `leads-${Date.now()}-2`,
        type: 'PM Lead Add',
        tool: 'leads',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          leadName: 'Robert Thompson',
          status: 'Nurturing',
          source: 'Digital Marketing',
          netWorth: 850000,
          priority: 'Medium',
          nextAction: 'Send educational materials',
          assignedTo: 'Junior Advisor'
        }
      },
      {
        id: `leads-${Date.now()}-3`,
        type: 'PM Lead Add',
        tool: 'leads',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        anchored: false,
        data: {
          leadName: 'Jennifer Martinez',
          status: 'Initial Contact',
          source: 'LinkedIn Outreach',
          netWorth: 1200000,
          priority: 'Medium',
          nextAction: 'Qualification call scheduled',
          assignedTo: 'Senior Advisor'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded leads with 3 proof slips');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed leads:', error);
    return false;
  }
}