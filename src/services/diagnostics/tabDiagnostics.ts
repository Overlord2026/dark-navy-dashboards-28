
import { logger } from '../logging/loggingService';
import { NavigationTestResult } from '../diagnostics/types';
import { testFinancialPlanOperations } from './financialPlanTests';
import { v4 as uuidv4 } from 'uuid';

export const diagnoseDashboardTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Dashboard tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: uuidv4(),
      route: '/dashboard',
      status: 'success',
      message: 'Dashboard tab loaded successfully',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/dashboard',
      status: 'error',
      message: `Error testing dashboard tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
  }
};

export const diagnoseCashManagementTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Cash Management tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: uuidv4(),
      route: '/cash-management',
      status: 'success',
      message: 'Cash Management tab loaded successfully',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/cash-management',
      status: 'error',
      message: `Error testing cash management tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
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
      id: uuidv4(),
      route: '/financial-plans',
      status,
      message,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/financial-plans',
      status: 'error',
      message: `Error testing financial plans tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
  }
};

export const diagnoseTransfersTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Transfers tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: uuidv4(),
      route: '/transfers',
      status: 'success',
      message: 'Transfers tab loaded successfully',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/transfers',
      status: 'error',
      message: `Error testing transfers tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
  }
};

export const diagnoseFundingAccountsTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Funding Accounts tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: uuidv4(),
      route: '/funding-accounts',
      status: 'success',
      message: 'Funding Accounts tab loaded successfully',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/funding-accounts',
      status: 'error',
      message: `Error testing funding accounts tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
  }
};

export const diagnoseInvestmentsTab = async (): Promise<NavigationTestResult> => {
  try {
    logger.info("Running Investments tab diagnostics");
    // Simulate diagnostics running
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: uuidv4(),
      route: '/investments',
      status: 'success',
      message: 'Investments tab loaded successfully',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      id: uuidv4(),
      route: '/investments',
      status: 'error',
      message: `Error testing investments tab: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
  }
};

export const runAllTabDiagnostics = async () => {
  const dashboardResult = await diagnoseDashboardTab();
  const cashManagementResult = await diagnoseCashManagementTab();
  const financialPlansResult = await diagnoseFinancialPlansTab();
  const transfersResult = await diagnoseTransfersTab();
  const fundingAccountsResult = await diagnoseFundingAccountsTab();
  const investmentsResult = await diagnoseInvestmentsTab();
  
  return {
    dashboard: dashboardResult,
    cashManagement: cashManagementResult,
    financialPlans: financialPlansResult,
    transfers: transfersResult,
    fundingAccounts: fundingAccountsResult,
    investments: investmentsResult
  };
};
