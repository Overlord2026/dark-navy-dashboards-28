// Retirement Roadmap seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedRetirementRoadmap() {
  try {
    // Create sample retirement plan data
    const sampleData = {
      user_id: 'demo-user',
      current_age: 45,
      retirement_age: 65,
      current_savings: 250000,
      monthly_contribution: 2000,
      risk_tolerance: 'moderate',
      goals: [
        'Maintain current lifestyle in retirement',
        'Healthcare cost protection',
        'Legacy planning for children'
      ],
      created_at: new Date().toISOString()
    };

    console.log('Seeded Retirement Roadmap demo data:', sampleData);
    
    // In a real implementation, you would insert into your database
    // await supabase.from('retirement_plans').insert(sampleData);
    
    return true;
  } catch (error) {
    console.error('Failed to seed Retirement Roadmap data:', error);
    return false;
  }
}