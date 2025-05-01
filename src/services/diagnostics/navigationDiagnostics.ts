
import { NavigationTestResult } from '@/types/diagnostics/navigation';
import { runNavigationTests } from './navigationTests';

/**
 * Returns a summary of navigation diagnostics
 */
export const getNavigationDiagnosticsSummary = async () => {
  const results = runNavigationTests();
  
  // Calculate summary statistics
  const totalRoutes = results.length;
  const successCount = results.filter(r => r.status === "success").length;
  const warningCount = results.filter(r => r.status === "warning").length;
  const errorCount = results.filter(r => r.status === "error").length;
  
  let overallStatus: "success" | "warning" | "error" = "success";
  if (errorCount > 0) {
    overallStatus = "error";
  } else if (warningCount > 0) {
    overallStatus = "warning";
  }
  
  return {
    results: {
      routeTests: results
    },
    totalRoutes,
    successCount,
    warningCount,
    errorCount,
    overallStatus,
    timestamp: Date.now()
  };
};

/**
 * Tests all navigation routes and returns results grouped by category
 */
export const testAllNavigationRoutes = async (): Promise<Record<string, NavigationTestResult[]>> => {
  const results = runNavigationTests();
  
  // Group tests by categories (can be expanded as needed)
  return {
    main: results.filter(r => ['/dashboard', '/', '/home'].includes(r.route)),
    accounts: results.filter(r => r.route.includes('/account') || r.route.includes('/funding')),
    investments: results.filter(r => r.route.includes('/investment') || r.route.includes('/portfolio')),
    documents: results.filter(r => r.route.includes('/document')),
    other: results.filter(r => 
      !['/dashboard', '/', '/home'].includes(r.route) && 
      !r.route.includes('/account') && 
      !r.route.includes('/funding') &&
      !r.route.includes('/investment') && 
      !r.route.includes('/portfolio') &&
      !r.route.includes('/document')
    )
  };
};
