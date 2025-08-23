// Wealth Vault seeder
import { supabase } from '@/integrations/supabase/client';

export default async function seedWealthVault() {
  try {
    // Create sample vault data
    const sampleData = {
      user_id: 'demo-user',
      documents: [
        {
          type: 'will',
          title: 'Last Will and Testament',
          upload_date: new Date().toISOString(),
          secure_hash: 'demo-hash-123'
        },
        {
          type: 'trust',
          title: 'Family Trust Agreement',
          upload_date: new Date().toISOString(),
          secure_hash: 'demo-hash-456'
        },
        {
          type: 'insurance',
          title: 'Life Insurance Policy',
          upload_date: new Date().toISOString(),
          secure_hash: 'demo-hash-789'
        }
      ],
      access_log: [
        {
          action: 'document_uploaded',
          timestamp: new Date().toISOString(),
          details: 'Will uploaded and encrypted'
        }
      ],
      created_at: new Date().toISOString()
    };

    console.log('Seeded Wealth Vault demo data:', sampleData);
    
    // In a real implementation, you would insert into your database
    // await supabase.from('wealth_vault').insert(sampleData);
    
    return true;
  } catch (error) {
    console.error('Failed to seed Wealth Vault data:', error);
    return false;
  }
}