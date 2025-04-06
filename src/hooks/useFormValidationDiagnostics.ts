
import { useState, useCallback, useEffect } from 'react';
import { 
  runFormValidationDiagnostics,
  runSingleFormValidationTest,
  getAvailableFormTests
} from '@/services/diagnostics/formValidationDiagnostics';
import { FormValidationTestResult } from '@/services/diagnostics/types';
import { toast } from 'sonner';
import { logger } from '@/services/logging/loggingService';

export function useFormValidationDiagnostics() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [availableForms, setAvailableForms] = useState<any[]>([]);

  const loadAvailableForms = useCallback(async () => {
    try {
      const forms = await getAvailableFormTests();
      setAvailableForms(forms);
      logger.info(`Loaded ${forms.length} available form tests`, { 
        formCount: forms.length
      }, 'FormValidationDiagnostics');
      return forms;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      logger.error("Failed to load available form tests", err, 'FormValidationDiagnostics');
      toast.error("Failed to load form tests", {
        description: errorMessage
      });
      return [];
    }
  }, []);

  const runAllFormTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      logger.info("Running all form validation tests", {}, 'FormValidationDiagnostics');
      toast.info("Running form validation tests", {
        description: "Testing all forms with valid and invalid data..."
      });
      
      const diagnosticResults = await runFormValidationDiagnostics();
      setResults(diagnosticResults);
      setLastRun(new Date().toISOString());
      
      // Log test results
      const passedTests = diagnosticResults.filter((result: any) => 
        result.lastTestResult?.success).length;
      const failedTests = diagnosticResults.length - passedTests;
      
      logger.info("Form validation tests completed", { 
        total: diagnosticResults.length,
        passed: passedTests,
        failed: failedTests
      }, 'FormValidationDiagnostics');
      
      if (failedTests > 0) {
        toast.warning(`Form validation tests completed with ${failedTests} issues`, {
          description: `${passedTests} passed, ${failedTests} failed. Check the results for details.`
        });
      } else {
        toast.success("All form validation tests passed", {
          description: `${passedTests} forms tested successfully`
        });
      }
      
      return diagnosticResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      logger.error("Error running form validation tests", err, 'FormValidationDiagnostics');
      toast.error("Failed to run form validation tests", {
        description: errorMessage
      });
      
      return [];
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runFormTest = useCallback(async (formId: string, testCaseIndex?: number) => {
    setIsRunning(true);
    setError(null);
    
    try {
      logger.info(`Running validation test for form: ${formId}`, {
        formId,
        testCaseIndex
      }, 'FormValidationDiagnostics');
      
      const testResult = await runSingleFormValidationTest(formId, testCaseIndex);
      setLastRun(new Date().toISOString());
      
      // Add the new result to the existing results
      if (testResult) {
        setResults(prev => {
          // Find if we already have results for this form
          const existingIndex = prev.findIndex(r => r.form === formId);
          
          // Determine status based on test result
          let status: "success" | "warning" | "error" = "success";
          let message = "Form validation passed all tests";
          
          if (!testResult.success) {
            status = "error";
            message = `Form validation failed for ${formId}`;
          }
          
          // Add status and message to test result
          const enhancedResult = {
            ...testResult,
            status,
            message
          };
          
          if (existingIndex >= 0) {
            // Update existing entry
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastTestResult: enhancedResult
            };
            return updated;
          } else {
            // Add new entry
            return [...prev, {
              form: formId,
              formName: `${formId.charAt(0).toUpperCase() + formId.slice(1)} Form`,
              lastTestResult: enhancedResult
            }];
          }
        });
        
        // Log test result
        if (!testResult.success) {
          logger.warning(`Form validation test failed for ${formId}`, {
            formId
          }, 'FormValidationDiagnostics');
          
          toast.warning(`Validation issues in ${formId}`, {
            description: `Form validation failed for ${formId}`
          });
        } else {
          logger.info(`Form validation test passed for ${formId}`, {
            formId
          }, 'FormValidationDiagnostics');
          
          toast.success(`Validation passed for ${formId}`, {
            description: "All form fields validated correctly"
          });
        }
      }
      
      return testResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      logger.error(`Error testing form ${formId}`, err, 'FormValidationDiagnostics');
      toast.error(`Failed to test form ${formId}`, {
        description: errorMessage
      });
      
      return { success: false, message: errorMessage } as FormValidationTestResult;
    } finally {
      setIsRunning(false);
    }
  }, []);

  // Initialize available forms on mount
  useEffect(() => {
    loadAvailableForms();
  }, [loadAvailableForms]);

  return {
    results,
    isRunning,
    lastRun,
    error,
    availableForms,
    runAllFormTests,
    runFormTest,
    loadAvailableForms
  };
}
