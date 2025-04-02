
import { runDiagnostics } from '../index';

/**
 * This script runs all diagnostics and outputs the results.
 * It's intended to be run in CI environments to validate the system.
 * 
 * Note: The compiled JavaScript version of this file will have a shebang
 * to enable direct execution in CI environments.
 */
async function main() {
  console.log("Starting diagnostic tests...");
  
  try {
    const results = await runDiagnostics();
    
    console.log("Diagnostic tests completed.");
    console.log("Results:", JSON.stringify(results, null, 2));
    
    // Check for critical errors
    const hasErrors = Object.values(results).some(
      (result: any) => result.status === "error" || 
      (Array.isArray(result) && result.some(item => item.status === "error"))
    );
    
    if (hasErrors) {
      console.error("Diagnostic tests detected critical errors!");
      process.exit(1);
    } else {
      console.log("All critical tests passed.");
      process.exit(0);
    }
  } catch (error) {
    console.error("Error running diagnostics:", error);
    process.exit(1);
  }
}

main();
