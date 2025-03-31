
import { useState, useEffect } from "react";
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
    warnings: [] as string[]
  });

  // Run a diagnostic check
  const runDiagnosticCheck = async () => {
    setIsLoading(true);
    logger.info("Running system diagnostics check", undefined, "useDiagnostics");
    
    try {
      const diagnosticReport = await runDiagnostics();
      setReport(diagnosticReport);
      
      // Identify potential issues from the report
      const errors = [];
      const warnings = [];
      
      if (diagnosticReport.navigation.status !== 'success') {
        errors.push("Navigation issues detected");
      }
      
      if (diagnosticReport.api.status !== 'success') {
        errors.push("API issues detected");
      }
      
      if (diagnosticReport.forms.status !== 'success') {
        warnings.push("Form validation issues detected");
      }
      
      setAppState(prev => ({
        ...prev,
        isStuck: errors.length > 0,
        lastUpdateTime: new Date().toISOString(),
        errors,
        warnings
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
  };

  // Quick check to see if app is responsive
  const runQuickCheck = async () => {
    setIsCheckingRealTime(true);
    try {
      const quickCheck = await runQuickSystemCheck();
      
      setAppState(prev => ({
        ...prev,
        isStuck: !quickCheck.success,
        lastUpdateTime: new Date().toISOString()
      }));
      
      return quickCheck;
    } catch (error) {
      logger.error("Quick check failed", error, "useDiagnostics");
      
      setAppState(prev => ({
        ...prev,
        isStuck: true,
        errors: [...prev.errors, "Quick system check failed"]
      }));
      
      return { success: false, error: String(error) };
    } finally {
      setIsCheckingRealTime(false);
    }
  };

  // Monitor system state
  const startSystemMonitoring = () => {
    // Check system state every 30 seconds
    const intervalId = setInterval(() => {
      runQuickCheck();
    }, 30000);
    
    return () => clearInterval(intervalId);
  };

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
  }, []);

  return {
    isLoading,
    report,
    runDiagnosticCheck,
    runQuickCheck,
    isCheckingRealTime,
    appState
  };
};
