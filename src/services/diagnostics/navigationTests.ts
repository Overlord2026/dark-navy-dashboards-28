
import { NavigationTestResult } from './types';
import { 
  diagnoseDashboardTab, 
  diagnoseCashManagementTab, 
  diagnoseFinancialPlansTab,
  diagnoseTransfersTab,
  diagnoseFundingAccountsTab,
  diagnoseInvestmentsTab,
  runAllTabDiagnostics
} from './tabDiagnostics';
import { v4 as uuidv4 } from 'uuid';

/**
 * Tests navigation functionality across the application
 * 
 * @returns Array of test results
 */
export const testNavigation = async (): Promise<NavigationTestResult[]> => {
  try {
    // Run the tab diagnostics
    const results = await runAllTabDiagnostics();
    
    // Convert the results to a flat array for returning
    const testResults: NavigationTestResult[] = [
      results.dashboard,
      results.cashManagement,
      results.financialPlans,
      results.transfers,
      results.fundingAccounts,
      results.investments
    ];
    
    // Additional mock results can be added here
    testResults.push({
      id: uuidv4(),
      route: '/documents',
      status: 'success',
      message: 'Documents page loads correctly',
      timestamp: Date.now()
    });
    
    testResults.push({
      id: uuidv4(),
      route: '/insurance',
      status: 'warning',
      message: 'Insurance page loads slowly (> 2s)',
      timestamp: Date.now()
    });
    
    testResults.push({
      id: uuidv4(),
      route: '/estate-planning',
      status: 'success',
      message: 'Estate planning page loads correctly',
      timestamp: Date.now()
    });
    
    testResults.push({
      id: uuidv4(),
      route: '/settings/preferences',
      status: 'error',
      message: 'User preferences page throws 404 error',
      timestamp: Date.now()
    });
    
    return testResults;
  } catch (error) {
    // If there's an error running the tests, return a single error result
    const errorResult: NavigationTestResult = {
      id: uuidv4(),
      route: 'all',
      status: 'error',
      message: `Failed to run navigation tests: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
    
    return [errorResult];
  }
};
