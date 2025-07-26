
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalyticsTracking } from './useAnalytics';

// Page name mapping for cleaner analytics
const PAGE_NAMES: Record<string, string> = {
  '/': 'Welcome Page',
  '/welcome': 'Welcome Page',
  '/login': 'Login',
  '/auth': 'Authentication',
  '/scorecard': 'Retirement Confidence Scorecard',
  '/calculator': 'Fee Impact Calculator',
  '/gap-analyzer': 'Income Gap Analyzer',
  '/roadmap-info': 'Retirement Roadmap Info',
  '/dashboard': 'Client Dashboard',
  '/advisor-dashboard': 'Advisor Dashboard',
  '/admin-portal': 'Admin Portal',
  '/admin-portal/settings': 'Admin Settings',
  '/onboarding': 'Client Onboarding',
  '/advisor-onboarding': 'Advisor Onboarding',
  '/professionals': 'Service Professionals',
  '/documents': 'Document Management',
  '/investments': 'Investment Opportunities',
  '/calculators': 'Financial Calculators',
  '/marketplace': 'Family Office Marketplace'
};

export const usePageTracking = () => {
  const location = useLocation();
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    const pageName = PAGE_NAMES[location.pathname] || location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    trackPageView(pageName, {
      path: location.pathname,
      search: location.search,
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      referrer: document.referrer || 'direct'
    });
  }, [location, trackPageView]);
};
