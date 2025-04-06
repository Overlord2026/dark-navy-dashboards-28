
import { runDiagnostics } from './diagnostics/index';

// Re-export the diagnostics function 
export { runDiagnostics };

// Add a convenience function to run a quick system check
export const runQuickSystemCheck = async () => {
  console.log("Running quick system check...");
  try {
    const result = await runDiagnostics();
    return {
      success: true,
      status: result.overall,
      timestamp: result.timestamp,
      result
    };
  } catch (error) {
    console.error("Quick system check failed:", error);
    return {
      success: false,
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
