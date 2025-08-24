import { setFlag } from '@/jobs/flags';

export default async function seedSupervisorDigestDemo() {
  console.log('[Seeds] Starting supervisor digest demo...');
  
  try {
    // Enable required flags
    setFlag('BACKGROUND_JOBS_ENABLED', true);
    setFlag('SUPERVISOR_DIGEST_ENABLED', true);
    localStorage.setItem('EMAIL_PROVIDER_ENABLED', 'false'); // Use stub for demo
    localStorage.setItem('SUPERVISOR_DIGEST_SEND_EMPTY', 'true');
    localStorage.setItem('SUPERVISOR_DIGEST_DEFAULT_HOUR_UTC', '13');
    
    // Create sample supervisor preferences
    const mockPrefs = [
      {
        userId: 'supervisor-1',
        firmId: 'firm-1',
        enabled: true,
        hourUtc: 13, // 8am ET
        personas: ['advisor', 'cpa', 'attorney'],
        sendEmpty: true
      },
      {
        userId: 'supervisor-2', 
        firmId: 'firm-1',
        enabled: true,
        hourUtc: 17, // 12pm ET
        personas: ['insurance', 'medicare', 'healthcare'],
        sendEmpty: false
      }
    ];
    
    localStorage.setItem('supervisor_prefs', JSON.stringify(mockPrefs));
    
    console.log(`[Seeds] Created ${mockPrefs.length} supervisor preferences`);
    
    return {
      preferences: mockPrefs.length,
      message: 'Supervisor digest demo loaded successfully'
    };
  } catch (error) {
    console.error('[Seeds] Failed to seed supervisor digest demo:', error);
    throw error;
  }
}