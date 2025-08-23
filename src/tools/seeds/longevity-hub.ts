// Longevity Hub seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedLongevityHub() {
  try {
    // Create sample longevity data
    const sampleData = {
      user_id: 'demo-user',
      health_metrics: {
        age: 45,
        bmi: 24.5,
        blood_pressure: '120/80',
        cholesterol: 180,
        exercise_frequency: 'regular',
        smoking_status: 'never',
        alcohol_consumption: 'moderate'
      },
      longevity_score: 85,
      life_expectancy: 87,
      recommendations: [
        'Maintain regular exercise routine',
        'Consider Mediterranean diet',
        'Schedule annual health screenings',
        'Optimize sleep quality'
      ],
      financial_impact: {
        healthcare_costs: 250000,
        long_term_care_probability: 0.65,
        recommended_insurance: 'long_term_care'
      },
      created_at: new Date().toISOString()
    };

    console.log('Seeded Longevity Hub demo data:', sampleData);
    
    // In a real implementation, you would insert into your database
    // await supabase.from('longevity_assessments').insert(sampleData);
    
    return true;
  } catch (error) {
    console.error('Failed to seed Longevity Hub data:', error);
    return false;
  }
}