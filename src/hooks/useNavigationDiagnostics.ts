
import { useState } from "react";
import { toast } from "sonner";
import { NavigationTestResult, DiagnosticTestStatus } from "@/types/diagnostics";

interface DiagnosticSummary {
  overallStatus: DiagnosticTestStatus;
  totalRoutes: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
}

export function useNavigationDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, NavigationTestResult[]>>({});
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    try {
      // This would normally call an API, but for now we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated results - now properly typed with all required properties
      const timestamp = Date.now();
      const diagnosticResults: Record<string, NavigationTestResult[]> = {
        home: [
          { id: "home-1", route: "/", status: "success", message: "Dashboard loads correctly", timestamp },
          { id: "home-2", route: "/accounts", status: "success", message: "Accounts page loads correctly", timestamp }
        ],
        educationSolutions: [
          { id: "edu-1", route: "/education", status: "success", message: "Education center loads correctly", timestamp },
          { id: "edu-2", route: "/education/tax-planning", status: "success", message: "Tax planning education loads correctly", timestamp }
        ],
        familyWealth: [
          { id: "wealth-1", route: "/all-assets", status: "success", message: "All assets page loads correctly", timestamp },
          { id: "wealth-2", route: "/properties", status: "warning", message: "Properties page slow to load", timestamp }
        ],
        investments: [
          { id: "invest-1", route: "/investments", status: "success", message: "Investments page loads correctly", timestamp },
          { id: "invest-2", route: "/investments/stock-screener", status: "error", message: "API endpoint unavailable", timestamp }
        ]
      };
      
      setResults(diagnosticResults);
      
      // Calculate summary
      const allResults = Object.values(diagnosticResults).flat();
      const totalRoutes = allResults.length;
      const successCount = allResults.filter(r => r.status === "success").length;
      const warningCount = allResults.filter(r => r.status === "warning").length;
      const errorCount = allResults.filter(r => r.status === "error").length;
      
      const overallStatus: DiagnosticTestStatus = 
        errorCount > 0 ? "error" : 
        warningCount > 0 ? "warning" : 
        "success";
      
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
