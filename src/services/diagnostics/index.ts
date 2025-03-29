
import { SystemHealthReport } from './types';
import { 
  checkNavigation, 
  checkForms, 
  checkDatabase, 
  checkAPI, 
  checkAuthentication 
} from './basicChecks';
import { testNavigationRoutes } from './navigationTests';
import { testPermissions } from './permissionTests';
import { testIcons } from './iconTests';
import { testFormValidation } from './formValidationTests';
import { testApiIntegrations } from './apiIntegrationTests';
import { testRoleSimulations } from './roleSimulationTests';

export * from './types';

export const runDiagnostics = async (): Promise<SystemHealthReport> => {
  // Check navigation
  const navigationResult = checkNavigation();
  
  // Check forms 
  const formsResult = checkForms();
  
  // Check database connectivity
  const databaseResult = checkDatabase();
  
  // Check API integrations
  const apiResult = checkAPI();
  
  // Check authentication
  const authResult = checkAuthentication();
  
  // Run navigation route tests
  const navigationTests = testNavigationRoutes();
  
  // Run permission validation tests
  const permissionsTests = testPermissions();
  
  // Run icon tests
  const iconTests = testIcons();
  
  // Run form validation tests
  const formValidationTests = testFormValidation();
  
  // Run API integration tests
  const apiIntegrationTests = testApiIntegrations();
  
  // Run role simulation tests
  const roleSimulationTests = testRoleSimulations();
  
  // Determine overall system health
  const statuses = [
    navigationResult.status, 
    formsResult.status,
    databaseResult.status,
    apiResult.status,
    authResult.status
  ];
  
  // Also consider the new test results
  const navTestStatuses = navigationTests.map(test => test.status);
  const permTestStatuses = permissionsTests.map(test => test.status);
  const iconTestStatuses = iconTests.map(test => test.status);
  const formValidationStatuses = formValidationTests.map(test => test.status);
  const apiIntegrationStatuses = apiIntegrationTests.map(test => test.status);
  const roleSimulationStatuses = roleSimulationTests.map(test => test.status);
  
  const allStatuses = [
    ...statuses,
    ...navTestStatuses,
    ...permTestStatuses,
    ...iconTestStatuses,
    ...formValidationStatuses,
    ...apiIntegrationStatuses,
    ...roleSimulationStatuses
  ];
  
  let overall: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (allStatuses.includes('error')) {
    overall = 'critical';
  } else if (allStatuses.includes('warning')) {
    overall = 'warning';
  }
  
  return {
    navigation: navigationResult,
    forms: formsResult,
    database: databaseResult,
    api: apiResult,
    authentication: authResult,
    navigationTests,
    permissionsTests,
    iconTests,
    formValidationTests,
    apiIntegrationTests,
    roleSimulationTests,
    overall,
    timestamp: new Date().toISOString()
  };
};
