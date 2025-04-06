
import { runDiagnostics } from './index';

/**
 * CI Runner for diagnostics
 * This module is used to run diagnostics in CI environments
 */
export async function runDiagnosticsInCi() {
  console.log("Running diagnostics in CI environment...");
  
  try {
    const results = await runDiagnostics();
    console.log("Diagnostic results:", JSON.stringify(results, null, 2));
    
    return results;
  } catch (error) {
    console.error("Error running diagnostics in CI:", error);
    throw error;
  }
}

// Export a standalone runner function
export default runDiagnosticsInCi;
