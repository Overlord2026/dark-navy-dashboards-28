import { setFlag } from '@/jobs/flags';

export default async function seedSupervisorMonthlyDemo() {
  console.log('[Seeds] Starting supervisor monthly report demo...');
  
  try {
    // Enable required flags
    setFlag('BACKGROUND_JOBS_ENABLED', true);
    setFlag('SUPERVISOR_MONTHLY_ENABLED', true);
    localStorage.setItem('EMAIL_PROVIDER_ENABLED', 'false'); // Use stub for demo
    localStorage.setItem('SUPERVISOR_MONTHLY_DAY_UTC', '1');
    localStorage.setItem('SUPERVISOR_MONTHLY_HOUR_UTC', '13');
    localStorage.setItem('SUPERVISOR_MONTHLY_ATTACH_EVIDENCE', 'false');
    localStorage.setItem('ANCHOR_ON_MONTHLY_REPORT', 'true'); // Enable anchoring for demo
    
    // Create sample supervisor preferences with monthly settings
    const mockPrefs = [
      {
        userId: 'supervisor-1',
        firmId: 'firm-1',
        enabled: true,
        hourUtc: 13, // Daily digest
        personas: ['advisor', 'cpa', 'attorney'],
        sendEmpty: true,
        monthlyEnabled: true,
        monthlyDayUtc: 1,
        monthlyHourUtc: 13,
        attachEvidence: false,
        anchorReports: true
      },
      {
        userId: 'supervisor-2', 
        firmId: 'firm-1',
        enabled: true,
        hourUtc: 17, // Daily digest
        personas: ['insurance', 'medicare', 'healthcare'],
        sendEmpty: false,
        monthlyEnabled: true,
        monthlyDayUtc: 1,
        monthlyHourUtc: 17,
        attachEvidence: true,
        anchorReports: false
      }
    ];
    
    localStorage.setItem('supervisor_prefs', JSON.stringify(mockPrefs));
    
    console.log(`[Seeds] Created ${mockPrefs.length} supervisor monthly preferences`);
    
    return {
      preferences: mockPrefs.length,
      message: 'Supervisor monthly report demo loaded successfully'
    };
  } catch (error) {
    console.error('[Seeds] Failed to seed supervisor monthly demo:', error);
    throw error;
  }
}