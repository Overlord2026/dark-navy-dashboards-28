
#!/usr/bin/env node
/**
 * Run Diagnostics Script
 * 
 * This script is designed to be run in CI environments to perform system diagnostics
 * and generate a report. It can be used to verify application health during deployment.
 * 
 * Usage:
 *   node run-diagnostics.js --outputFile=report.json --failOnError=true
 * 
 * Options:
 *   --outputFile      File to write the diagnostic report to (default: diagnostics-report.json)
 *   --failOnError     Exit with error code if diagnostics fail (default: true)
 *   --notifyOnWarning Send notifications even for warnings (default: false)
 *   --notifyEmail     Email to send notifications to (optional)
 *   --timeout         Timeout in ms for all diagnostics (default: 60000)
 * 
 * Environment Variables:
 *   VITE_APP_ENV      Environment name (e.g., 'ci', 'staging', 'production')
 *   VITE_APP_API_URL  API URL to test against
 */

import { runDiagnostics } from '../../diagnostics';
import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  if (key && value) {
    acc[key.replace(/^--/, '')] = value;
  }
  return acc;
}, {} as Record<string, string>);

// Default options
const options = {
  outputFile: args.outputFile || 'diagnostics-report.json',
  failOnError: args.failOnError !== 'false',
  notifyOnWarning: args.notifyOnWarning === 'true',
  notifyEmail: args.notifyEmail || '',
  timeout: parseInt(args.timeout || '60000', 10),
};

console.log('Starting diagnostics in CI environment...');
console.log(`Options: ${JSON.stringify(options, null, 2)}`);

// Set environment variables for testing
process.env.CI = 'true';
process.env.GITHUB_ACTIONS = process.env.GITHUB_ACTIONS || 'true';

// Run diagnostics with timeout
const diagnosticsPromise = runDiagnostics();
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error(`Diagnostics timed out after ${options.timeout}ms`)), options.timeout)
);

Promise.race([diagnosticsPromise, timeoutPromise])
  .then((results) => {
    // Write results to file
    const outputPath = path.resolve(process.cwd(), options.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`Diagnostics completed. Report written to ${outputPath}`);
    console.log(`Overall status: ${(results as any).overall}`);
    
    // Exit with error code if diagnostics failed and failOnError is true
    if (options.failOnError && (results as any).overall === 'error') {
      console.error('Diagnostics failed with errors.');
      process.exit(1);
    }
    
    // Notify on warnings if enabled
    if (options.notifyOnWarning && (results as any).overall === 'warning') {
      console.warn('Diagnostics completed with warnings.');
      // In a real implementation, we would send notifications here
    }
  })
  .catch((error) => {
    console.error('Error running diagnostics:', error);
    process.exit(1);
  });
