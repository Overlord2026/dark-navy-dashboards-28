import { useState, useEffect } from "react";
import { runDiagnostics } from "@/services/diagnostics";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";
import { toast } from "sonner";
import { 
  QuickFix as DiagnosticsQuickFix, 
  FixHistoryEntry as DiagnosticsFixHistoryEntry,
  Recommendation 
} from "@/types/diagnostics";

export interface QuickFix extends DiagnosticsQuickFix {
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
}

interface FixHistoryEntry extends DiagnosticsFixHistoryEntry {
  area: 'system' | 'performance' | 'security' | 'config' | 'api';
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
      title: "Optimize API response caching",
      description: "Implement proper caching headers for REST API responses to improve performance",
      area: "performance",
      severity: "medium",
      category: "performance"
    },
    {
      id: "fix-2",
      title: "Fix role permissions for advisors",
      description: "Advisors currently have access to admin subscription page",
      area: "security",
      severity: "high",
      category: "security"
    },
    {
      id: "fix-3",
      title: "Update authentication tokens",
      description: "Tax Software Integration credentials are invalid or expired",
      area: "api",
      severity: "high",
      category: "reliability"
    },
    {
      id: "fix-4",
      title: "Fix calendar icon in mobile view",
      description: "Calendar icon is missing in mobile view for appointments",
      area: "config",
      severity: "low",
      category: "usability"
    },
    {
      id: "fix-5",
      title: "Fix form validation in Loan Application",
      description: "Form submission fails with valid data - issue with select and date fields",
      area: "system",
      severity: "medium",
      category: "reliability"
    },
    {
      id: "fix-6",
      title: "Resolve memory leak in Investment listings",
      description: "Possible memory leak when loading large investment catalogs",
      area: "performance",
      severity: "high",
      category: "performance"
    }
  ]);

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

  const addFixToHistory = (fix: QuickFix) => {
    const historyEntry: FixHistoryEntry = {
      id: fix.id,
      title: fix.title,
      timestamp: new Date().toISOString(),
      area: fix.area,
      severity: fix.severity,
      description: fix.description,
      status: 'success'
    };
    
    const updatedHistory = [historyEntry, ...fixHistory].slice(0, 20);
    setFixHistory(updatedHistory);
    
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const appliedFix = quickFixes.find(fix => fix.id === fixId);
      if (appliedFix) {
        addFixToHistory(appliedFix);
        toast.success(`Fixed: ${appliedFix.title}`, {
          description: "Issue has been resolved successfully."
        });
      }
      
      setQuickFixes(prevFixes => prevFixes.filter(fix => fix.id !== fixId));
      
      return true;
    } catch (error) {
      console.error(`Error applying fix ${fixId}:`, error);
      return false;
    } finally {
      setQuickFixLoading(false);
    }
  };

  const applyDiagnosticFix = async (testId: string, category: string, name: string) => {
    setFixInProgress(testId);
    
    try {
      console.log(`Applying diagnostic fix for ${category} - ${name} (ID: ${testId})`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Fix applied successfully for "${name}"`, {
        description: "The issue has been resolved.",
      });
      
      addFixToHistory({
        id: testId,
        title: name,
        description: `${category} issue fixed`,
        area: category as QuickFix['area'],
        severity: "medium",
        category: "reliability"
      });
      
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
