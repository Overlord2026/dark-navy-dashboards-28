
import { runDiagnostics } from '.';
import fs from 'fs';
import path from 'path';
import { DiagnosticTestStatus } from './types';

/**
 * CI-specific diagnostics runner that can be executed in a CI/CD pipeline
 * @param options Configuration options for the CI diagnostics run
 */
export async function runDiagnosticsInCI(options: {
  outputFile?: string;
  failOnError?: boolean;
  failOnWarning?: boolean;
  notifyOnWarning?: boolean;
  notifyEmail?: string[];
}) {
  console.log('Starting CI diagnostics run...');
  
  try {
    // Run all diagnostics
    const results = await runDiagnostics();
    
    // Determine exit code based on results
    const hasErrors = determineHasErrors(results);
    const hasWarnings = determineHasWarnings(results);
    
    // Generate report
    const report = generateCIReport(results, hasErrors, hasWarnings);
    
    // Write report to file if output file is specified
    if (options.outputFile) {
      const outputPath = path.resolve(process.cwd(), options.outputFile);
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`Diagnostics report written to ${outputPath}`);
    }
    
    // Log summary
    console.log(`Diagnostics completed with ${hasErrors ? 'errors' : hasWarnings ? 'warnings' : 'success'}`);
    console.log(`Total tests: ${report.totalTests}`);
    console.log(`Success: ${report.successCount}`);
    console.log(`Warnings: ${report.warningCount}`);
    console.log(`Errors: ${report.errorCount}`);
    
    // Determine if CI should fail
    if (hasErrors && options.failOnError) {
      console.error('Diagnostics found errors. Failing CI pipeline.');
      process.exit(1);
    }
    
    if (hasWarnings && options.failOnWarning) {
      console.warn('Diagnostics found warnings. Failing CI pipeline.');
      process.exit(1);
    }
    
    // Handle notifications if needed
    if ((hasWarnings && options.notifyOnWarning) || hasErrors) {
      console.log('Would send notification emails to:', options.notifyEmail);
      // In a real implementation, this would integrate with an email service
      // sendNotifications(report, options.notifyEmail);
    }
    
    return report;
  } catch (error) {
    console.error('Error running diagnostics in CI:', error);
    
    // Always fail CI on uncaught errors
    process.exit(1);
  }
}

/**
 * Determines if the diagnostic results contain any errors
 */
function determineHasErrors(results: any): boolean {
  if (results.overall === 'error') return true;
  
  // Check individual test categories
  for (const key of Object.keys(results)) {
    if (Array.isArray(results[key])) {
      if (results[key].some((test: any) => test.status === 'error')) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Determines if the diagnostic results contain any warnings
 */
function determineHasWarnings(results: any): boolean {
  if (results.overall === 'warning') return true;
  
  // Check individual test categories
  for (const key of Object.keys(results)) {
    if (Array.isArray(results[key])) {
      if (results[key].some((test: any) => test.status === 'warning')) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Generates a CI-compatible report from the diagnostic results
 */
function generateCIReport(results: any, hasErrors: boolean, hasWarnings: boolean) {
  // Count all tests
  const allTests = Object.values(results)
    .filter(Array.isArray)
    .flat() as any[];
  
  const successCount = allTests.filter((test: any) => test.status === 'success').length;
  const warningCount = allTests.filter((test: any) => test.status === 'warning').length;
  const errorCount = allTests.filter((test: any) => test.status === 'error').length;
  
  return {
    timestamp: results.timestamp,
    overall: results.overall,
    totalTests: allTests.length,
    successCount,
    warningCount,
    errorCount,
    hasErrors,
    hasWarnings,
    results: {
      navigation: summarizeTests(results.navigationTests || []),
      permissions: summarizeTests(results.permissionsTests || []),
      api: summarizeTests(results.apiIntegrationTests || []),
      forms: summarizeTests(results.formValidationTests || []),
      performance: summarizeTests(results.performanceTests || []),
      security: summarizeTests(results.securityTests || []),
      roleSimulation: summarizeTests(results.roleSimulationTests || []),
    }
  };
}

/**
 * Summarizes a test category for the report
 */
function summarizeTests(tests: any[]) {
  const count = tests.length;
  const success = tests.filter(t => t.status === 'success').length;
  const warning = tests.filter(t => t.status === 'warning').length;
  const error = tests.filter(t => t.status === 'error').length;
  
  let status: DiagnosticTestStatus = 'success';
  if (error > 0) status = 'error';
  else if (warning > 0) status = 'warning';
  
  return {
    count,
    success,
    warning,
    error,
    status,
    details: tests.filter(t => t.status !== 'success')
  };
}

/**
 * Command line interface for running diagnostics in CI
 * You can call this directly from package.json scripts or CI pipeline
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: Record<string, any> = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      options[key] = value || true;
    }
  });
  
  runDiagnosticsInCI({
    outputFile: options.output,
    failOnError: options.failOnError !== 'false',
    failOnWarning: options.failOnWarning === 'true',
    notifyOnWarning: options.notifyOnWarning === 'true',
    notifyEmail: options.notifyEmail ? options.notifyEmail.split(',') : []
  });
}

export default runDiagnosticsInCI;
