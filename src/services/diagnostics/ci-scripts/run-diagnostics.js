
#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { runDiagnostics } = require('../index');

// Get command line arguments
const args = process.argv.slice(2);
const parsedArgs = {};

// Parse arguments
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    parsedArgs[key] = value || true;
  }
});

// Set default values
const outputFile = parsedArgs.outputFile || 'diagnostics-report.json';
const failOnError = parsedArgs.failOnError === 'true';
const notifyOnWarning = parsedArgs.notifyOnWarning === 'true';
const timeout = parseInt(parsedArgs.timeout || '60000', 10);

console.log('Running diagnostics with the following settings:');
console.log(`- Output file: ${outputFile}`);
console.log(`- Fail on error: ${failOnError}`);
console.log(`- Notify on warning: ${notifyOnWarning}`);
console.log(`- Timeout: ${timeout}ms`);

// Create a promise that will reject after the timeout
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error(`Diagnostics timed out after ${timeout}ms`)), timeout);
});

// Run diagnostics with timeout
Promise.race([
  runDiagnostics(),
  timeoutPromise
])
  .then(results => {
    // Write results to file
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Diagnostics completed. Results written to ${outputFile}`);
    
    // Determine exit code based on results
    if (failOnError && results.overall === 'error') {
      console.error('Diagnostics found errors. Exiting with code 1.');
      process.exit(1);
    } else if (notifyOnWarning && results.overall === 'warning') {
      console.warn('Diagnostics found warnings.');
      // Exit with 0 as warnings don't fail the build
      process.exit(0);
    } else {
      console.log('Diagnostics completed successfully.');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Diagnostics failed:', error);
    // Write error to file
    fs.writeFileSync(
      outputFile, 
      JSON.stringify({
        timestamp: new Date().toISOString(),
        overall: 'error',
        error: error.message || 'Unknown error'
      }, null, 2)
    );
    process.exit(1);
  });
