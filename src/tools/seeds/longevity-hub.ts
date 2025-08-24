// Longevity Hub seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedLongevityHub() {
  try {
    // Create mock proof slips for the longevity hub tool
    const proofSlips = [
      {
        id: `lh-${Date.now()}-1`,
        type: 'Longevity Protocol',
        tool: 'longevity-hub',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          protocol: 'Mediterranean Diet + Exercise',
          longevityScore: 85,
          lifeExpectancy: 87,
          healthSpan: 82,
          financialImpact: 250000,
          recommendations: 4
        }
      },
      {
        id: `lh-${Date.now()}-2`,
        type: 'Screening Due',
        tool: 'longevity-hub',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        anchored: true,
        data: {
          screening: 'Colonoscopy',
          dueDate: '2024-03-15',
          risk: 'Medium',
          prevention: 'Early detection',
          provider: 'Dr. Smith'
        }
      },
      {
        id: `lh-${Date.now()}-3`,
        type: 'Wearable Summary',
        tool: 'longevity-hub',
        timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        anchored: false,
        data: {
          period: 'Weekly',
          steps: 52500,
          activeMinutes: 210,
          sleepQuality: 'Good',
          hrv: 'Above average',
          trends: 'Improving'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded longevity-hub with 3 proof slips');
    return true;
  } catch (error) {
    console.error('Failed to seed Longevity Hub data:', error);
    return false;
  }
}