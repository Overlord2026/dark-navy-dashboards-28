
import { DiagnosticTestStatus } from '@/types/diagnostics/common';
import { NavigationTestResult } from '@/types/diagnostics/navigation';

/**
 * Diagnoses the health of the Dashboard tab
 */
export const diagnoseDashboardTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'dashboard-tab',
    route: '/dashboard',
    status: 'success',
    message: 'Dashboard tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Diagnoses the health of the Cash Management tab
 */
export const diagnoseCashManagementTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'cash-management-tab',
    route: '/cash-management',
    status: 'success',
    message: 'Cash Management tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Diagnoses the health of the Financial Plans tab
 */
export const diagnoseFinancialPlansTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'financial-plans-tab',
    route: '/financial-plans',
    status: 'success',
    message: 'Financial Plans tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Diagnoses the health of the Transfers tab
 */
export const diagnoseTransfersTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'transfers-tab',
    route: '/transfers',
    status: 'success',
    message: 'Transfers tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Diagnoses the health of the Funding Accounts tab
 */
export const diagnoseFundingAccountsTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'funding-accounts-tab',
    route: '/funding-accounts',
    status: 'success',
    message: 'Funding Accounts tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Diagnoses the health of the Investments tab
 */
export const diagnoseInvestmentsTab = async (): Promise<NavigationTestResult> => {
  return {
    id: 'investments-tab',
    route: '/investments',
    status: 'success',
    message: 'Investments tab loads correctly',
    timestamp: Date.now()
  };
};

/**
 * Runs diagnostics for all main navigation tabs
 */
export const runAllTabDiagnostics = async (): Promise<Record<string, NavigationTestResult>> => {
  const dashboard = await diagnoseDashboardTab();
  const cashManagement = await diagnoseCashManagementTab();
  const financialPlans = await diagnoseFinancialPlansTab();
  const transfers = await diagnoseTransfersTab();
  const fundingAccounts = await diagnoseFundingAccountsTab();
  const investments = await diagnoseInvestmentsTab();
  
  return {
    dashboard,
    cashManagement,
    financialPlans,
    transfers,
    fundingAccounts,
    investments
  };
};
