
import { NavigationTestResult } from '@/types/diagnostics/navigation';
import { runAllTabDiagnostics } from './tabDiagnostics';

/**
 * Runs all navigation tests to check the health and performance of different routes
 * 
 * @returns Array of navigation test results
 */
export const runNavigationTests = (): NavigationTestResult[] => {
  // For now, this returns static test data
  // In a real implementation, you would test actual routes
  const results: NavigationTestResult[] = [
    {
      id: 'dashboard-test',
      route: '/dashboard',
      status: 'success',
      name: 'Dashboard',
      message: 'Dashboard route is accessible',
      timestamp: Date.now(),
      responseTime: 120
    },
    {
      id: 'accounts-test',
      route: '/accounts',
      status: 'success',
      name: 'Accounts',
      message: 'Accounts route is accessible',
      timestamp: Date.now(),
      responseTime: 145
    },
    {
      id: 'investments-test',
      route: '/investments',
      status: 'success',
      name: 'Investments',
      message: 'Investments route is accessible',
      timestamp: Date.now(),
      responseTime: 180
    },
    {
      id: 'documents-test',
      route: '/documents',
      status: 'warning',
      name: 'Documents',
      message: 'Documents route loads slow (>200ms)',
      timestamp: Date.now(),
      responseTime: 220
    }
  ];
  
  return results;
};

/**
 * Runs comprehensive diagnostics on all navigation routes
 * 
 * @returns Object containing test results for all navigation routes
 */
export const runComprehensiveNavigationTests = async (): Promise<Record<string, NavigationTestResult>> => {
  try {
    // Run tab diagnostics
    const tabResults = await runAllTabDiagnostics();
    
    // Additional tests could be added here
    
    return tabResults;
  } catch (error) {
    console.error("Error running navigation diagnostics:", error);
    throw error;
  }
};
