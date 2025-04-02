
#!/usr/bin/env node

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
const notifyOnWarning = options.notifyOnWarning === 'true';
const notifyEmail = options.notifyEmail ? options.notifyEmail.split(',') : [];

console.log('Starting diagnostics in CI environment...');
console.log(`Output file: ${outputFile}`);
console.log(`Fail on error: ${failOnError}`);
console.log(`Fail on warning: ${failOnWarning}`);

// Run diagnostics
runDiagnosticsInCI({
  outputFile,
  failOnError,
  failOnWarning,
  notifyOnWarning,
  notifyEmail
})
  .then(report => {
    console.log('Diagnostics completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Diagnostics failed:', error);
    process.exit(1);
  });
