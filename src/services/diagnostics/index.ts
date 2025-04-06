
import { testBasicServices } from './basicChecks';
import { testNavigation } from './navigationTests';
import { testPermissions } from './permissionTests';
import { testIcons } from './iconTests';
import { testFormValidation } from './formValidationTests';
import { testApiIntegrations } from './apiIntegrationTests';
import { testRoleSimulations } from './roleSimulationTests';
import { testPerformance } from './performanceTests';
import { testSecurity } from './securityTests';
import { testApiEndpoints } from './apiDiagnostics';
import { DiagnosticTestStatus } from './types';
import { logger } from '../logging/loggingService';
import { auditLog } from '../auditLog/auditLogService';

// Export renamed functions for backward compatibility
export const runPerformanceTests = testPerformance;
export const runSecurityTests = testSecurity;

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
    // Core services - Runs basic diagnostic checks on core system services
    const basicResults = await testBasicServices();
    
    // Detailed tests
    // Navigation tests - Verify all application routes are accessible and render correctly
    const navigationTests = await testNavigation();
    
    // Permission tests - Check that all roles have appropriate access to resources
    const permissionsTests = await testPermissions();
    
    // Icon tests - Ensure all icons render correctly throughout the application
    const iconTests = await testIcons();
    
    // Form validation tests - Verify form validation logic works correctly across the app
    const formValidationTests = await testFormValidation();
    
    // API integration tests - Check connections to all external services and APIs
    const apiIntegrationTests = await testApiIntegrations();
    
    // API endpoint tests - Verify all API endpoints used in the application
    const apiEndpointTests = await testApiEndpoints();
    
    // Role simulation tests - Simulate different user roles to verify access controls
    const roleSimulationTests = await testRoleSimulations();
    
    // Performance tests - Measure and evaluate app performance metrics
    const performanceTests = await testPerformance();
    
    // Security tests - Check for potential security vulnerabilities
    const securityTests = await testSecurity();
    
    // Determine overall status
    const allTests = [
      ...Object.values(basicResults).map((item: any) => item.status),
      ...navigationTests.map(item => item.status),
      ...permissionsTests.map(item => item.status),
      ...iconTests.map(item => item.status),
      ...formValidationTests.map(item => item.status),
      ...apiIntegrationTests.map(item => item.status),
      ...apiEndpointTests.map(item => item.status),
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
      apiEndpointTests,
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
    // Ensure all errors are properly caught and logged
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
