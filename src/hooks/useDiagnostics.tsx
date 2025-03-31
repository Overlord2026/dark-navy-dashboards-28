
import { useState, useEffect } from "react";
import { runDiagnostics } from "@/services/diagnostics";
import { DiagnosticTestStatus } from "@/services/diagnostics/types";

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
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string | null>(null);
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
    }
  };

  const getOverallStatus = (): DiagnosticTestStatus => {
    if (!diagnosticResults) return "success";
    return diagnosticResults.overall || "success";
  };

  return {
    isRunning,
    diagnosticResults,
    lastRunTimestamp,
    quickFixes,
    runSystemDiagnostics,
    getOverallStatus
  };
}
