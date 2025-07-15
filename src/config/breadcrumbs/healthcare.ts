// Healthcare breadcrumb configuration
export interface BreadcrumbItem {
  title: string;
  href: string;
}

export const healthcareBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/health': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/health' }
  ],
  '/health/records': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/health' },
    { title: 'Medical Records', href: '/health/records' }
  ],
  '/health/metrics': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/health' },
    { title: 'Health Metrics', href: '/health/metrics' }
  ],
  // Additional healthcare routes
  '/healthcare-dashboard': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' }
  ],
  '/healthcare-hsa-accounts': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'HSA Accounts', href: '/healthcare-hsa-accounts' }
  ],
  '/healthcare-savings': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Healthcare Savings', href: '/healthcare-savings' }
  ],
  '/healthcare-providers': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Healthcare Providers', href: '/healthcare-providers' }
  ],
  '/healthcare-medications': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Medications', href: '/healthcare-medications' }
  ],
  '/healthcare-supplements': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Supplements', href: '/healthcare-supplements' }
  ],
  '/healthcare-healthspan': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'HealthSpan Expansion', href: '/healthcare-healthspan' }
  ],
  '/healthcare-documents': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Healthcare Documents', href: '/healthcare-documents' }
  ],
  '/healthcare-knowledge': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Knowledge & Support', href: '/healthcare-knowledge' }
  ],
  '/healthcare-share-data': [
    { title: 'Home', href: '/' },
    { title: 'Health Dashboard', href: '/healthcare-dashboard' },
    { title: 'Share Data', href: '/healthcare-share-data' }
  ]
};

/**
 * Get breadcrumb items for a healthcare route
 */
export const getHealthcareBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  return healthcareBreadcrumbs[pathname] || [];
};

/**
 * Check if a route has healthcare breadcrumbs configured
 */
export const hasHealthcareBreadcrumbs = (pathname: string): boolean => {
  return pathname in healthcareBreadcrumbs;
};