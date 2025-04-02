
import * as tabDiagnostics from './tabDiagnostics';
import { NavigationTestResult } from './types';
import { logger } from '../logging/loggingService';

/**
 * Runs comprehensive tests on all application navigation routes
 * 
 * This function tests the accessibility and functionality of all navigation
 * routes in the application. It performs the following checks:
 * 
 * 1. Dashboard tab accessibility and rendering
 * 2. Cash Management tab accessibility and rendering
 * 3. Any additional tabs that have been registered with the tabDiagnostics module
 * 
 * Each route is tested for:
 * - Whether it can be navigated to
 * - Whether all components render correctly
 * - Whether any console errors occur during rendering
 * - API requests that occur during page load
 * 
 * @returns {Promise<NavigationTestResult[]>} An array of test results for all navigation routes
 * 
 * @example
 * // Basic usage
 * const results = await testNavigation();
 * console.log(results);
 * 
 * @example
 * // Using with real-time monitoring
 * function NavigationMonitor() {
 *   const [results, setResults] = useState([]);
 *   
 *   useEffect(() => {
 *     const runTests = async () => {
 *       const testResults = await testNavigation();
 *       setResults(testResults);
 *     };
 *     
 *     runTests();
 *     // Run tests every 5 minutes
 *     const interval = setInterval(runTests, 300000);
 *     return () => clearInterval(interval);
 *   }, []);
 *   
 *   // Render results...
 * }
 * 
 * @throws Will catch and log errors, but will attempt to continue testing
 *         other routes and return partial results when possible
 */
export const testNavigation = async (): Promise<NavigationTestResult[]> => {
  logger.info("Starting navigation tests", undefined, "NavigationTests");
  
  try {
    // Run individual tab diagnostics
    // We catch errors on each individual test to ensure one failure doesn't stop all tests
    const dashboardResult = await tabDiagnostics.diagnoseDashboardTab().catch(error => ({
      route: '/dashboard',
      status: 'error' as const,
      message: `Error testing dashboard tab: ${error instanceof Error ? error.message : 'Unknown error'}`
    }));
    
    const cashManagementResult = await tabDiagnostics.diagnoseCashManagementTab().catch(error => ({
      route: '/cash-management',
      status: 'error' as const,
      message: `Error testing cash management tab: ${error instanceof Error ? error.message : 'Unknown error'}`
    }));
    
    // Run all registered tab diagnostics
    // This will catch any new tabs that have been added through the tabDiagnostics module
    const allTabsResults = await tabDiagnostics.runAllTabDiagnostics().catch(error => {
      logger.error("Failed to run all tab diagnostics", error, "NavigationTests");
      // Fallback to just the dashboard result if the full test suite fails
      return { dashboard: dashboardResult };
    });
    
    // Compile results into a single array, removing duplicates
    const results: NavigationTestResult[] = [
      dashboardResult,
      cashManagementResult,
      
      // Add results from allTabsResults that aren't already included
      ...Object.values(allTabsResults)
        .filter(result => 
          result.route !== '/dashboard' && 
          result.route !== '/cash-management'
        )
    ];
    
    logger.info("Navigation tests completed", { 
      totalTests: results.length,
      successCount: results.filter(r => r.status === 'success').length,
      warningCount: results.filter(r => r.status === 'warning').length,
      errorCount: results.filter(r => r.status === 'error').length
    }, "NavigationTests");
    
    return results;
  } catch (error) {
    // Catch and log any unexpected errors in the testing process itself
    logger.error("Unexpected error in navigation tests", error, "NavigationTests");
    
    // Return a minimal result set with the error
    return [{
      route: 'navigation-tests',
      status: 'error',
      message: `Failed to run navigation tests: ${error instanceof Error ? error.message : 'Unknown error'}`
    }];
  }
};

/**
 * Developer Guide: Adding New Navigation Tests
 * 
 * When adding a new tab or feature to the application, you should add a
 * corresponding diagnostic test to ensure it's properly monitored.
 * 
 * Steps to add a new navigation test:
 * 
 * 1. In tabDiagnostics.ts, add a new diagnostic function for your tab:
 * 
 *    export const diagnoseNewFeatureTab = async (): Promise<NavigationDiagnosticResult> => {
 *      try {
 *        // Test logic for the new tab
 *        // Example: Check if the route is accessible, components render correctly, etc.
 *        return {
 *          route: '/new-feature',
 *          status: 'success',
 *          message: 'New Feature tab loaded successfully'
 *        };
 *      } catch (error) {
 *        return {
 *          route: '/new-feature',
 *          status: 'error',
 *          message: `Error loading New Feature tab: ${error instanceof Error ? error.message : 'Unknown error'}`
 *        };
 *      }
 *    };
 * 
 * 2. Add the new diagnostic function to the runAllTabDiagnostics function in tabDiagnostics.ts:
 * 
 *    export const runAllTabDiagnostics = async () => {
 *      // Run all diagnostic functions
 *      const dashboardResult = await diagnoseDashboardTab();
 *      const cashManagementResult = await diagnoseCashManagementTab();
 *      const newFeatureResult = await diagnoseNewFeatureTab();  // <-- Add your new function
 *      
 *      // Return the results object
 *      return {
 *        dashboard: dashboardResult,
 *        cashManagement: cashManagementResult,
 *        newFeature: newFeatureResult  // <-- Add your new result
 *      };
 *    };
 * 
 * 3. The testNavigation function will automatically include your new test
 *    in its results, no changes needed here!
 * 
 * Best Practices for Writing Navigation Tests:
 * 
 * - Always wrap your test logic in try/catch blocks to prevent one test from 
 *   breaking the entire diagnostics suite
 * - Include detailed error messages that explain what went wrong
 * - Test each critical component on the page, not just the route accessibility
 * - If relevant, test API dependencies that the route relies on
 * - For complex routes, consider breaking tests into smaller subtests
 */
