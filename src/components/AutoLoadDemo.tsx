import { useEffect } from 'react';
import { loadInvestorDemoFixtures } from '@/fixtures/demo';

export const AutoLoadDemo = () => {
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const shouldAutoLoad = localStorage.getItem('auto-load-demo') !== 'false';
    
    if (isDev && shouldAutoLoad) {
      // Auto-load demo fixtures in development
      loadInvestorDemoFixtures().catch(console.error);
    }
  }, []);

  return null;
};