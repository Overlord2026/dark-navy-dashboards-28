
import { useState, useEffect, useCallback } from "react";
import { runDiagnostics, runQuickSystemCheck } from "@/services/diagnosticsService";
import { toast } from "sonner";
import { logger } from "@/services/logging/loggingService";

export const useDiagnostics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [isCheckingRealTime, setIsCheckingRealTime] = useState(false);
  const [appState, setAppState] = useState({
    isStuck: false,
    lastUpdateTime: new Date().toISOString(),
    errors: [] as string[],
    warnings: [] as string[],
    performanceMeasures: {} as Record<string, number>
  });

  // Run a diagnostic check with improved error handling
  const runDiagnosticCheck = useCallback(async () => {
    setIsLoading(true);
    logger.info("Running system diagnostics check", undefined, "useDiagnostics");
    
    try {
      const diagnosticReport = await runDiagnostics();
      setReport(diagnosticReport);
      
      // Identify potential issues from the report
      const errors = [];
      const warnings = [];
      const performanceMeasures = {};
      
      if (diagnosticReport.navigation.status !== 'success') {
        errors.push("Navigation issues detected");
      }
      
      if (diagnosticReport.api.status !== 'success') {
        errors.push("API issues detected");
      }
      
      if (diagnosticReport.forms.status !== 'success') {
        warnings.push("Form validation issues detected");
      }
      
      // Add performance measures
      if (diagnosticReport.performance) {
        Object.entries(diagnosticReport.performance).forEach(([key, value]) => {
          performanceMeasures[key] = value as number;
        });
      }
      
      setAppState(prev => ({
        ...prev,
        isStuck: errors.length > 0,
        lastUpdateTime: new Date().toISOString(),
        errors,
        warnings,
        performanceMeasures
      }));
      
      logger.info("Diagnostics check completed", { 
        errors: errors.length, 
        warnings: warnings.length 
      }, "useDiagnostics");
      
      if (errors.length > 0) {
        toast.error(`Diagnostics detected ${errors.length} issues that may affect application performance`);
      } else if (warnings.length > 0) {
        toast.warning(`Diagnostics detected ${warnings.length} warnings`);
      } else {
        toast.success("System diagnostics completed successfully");
      }
      
      return diagnosticReport;
    } catch (error) {
      logger.error("Failed to run diagnostics", error, "useDiagnostics");
      toast.error("Failed to complete system diagnostics");
      
      setAppState(prev => ({
        ...prev,
        isStuck: true,
        errors: [...prev.errors, "Failed to run diagnostics"]
      }));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Quick check to see if app is responsive with improved reliability
  const runQuickCheck = useCallback(async () => {
    setIsCheckingRealTime(true);
    try {
      const quickCheck = await runQuickSystemCheck();
      
      // Only update state if check was successful to avoid false positives
      if (quickCheck.success) {
        setAppState(prev => ({
          ...prev,
          isStuck: false,
          lastUpdateTime: new Date().toISOString()
        }));
      }
      
      return quickCheck;
    } catch (error) {
      logger.error("Quick check failed", error, "useDiagnostics");
      
      // Don't immediately mark as stuck on a single failed check
      // to reduce false alarms
      return { success: false, error: String(error) };
    } finally {
      setIsCheckingRealTime(false);
    }
  }, []);

  // Improved system monitoring with backoff
  const startSystemMonitoring = useCallback(() => {
    let failures = 0;
    let interval = 30000; // Start at 30 seconds
    const maxInterval = 120000; // Max 2 minutes
    
    const checkSystem = async () => {
      try {
        const result = await runQuickCheck();
        
        if (result.success) {
          failures = 0;
          interval = 30000; // Reset to default on success
        } else {
          failures++;
          // Exponential backoff to avoid hammering failed systems
          interval = Math.min(interval * 1.5, maxInterval);
        }
      } catch (e) {
        failures++;
        interval = Math.min(interval * 1.5, maxInterval);
      }
    };
    
    // Initial check
    checkSystem();
    
    // Dynamic interval based on failure rate
    const intervalId = setInterval(() => {
      checkSystem();
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [runQuickCheck]);

  useEffect(() => {
    logger.info("Diagnostics hook initialized", undefined, "useDiagnostics");
    // Run an initial quick check
    runQuickCheck();
    
    // Start monitoring
    const stopMonitoring = startSystemMonitoring();
    
    return () => {
      stopMonitoring();
      logger.info("Diagnostics hook cleanup", undefined, "useDiagnostics");
    };
  }, [runQuickCheck, startSystemMonitoring]);

  return {
    isLoading,
    report,
    runDiagnosticCheck,
    runQuickCheck,
    isCheckingRealTime,
    appState
  };
};
