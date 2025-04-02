
import { useState, useEffect } from "react";
import { runDiagnostics } from "@/services/diagnostics";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { toast } from "sonner";

export type QuickFixArea = 'system' | 'performance' | 'security' | 'config' | 'api';

export interface QuickFix {
  id: string;
  name: string;
  description: string;
  area: QuickFixArea;
  severity: string;
}

export function useDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFixLoading, setQuickFixLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string | null>(null);
  const [fixInProgress, setFixInProgress] = useState<string | null>(null);
  const [quickFixes, setQuickFixes] = useState<QuickFix[]>([
    {
      id: "fix-1",
      name: "Optimize API response caching",
      description: "Implement proper caching headers for REST API responses to improve performance",
      area: "performance",
      severity: "medium"
    },
    {
      id: "fix-2",
      name: "Fix role permissions for advisors",
      description: "Advisors currently have access to admin subscription page",
      area: "security",
      severity: "high"
    },
    {
      id: "fix-3",
      name: "Update authentication tokens",
      description: "Tax Software Integration credentials are invalid or expired",
      area: "api",
      severity: "high"
    },
    {
      id: "fix-4",
      name: "Fix calendar icon in mobile view",
      description: "Calendar icon is missing in mobile view for appointments",
      area: "config",
      severity: "low"
    },
    {
      id: "fix-5",
      name: "Fix form validation in Loan Application",
      description: "Form submission fails with valid data - issue with select and date fields",
      area: "system",
      severity: "medium"
    },
    {
      id: "fix-6",
      name: "Resolve memory leak in Investment listings",
      description: "Possible memory leak when loading large investment catalogs",
      area: "performance",
      severity: "high"
    }
  ]);

  const runSystemDiagnostics = async () => {
    setIsRunning(true);
    setIsLoading(true);
    try {
      const results = await runDiagnostics();
      setDiagnosticResults(results);
      setLastRunTimestamp(new Date().toISOString());
      return results;
    } catch (error) {
      console.error("Error running diagnostics:", error);
      throw error;
    } finally {
      setIsRunning(false);
      setIsLoading(false);
    }
  };
  
  const refreshDiagnostics = async () => {
    setIsLoading(true);
    try {
      await runSystemDiagnostics();
    } finally {
      setIsLoading(false);
    }
  };

  const applyQuickFix = async (fixId: string) => {
    setQuickFixLoading(true);
    try {
      console.log(`Applying fix: ${fixId}`);
      // Simulate fix application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove the fixed item from the list
      setQuickFixes(prevFixes => prevFixes.filter(fix => fix.id !== fixId));
      
      return true;
    } catch (error) {
      console.error(`Error applying fix ${fixId}:`, error);
      return false;
    } finally {
      setQuickFixLoading(false);
    }
  };

  // New function to fix a specific diagnostic issue
  const applyDiagnosticFix = async (testId: string, category: string, name: string) => {
    setFixInProgress(testId);
    
    try {
      console.log(`Applying diagnostic fix for ${category} - ${name} (ID: ${testId})`);
      
      // Simulate fix application with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here we would actually implement the real fix logic
      // For now we just simulate success
      
      toast.success(`Fix applied successfully for "${name}"`, {
        description: "The issue has been resolved.",
      });
      
      // Update the diagnostics results to reflect the fix
      // This is a simplified example - in a real implementation, we'd update
      // the specific test that was fixed
      if (diagnosticResults && diagnosticResults[`${category}Tests`]) {
        const updatedTests = diagnosticResults[`${category}Tests`].map((test: any) => {
          if (test.name === name || test.endpoint === name || test.route === name) {
            return { ...test, status: "success" };
          }
          return test;
        });
        
        setDiagnosticResults({
          ...diagnosticResults,
          [`${category}Tests`]: updatedTests
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error applying fix for ${testId}:`, error);
      toast.error(`Unable to fix "${name}"`, {
        description: "Please try the manual steps or contact support.",
      });
      return false;
    } finally {
      setFixInProgress(null);
    }
  };

  const getOverallStatus = (): DiagnosticTestStatus => {
    if (!diagnosticResults) return "success";
    return diagnosticResults.overall || "success";
  };

  return {
    isRunning,
    isLoading,
    quickFixLoading,
    diagnosticResults,
    lastRunTimestamp,
    quickFixes,
    fixInProgress,
    runSystemDiagnostics,
    refreshDiagnostics,
    applyQuickFix,
    applyDiagnosticFix,
    getOverallStatus
  };
}
