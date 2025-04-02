
/**
 * CI Runner for Diagnostics Module
 * 
 * This module provides functionality for running diagnostics in a CI environment.
 * It's designed to be called from CI/CD pipelines to validate the application
 * before deployment or as part of automated testing.
 */

import fs from 'fs';
import path from 'path';
import { runDiagnostics } from './index';
import { DiagnosticTestStatus } from './types';

/**
 * Options for running diagnostics in CI
 */
export interface DiagnosticsRunnerOptions {
  /**
   * Path to output the diagnostics report JSON file
   * @default 'diagnostics-report.json'
   */
  outputFile?: string;
  
  /**
   * Whether to fail the CI process if errors are found
   * @default true
   */
  failOnError?: boolean;
  
  /**
   * Whether to fail the CI process if warnings are found
   * @default false
   */
  failOnWarning?: boolean;
  
  /**
   * Whether to send notifications for warnings
   * @default true
   */
  notifyOnWarning?: boolean;
  
  /**
   * Email addresses to notify when issues are found
   */
  notifyEmail?: string[];
}

/**
 * Runs diagnostics in a CI environment and handles reporting
 * 
 * This function:
 * 1. Runs all diagnostic tests
 * 2. Writes the results to a JSON file
 * 3. Determines whether to fail the CI process based on the results and options
 * 4. Handles notifications for errors and warnings
 * 
 * @param options Configuration options for running diagnostics
 * @returns The diagnostic report
 * 
 * @throws Will throw an error if diagnostics fail in a way that should fail the CI process,
 *         allowing CI systems to detect the failure and handle it appropriately
 */
export const runDiagnosticsInCI = async (options: DiagnosticsRunnerOptions = {}) => {
  // Set default options
  const {
    outputFile = 'diagnostics-report.json',
    failOnError = true,
    failOnWarning = false,
    notifyOnWarning = true,
    notifyEmail = []
  } = options;
  
  try {
    console.log('Running diagnostics in CI environment...');
    
    // Run all diagnostics with a timeout to catch hanging async operations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Diagnostics timed out after 5 minutes')), 5 * 60 * 1000);
    });
    
    // Run diagnostics with a timeout
    const report = await Promise.race([
      runDiagnostics(),
      timeoutPromise
    ]) as any;
    
    // Write the report to a file
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      outputFile,
      JSON.stringify(report, null, 2),
      'utf8'
    );
    
    console.log(`Diagnostics report written to ${outputFile}`);
    
    // Count errors and warnings
    const errorCount = countIssuesByType(report, 'error');
    const warningCount = countIssuesByType(report, 'warning');
    
    // Summary report for CI logs
    console.log('\n===== Diagnostics Summary =====');
    console.log(`Overall Status: ${report.overall.toUpperCase()}`);
    console.log(`Total Errors: ${errorCount}`);
    console.log(`Total Warnings: ${warningCount}`);
    console.log('===============================\n');
    
    // Output detailed issues if there are any
    if (errorCount > 0 || warningCount > 0) {
      console.log('Issues detected:');
      logIssues(report);
    }
    
    // Handle notifications (in a real system, this would send emails)
    if (errorCount > 0 || (warningCount > 0 && notifyOnWarning)) {
      if (notifyEmail.length > 0) {
        console.log(`Would notify: ${notifyEmail.join(', ')}`);
        // In a real implementation, this would call a notification service
      }
    }
    
    // Determine if we should fail the CI process
    if ((errorCount > 0 && failOnError) || (warningCount > 0 && failOnWarning)) {
      const errorMessage = `Diagnostics found ${errorCount} errors and ${warningCount} warnings`;
      console.error(`\n❌ ${errorMessage}`);
      
      // We return the report anyway, but the caller can check hasErrors/hasWarnings
      // to determine whether to exit with a non-zero code
      return {
        ...report,
        hasErrors: errorCount > 0,
        hasWarnings: warningCount > 0,
        results: extractTestResults(report)
      };
    }
    
    console.log('\n✅ Diagnostics completed successfully');
    
    return {
      ...report,
      hasErrors: errorCount > 0,
      hasWarnings: warningCount > 0,
      results: extractTestResults(report)
    };
  } catch (error) {
    // Handle any errors that occurred during the diagnostics process
    console.error('Failed to run diagnostics in CI:', error);
    
    // Write a failure report
    const failureReport = {
      timestamp: new Date().toISOString(),
      overall: 'error' as DiagnosticTestStatus,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    try {
      fs.writeFileSync(
        outputFile,
        JSON.stringify(failureReport, null, 2),
        'utf8'
      );
      console.log(`Failure report written to ${outputFile}`);
    } catch (writeError) {
      console.error('Failed to write failure report:', writeError);
    }
    
    // Re-throw to ensure CI fails
    throw error;
  }
};

/**
 * Counts the number of issues of a specific type in the diagnostic report
 * 
 * @param report The diagnostic report
 * @param type The type of issue to count (error, warning)
 * @returns The number of issues found
 */
function countIssuesByType(report: any, type: DiagnosticTestStatus): number {
  let count = 0;
  
  // Check all test categories
  [
    'navigationTests',
    'permissionsTests',
    'iconTests',
    'formValidationTests',
    'apiIntegrationTests',
    'roleSimulationTests',
    'performanceTests',
    'securityTests'
  ].forEach(category => {
    if (Array.isArray(report[category])) {
      count += report[category].filter((test: any) => test.status === type).length;
    }
  });
  
  // Check basic services
  [
    'navigation',
    'forms',
    'database',
    'api',
    'authentication'
  ].forEach(service => {
    if (report[service] && report[service].status === type) {
      count += 1;
    }
  });
  
  return count;
}

/**
 * Logs the details of issues found during diagnostics
 * 
 * @param report The diagnostic report
 */
function logIssues(report: any): void {
  // Log issues from test categories
  [
    { key: 'navigationTests', name: 'Navigation' },
    { key: 'permissionsTests', name: 'Permissions' },
    { key: 'iconTests', name: 'Icons' },
    { key: 'formValidationTests', name: 'Form Validation' },
    { key: 'apiIntegrationTests', name: 'API Integration' },
    { key: 'roleSimulationTests', name: 'Role Simulation' },
    { key: 'performanceTests', name: 'Performance' },
    { key: 'securityTests', name: 'Security' }
  ].forEach(({ key, name }) => {
    if (Array.isArray(report[key])) {
      const issues = report[key].filter((test: any) => test.status !== 'success');
      if (issues.length > 0) {
        console.log(`\n${name} Issues:`);
        issues.forEach((issue: any) => {
          const marker = issue.status === 'error' ? '❌' : '⚠️';
          const details = [
            issue.route ? `Route: ${issue.route}` : '',
            issue.endpoint ? `Endpoint: ${issue.endpoint}` : '',
            issue.name ? `Name: ${issue.name}` : ''
          ].filter(Boolean).join(', ');
          
          console.log(`  ${marker} ${details || 'Unknown'}: ${issue.message}`);
        });
      }
    }
  });
  
  // Log issues from basic services
  const basicServices = [
    { key: 'navigation', name: 'Navigation' },
    { key: 'forms', name: 'Forms' },
    { key: 'database', name: 'Database' },
    { key: 'api', name: 'API' },
    { key: 'authentication', name: 'Authentication' }
  ];
  
  const serviceIssues = basicServices
    .filter(({ key }) => report[key] && report[key].status !== 'success')
    .map(({ key, name }) => ({ ...report[key], name }));
  
  if (serviceIssues.length > 0) {
    console.log('\nBasic Service Issues:');
    serviceIssues.forEach(issue => {
      const marker = issue.status === 'error' ? '❌' : '⚠️';
      console.log(`  ${marker} ${issue.name}: ${issue.message}`);
    });
  }
}

/**
 * Extracts test results from the report into a structured format
 * 
 * @param report The diagnostic report
 * @returns A structured representation of test results by category
 */
function extractTestResults(report: any): Record<string, any> {
  const results: Record<string, any> = {};
  
  // Extract results from test categories
  [
    { key: 'navigationTests', name: 'navigation' },
    { key: 'permissionsTests', name: 'permissions' },
    { key: 'iconTests', name: 'icons' },
    { key: 'formValidationTests', name: 'forms' },
    { key: 'apiIntegrationTests', name: 'api' },
    { key: 'roleSimulationTests', name: 'roles' },
    { key: 'performanceTests', name: 'performance' },
    { key: 'securityTests', name: 'security' }
  ].forEach(({ key, name }) => {
    if (Array.isArray(report[key])) {
      const error = report[key].filter((test: any) => test.status === 'error').length;
      const warning = report[key].filter((test: any) => test.status === 'warning').length;
      const success = report[key].filter((test: any) => test.status === 'success').length;
      
      let status: DiagnosticTestStatus = 'success';
      if (error > 0) status = 'error';
      else if (warning > 0) status = 'warning';
      
      results[name] = { status, error, warning, success, total: report[key].length };
    }
  });
  
  // Extract results from basic services
  [
    'navigation',
    'forms',
    'database',
    'api',
    'authentication'
  ].forEach(service => {
    if (report[service]) {
      results[`basic_${service}`] = report[service];
    }
  });
  
  return results;
}
