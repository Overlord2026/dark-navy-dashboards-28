
import { useState, useEffect } from "react";
import { runDiagnostics } from "@/services/diagnostics";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { toast } from "sonner";
import { QuickFix as DiagnosticsQuickFix, FixHistoryEntry as DiagnosticsFixHistory } from "@/types/diagnostics";

export type QuickFixArea = 'system' | 'performance' | 'security' | 'config' | 'api';

// Update the QuickFix interface to match the one in diagnostics.ts
export interface QuickFix {
  id: string;
  title: string; // Changed from 'name' to 'title' to match diagnostics.ts
  description: string;
  area: QuickFixArea;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// Update the FixHistoryEntry interface to match the one in diagnostics.ts
interface FixHistoryEntry {
  id: string;
  title: string; // Was 'name' before
  timestamp: string;
  area: QuickFixArea;
  severity: string;
  description: string; // Added to match diagnostics.ts
  status: 'success' | 'failed' | 'pending'; // Added to match diagnostics.ts
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
      title: "Optimize API response caching", // Changed from 'name' to 'title'
      description: "Implement proper caching headers for REST API responses to improve performance",
      area: "performance",
      severity: "medium"
    },
    {
      id: "fix-2",
      title: "Fix role permissions for advisors", // Changed from 'name' to 'title'
      description: "Advisors currently have access to admin subscription page",
      area: "security",
      severity: "high"
    },
    {
      id: "fix-3",
      title: "Update authentication tokens", // Changed from 'name' to 'title'
      description: "Tax Software Integration credentials are invalid or expired",
      area: "api",
      severity: "high"
    },
    {
      id: "fix-4",
      title: "Fix calendar icon in mobile view", // Changed from 'name' to 'title'
      description: "Calendar icon is missing in mobile view for appointments",
      area: "config",
      severity: "low"
    },
    {
      id: "fix-5",
      title: "Fix form validation in Loan Application", // Changed from 'name' to 'title'
      description: "Form submission fails with valid data - issue with select and date fields",
      area: "system",
      severity: "medium"
    },
    {
      id: "fix-6",
      title: "Resolve memory leak in Investment listings", // Changed from 'name' to 'title'
      description: "Possible memory leak when loading large investment catalogs",
      area: "performance",
      severity: "high"
    }
  ]);

  // Load fix history from localStorage on mount
  const [fixHistory, setFixHistory] = useState<FixHistoryEntry[]>([]);
  useEffect(() => {
    const storedHistory = localStorage.getItem('diagnostics-fix-history');
    if (storedHistory) {
      try {
        setFixHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Error loading fix history:", e);
        setFixHistory([]);
      }
    }
  }, []);

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
      toast.success("Diagnostics re-check completed", {
        description: "System status has been updated."
      });
    } catch (error) {
      toast.error("Failed to re-check diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a fix to the history
  const addFixToHistory = (fix: QuickFix) => {
    const historyEntry: FixHistoryEntry = {
      id: fix.id,
      title: fix.title, // Changed from 'name' to 'title'
      timestamp: new Date().toISOString(),
      area: fix.area,
      severity: fix.severity,
      description: fix.description, // Added to match diagnostics.ts
      status: 'success' // Added to match diagnostics.ts
    };
    
    const updatedHistory = [historyEntry, ...fixHistory].slice(0, 20); // Keep only the latest 20 entries
    setFixHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('diagnostics-fix-history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error saving fix history:", e);
    }
  };

  const applyQuickFix = async (fixId: string) => {
    setQuickFixLoading(true);
    try {
      console.log(`Applying fix: ${fixId}`);
      // Simulate fix application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find the fix that was applied
      const appliedFix = quickFixes.find(fix => fix.id === fixId);
      if (appliedFix) {
        // Add to history
        addFixToHistory(appliedFix);
        
        // Show success message
        toast.success(`Fixed: ${appliedFix.title}`, { // Changed from 'name' to 'title'
          description: "Issue has been resolved successfully."
        });
      }
      
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
      
      // Add to fix history
      addFixToHistory({
        id: testId,
        title: name, // Changed from 'name' to 'title'
        description: `${category} issue fixed`,
        area: category as QuickFixArea,
        severity: "medium" // Default since we don't have this info
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
    fixHistory,
    runSystemDiagnostics,
    refreshDiagnostics,
    applyQuickFix,
    applyDiagnosticFix,
    getOverallStatus
  };
}
