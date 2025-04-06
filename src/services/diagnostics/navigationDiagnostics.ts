import { NavigationDiagnosticResult, NavigationTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

// Add the missing export for testAllNavigationRoutes
export const testAllNavigationRoutes = async (): Promise<NavigationTestResult[]> => {
  // Sample implementation that returns test results
  const results: NavigationTestResult[] = [
    {
      id: uuidv4(),
      route: '/',
      status: 'success',
      message: 'Homepage loads correctly',
      timestamp: Date.now(),
      recommendations: []
    },
    {
      id: uuidv4(),
      route: '/dashboard',
      status: 'success',
      message: 'Dashboard loads correctly',
      timestamp: Date.now(),
      recommendations: []
    },
    {
      id: uuidv4(),
      route: '/profile',
      status: 'warning',
      message: 'Profile page has slow loading components',
      timestamp: Date.now(),
      recommendations: [
        {
          id: uuidv4(),
          text: 'Optimize profile image loading',
          priority: 'medium',
          category: 'performance',
          actionable: true
        }
      ]
    },
    {
      id: uuidv4(),
      route: '/settings',
      status: 'error',
      message: 'Settings page has JS errors',
      timestamp: Date.now(),
      recommendations: [
        {
          id: uuidv4(),
          text: 'Fix JavaScript errors in settings form',
          priority: 'high',
          category: 'reliability',
          actionable: true
        }
      ]
    }
  ];
  
  return results;
};

// Existing function - update to add ids to results
export function runNavigationDiagnostics() {
  // Sample navigation diagnostics
  const results: NavigationDiagnosticResult[] = [
    {
      id: uuidv4(),
      route: '/',
      status: 'success',
      message: 'Homepage loads correctly'
    },
    {
      id: uuidv4(),
      route: '/dashboard',
      status: 'success',
      message: 'Dashboard loads without errors'
    },
    {
      id: uuidv4(),
      route: '/profile',
      status: 'warning',
      message: 'Profile page has performance issues'
    },
    {
      id: uuidv4(),
      route: '/settings',
      status: 'error',
      message: 'Settings page fails to load completely'
    },
    {
      id: uuidv4(),
      route: '/notfound',
      status: 'success',
      message: '404 page redirects correctly'
    }
  ];

  return {
    results,
    summary: {
      total: results.length,
      success: results.filter(r => r.status === 'success').length,
      warnings: results.filter(r => r.status === 'warning').length,
      errors: results.filter(r => r.status === 'error').length
    },
    timestamp: Date.now()
  };
}
