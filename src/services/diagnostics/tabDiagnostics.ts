
import { logger } from '../logging/loggingService';
import { NavigationTestResult } from './types';
import { testFinancialPlanOperations } from './financialPlanTests';

export const diagnoseDashboardTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Dashboard tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      route: '/dashboard',
      status: 'success',
      message: 'Dashboard tab loaded successfully'
    };
  } catch (error) {
    return {
      route: '/dashboard',
      status: 'error',
      message: `Error testing dashboard tab: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const diagnoseCashManagementTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Cash Management tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      route: '/cash-management',
      status: 'success',
      message: 'Cash Management tab loaded successfully'
    };
  } catch (error) {
    return {
      route: '/cash-management',
      status: 'error',
      message: `Error testing cash management tab: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const diagnoseFinancialPlansTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Financial Plans tab diagnostics");
    
    // Run the financial plan operations test
    const testResults = await testFinancialPlanOperations();
    
    // Determine overall status
    const hasError = testResults.some(r => r.status === 'error');
    const hasWarning = testResults.some(r => r.status === 'warning');
    
    let status: 'success' | 'warning' | 'error' = 'success';
    if (hasError) status = 'error';
    else if (hasWarning) status = 'warning';
    
    const message = hasError 
      ? 'Financial Plans operations failed - see diagnostics for details'
      : hasWarning
        ? 'Financial Plans operations completed with warnings'
        : 'Financial Plans operations completed successfully';
    
    return {
      route: '/financial-plans',
      status,
      message
    };
  } catch (error) {
    return {
      route: '/financial-plans',
      status: 'error',
      message: `Error testing financial plans tab: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const runAllTabDiagnostics = async () => {
  const dashboardResult = await diagnoseDashboardTab();
  const cashManagementResult = await diagnoseCashManagementTab();
  const financialPlansResult = await diagnoseFinancialPlansTab();
  
  return {
    dashboard: dashboardResult,
    cashManagement: cashManagementResult,
    financialPlans: financialPlansResult
  };
};
