
#!/usr/bin/env node

/**
 * Diagnostics CI Runner Script
 * 
 * This script is designed to be run as part of a CI/CD pipeline to execute
 * the application's diagnostic tests and report the results.
 * 
 * Usage:
 *   node run-diagnostics.js [options]
 * 
 * Options:
 *   --outputFile=<path>      Path to write the diagnostics report (default: diagnostics-report.json)
 *   --failOnError=<boolean>  Whether to exit with non-zero code on errors (default: true)
 *   --failOnWarning=<boolean> Whether to exit with non-zero code on warnings (default: false)
 *   --notifyOnWarning=<boolean> Whether to send notifications for warnings (default: true)
 *   --notifyEmail=<emails>   Comma-separated list of emails to notify
 * 
 * Examples:
 *   node run-diagnostics.js --outputFile=reports/diagnostics.json
 *   node run-diagnostics.js --failOnWarning=true
 *   node run-diagnostics.js --notifyEmail=dev@example.com,admin@example.com
 */

import { runDiagnosticsInCI } from '../ciRunner';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const options: Record<string, any> = {};

args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    options[key] = value || true;
  }
});

// Set default values
const outputFile = options.outputFile || 'diagnostics-report.json';
const failOnError = options.failOnError !== 'false';
const failOnWarning = options.failOnWarning === 'true';
const notifyOnWarning = options.notifyOnWarning !== 'false';
const notifyEmail = options.notifyEmail ? options.notifyEmail.split(',') : [];

console.log('Starting diagnostics in CI environment...');
console.log(`Output file: ${outputFile}`);
console.log(`Fail on error: ${failOnError}`);
console.log(`Fail on warning: ${failOnWarning}`);
console.log(`Notify on warning: ${notifyOnWarning}`);
if (notifyEmail.length > 0) {
  console.log(`Notification emails: ${notifyEmail.join(', ')}`);
}

// Run diagnostics
runDiagnosticsInCI({
  outputFile,
  failOnError,
  failOnWarning,
  notifyOnWarning,
  notifyEmail
})
  .then(report => {
    // Output the summary
    console.log('\n===== Final Diagnostics Summary =====');
    console.log(`Status: ${report.overall.toUpperCase()}`);
    console.log(`Errors: ${report.hasErrors ? 'YES' : 'NO'}`);
    console.log(`Warnings: ${report.hasWarnings ? 'YES' : 'NO'}`);
    console.log('=====================================\n');
    
    // Exit with appropriate code
    if ((report.hasErrors && failOnError) || (report.hasWarnings && failOnWarning)) {
      console.log('Exiting with error code due to detected issues');
      process.exit(1);
    } else {
      console.log('Diagnostics completed successfully');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Diagnostics failed:', error);
    process.exit(1);
  });
