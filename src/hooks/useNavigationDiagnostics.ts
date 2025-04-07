
import { useState } from "react";
import { toast } from "sonner";

interface NavigationDiagnosticResult {
  route: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
}

interface DiagnosticSummary {
  overallStatus: "success" | "warning" | "error";
  totalRoutes: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
}

export function useNavigationDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, NavigationDiagnosticResult[]>>({});
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // This would normally call an API, but for now we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated results
      const diagnosticResults = {
        home: [
          { route: "/", status: "success", message: "Dashboard loads correctly" },
          { route: "/accounts", status: "success", message: "Accounts page loads correctly" }
        ],
        educationSolutions: [
          { route: "/education", status: "success", message: "Education center loads correctly" },
          { route: "/education/tax-planning", status: "success", message: "Tax planning education loads correctly" }
        ],
        familyWealth: [
          { route: "/all-assets", status: "success", message: "All assets page loads correctly" },
          { route: "/properties", status: "warning", message: "Properties page slow to load" }
        ],
        investments: [
          { route: "/investments", status: "success", message: "Investments page loads correctly" },
          { route: "/investments/stock-screener", status: "error", message: "API endpoint unavailable" }
        ]
      };
      
      setResults(diagnosticResults);
      
      // Calculate summary
      const allResults = Object.values(diagnosticResults).flat();
      const totalRoutes = allResults.length;
      const successCount = allResults.filter(r => r.status === "success").length;
      const warningCount = allResults.filter(r => r.status === "warning").length;
      const errorCount = allResults.filter(r => r.status === "error").length;
      
      const overallStatus = errorCount > 0 ? "error" : warningCount > 0 ? "warning" : "success";
      
      setSummary({
        overallStatus,
        totalRoutes,
        successCount,
        warningCount,
        errorCount
      });
      
      toast.success("Navigation diagnostics completed", {
        description: `${successCount} passed, ${warningCount} warnings, ${errorCount} errors`
      });
      
      return { results: diagnosticResults, summary: { overallStatus, totalRoutes, successCount, warningCount, errorCount } };
    } catch (error) {
      toast.error("Failed to run navigation diagnostics");
      console.error("Error running diagnostics:", error);
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    results,
    summary,
    runDiagnostics
  };
}
