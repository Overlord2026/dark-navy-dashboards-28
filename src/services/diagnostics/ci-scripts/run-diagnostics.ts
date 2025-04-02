
#!/usr/bin/env node

/**
 * This script runs the application diagnostics in CI mode
 * It can be executed directly from CI/CD pipelines
 */

import { runDiagnosticsInCI } from '../ciRunner';

// Parse command line arguments
const args = process.argv.slice(2);
const options: Record<string, any> = {
  failOnError: true,
  failOnWarning: false,
  notifyOnWarning: true,
  outputFile: 'diagnostics-report.json'
};

// Override defaults with command line arguments
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    options[key] = value === undefined ? true : value;
  }
});

// Convert string boolean options to actual booleans
['failOnError', 'failOnWarning', 'notifyOnWarning'].forEach(opt => {
  if (typeof options[opt] === 'string') {
    options[opt] = options[opt].toLowerCase() === 'true';
  }
});

// Parse notification emails if provided
if (options.notifyEmail && typeof options.notifyEmail === 'string') {
  options.notifyEmail = options.notifyEmail.split(',');
}

console.log('Running diagnostics with options:', options);

runDiagnosticsInCI(options)
  .then(report => {
    console.log(`Diagnostics completed with status: ${report.overall}`);
    if (report.hasErrors || report.hasWarnings) {
      console.log('Issues found:');
      Object.entries(report.results).forEach(([category, data]) => {
        if (data.status !== 'success') {
          console.log(`- ${category}: ${data.status} (${data.error} errors, ${data.warning} warnings)`);
        }
      });
    } else {
      console.log('All diagnostics passed successfully!');
    }
  })
  .catch(error => {
    console.error('Failed to run diagnostics:', error);
    process.exit(1);
  });
