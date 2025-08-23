// Annuities Review seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedAnnuitiesReview() {
  try {
    // Create sample annuity review data
    const sampleData = {
      user_id: 'demo-user',
      annuity_type: 'fixed_indexed',
      provider: 'Sample Insurance Co.',
      annual_premium: 50000,
      surrender_period: 7,
      fees: {
        management: 1.25,
        rider: 0.75,
        surrender: 8.5
      },
      review_status: 'pending_analysis',
      uploaded_documents: [
        'illustration.pdf',
        'prospectus.pdf'
      ],
      created_at: new Date().toISOString()
    };

    console.log('Seeded Annuities Review demo data:', sampleData);
    
    // In a real implementation, you would insert into your database
    // await supabase.from('annuity_reviews').insert(sampleData);
    
    return true;
  } catch (error) {
    console.error('Failed to seed Annuities Review data:', error);
    return false;
  }
}