// TaxHub DIY seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedTaxhubDiy() {
  try {
    // Create sample tax data
    const sampleData = {
      user_id: 'demo-user',
      tax_year: 2024,
      filing_status: 'married_filing_jointly',
      income_sources: [
        {
          type: 'w2',
          amount: 120000,
          source: 'Primary Employment'
        },
        {
          type: 'investment',
          amount: 15000,
          source: 'Dividend Income'
        }
      ],
      deductions: [
        {
          type: 'mortgage_interest',
          amount: 18000
        },
        {
          type: 'charitable',
          amount: 5000
        }
      ],
      estimated_refund: 3500,
      optimization_opportunities: [
        'Consider Roth IRA conversion',
        'Increase 401k contribution',
        'Tax-loss harvesting potential'
      ],
      created_at: new Date().toISOString()
    };

    console.log('Seeded TaxHub DIY demo data:', sampleData);
    
    // In a real implementation, you would insert into your database
    // await supabase.from('tax_returns').insert(sampleData);
    
    return true;
  } catch (error) {
    console.error('Failed to seed TaxHub DIY data:', error);
    return false;
  }
}