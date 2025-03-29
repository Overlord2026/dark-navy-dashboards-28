
import { testBasicServices } from './basicChecks';
import { testNavigation } from './navigationTests';
import { testPermissions } from './permissionTests';
import { testIcons } from './iconTests';
import { testFormValidation } from './formValidationTests';
import { testApiIntegrations } from './apiIntegrationTests';
import { testRoleSimulations } from './roleSimulationTests';
import { runPerformanceTests } from './performanceTests';
import { DiagnosticTestStatus } from './types';

/**
 * Runs all system diagnostics and returns a comprehensive report
 */
export const runDiagnostics = async () => {
  // Core services
  const basicResults = await testBasicServices();
  
  // Detailed tests
  const navigationTests = await testNavigation();
  const permissionsTests = await testPermissions();
  const iconTests = await testIcons();
  const formValidationTests = await testFormValidation();
  const apiIntegrationTests = await testApiIntegrations();
  const roleSimulationTests = await testRoleSimulations();
  const performanceTests = await runPerformanceTests();
  
  // Determine overall status
  const allTests = [
    ...Object.values(basicResults).map(item => item.status),
    ...navigationTests.map(item => item.status),
    ...permissionsTests.map(item => item.status),
    ...iconTests.map(item => item.status),
    ...formValidationTests.map(item => item.status),
    ...apiIntegrationTests.map(item => item.status),
    ...roleSimulationTests.map(item => item.status),
    ...performanceTests.map(item => item.status),
  ];
  
  let overall: DiagnosticTestStatus = "success";
  if (allTests.includes("error")) {
    overall = "error";
  } else if (allTests.includes("warning")) {
    overall = "warning";
  }
  
  return {
    timestamp: new Date().toISOString(),
    overall,
    
    // Core services summaries
    ...basicResults,
    
    // Detailed test results
    navigationTests,
    permissionsTests,
    iconTests,
    formValidationTests,
    apiIntegrationTests,
    roleSimulationTests,
    performanceTests,
  };
};
