
import { testBasicServices } from './basicChecks';
import { testNavigation } from './navigationTests';
import { testPermissions } from './permissionTests';
import { testIcons } from './iconTests';
import { testFormValidation } from './formValidationTests';
import { testApiIntegrations } from './apiIntegrationTests';
import { testRoleSimulations } from './roleSimulationTests';
import { runPerformanceTests } from './performanceTests';
import { runSecurityTests } from './securityTests';
import { DiagnosticTestStatus } from './types';
import { logger } from '../logging/loggingService';
import { auditLog } from '../auditLog/auditLogService';

/**
 * Runs all system diagnostics and returns a comprehensive report
 */
export const runDiagnostics = async () => {
  logger.info("Starting system diagnostics", undefined, "DiagnosticService");
  
  // Log this diagnostic run in the audit log
  auditLog.log(
    "system", 
    "settings_change", 
    "success",
    {
      userName: "System",
      userRole: "system",
      resourceType: "diagnostics",
      details: { action: "Run system diagnostics" }
    }
  );
  
  try {
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
    const securityTests = await runSecurityTests();
    
    // Determine overall status
    const allTests = [
      ...Object.values(basicResults).map((item: any) => item.status),
      ...navigationTests.map(item => item.status),
      ...permissionsTests.map(item => item.status),
      ...iconTests.map(item => item.status),
      ...formValidationTests.map(item => item.status),
      ...apiIntegrationTests.map(item => item.status),
      ...roleSimulationTests.map(item => item.status),
      ...performanceTests.map(item => item.status),
      ...securityTests.map(item => item.status),
    ];
    
    let overall: DiagnosticTestStatus = "success";
    if (allTests.includes("error")) {
      overall = "error";
    } else if (allTests.includes("warning")) {
      overall = "warning";
    }
    
    const diagnosticReport = {
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
      securityTests,
    };
    
    logger.info("Diagnostics completed successfully", { overall }, "DiagnosticService");
    
    // Record the completion in the audit log with the overall status
    auditLog.log(
      "system", 
      "settings_change", 
      "success",
      {
        userName: "System",
        userRole: "system",
        resourceType: "diagnostics",
        details: { 
          action: "Complete system diagnostics",
          result: overall,
          testsConducted: allTests.length
        }
      }
    );
    
    return diagnosticReport;
  } catch (error) {
    logger.error("Error running diagnostics", error, "DiagnosticService");
    
    // Record the failure in the audit log
    auditLog.log(
      "system", 
      "settings_change", 
      "failure",
      {
        userName: "System",
        userRole: "system",
        resourceType: "diagnostics",
        details: { action: "Run system diagnostics" },
        reason: error instanceof Error ? error.message : "Unknown error"
      }
    );
    
    throw error;
  }
};
