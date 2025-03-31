
import { runDiagnostics } from './diagnostics';

// Re-export the diagnostics function 
export { runDiagnostics };

// Add a convenience function to run a quick system check
export const runQuickSystemCheck = async (targetSystem: "all" | "marketplace" | "financial" | "document" = "all") => {
  console.log(`Running quick ${targetSystem} system check...`);
  try {
    const result = await runDiagnostics();
    return {
      success: true,
      status: result.overall,
      timestamp: result.timestamp,
      targetSystem,
      result
    };
  } catch (error) {
    console.error("Quick system check failed:", error);
    return {
      success: false,
      status: "error",
      timestamp: new Date().toISOString(),
      targetSystem,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
