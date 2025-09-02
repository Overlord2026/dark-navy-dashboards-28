import { useEffect } from 'react';
import { loadInvestorDemoFixtures } from '@/fixtures/demo';
import { demoService } from '@/services/demoService';
import { CONFIG } from '@/config/flags';

export const AutoLoadDemo = () => {
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const shouldAutoLoad = localStorage.getItem('auto-load-demo') !== 'false';
    
    if ((isDev && shouldAutoLoad) || CONFIG.DEMO_MODE) {
      // Auto-load demo fixtures in development or demo mode
      Promise.all([
        loadInvestorDemoFixtures(),
        demoService.loadAllFixtures()
      ]).catch(console.error);
      
      console.log('[AutoLoadDemo] Demo mode enabled, fixtures loaded');
    }
  }, []);

  return null;
};