
import { useState, useCallback } from 'react';
import { 
  runFormValidationDiagnostics,
  runSingleFormValidationTest,
  getAvailableFormTests
} from '@/services/diagnostics/formValidationDiagnostics';

export function useFormValidationDiagnostics() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [availableForms, setAvailableForms] = useState<any[]>([]);

  const loadAvailableForms = useCallback(() => {
    const forms = getAvailableFormTests();
    setAvailableForms(forms);
    return forms;
  }, []);

  const runAllFormTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const diagnosticResults = await runFormValidationDiagnostics();
      setResults(diagnosticResults);
      setLastRun(new Date().toISOString());
      return diagnosticResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      return [];
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runFormTest = useCallback(async (formId: string, testCaseIndex?: number) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const testResult = await runSingleFormValidationTest(formId, testCaseIndex);
      setLastRun(new Date().toISOString());
      
      // Add the new result to the existing results
      if (testResult.success) {
        setResults(prev => {
          // Find if we already have results for this form
          const existingIndex = prev.findIndex(r => r.form === formId);
          
          if (existingIndex >= 0) {
            // Update existing entry
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastTestResult: testResult
            };
            return updated;
          } else {
            // Add new entry
            return [...prev, {
              form: formId,
              formName: `${formId.charAt(0).toUpperCase() + formId.slice(1)} Form`,
              lastTestResult: testResult
            }];
          }
        });
      }
      
      return testResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(err instanceof Error ? err : new Error(errorMessage));
      return { success: false, message: errorMessage };
    } finally {
      setIsRunning(false);
    }
  }, []);

  // Initialize available forms on mount
  useState(() => {
    loadAvailableForms();
  });

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

// Export interface for FormValidationTestResult
export interface FormValidationResult {
  form: string;
  formName: string;
  status: "success" | "warning" | "error";
  message?: string;
  fields?: {
    fieldName: string;
    fieldType: string;
    status: "success" | "warning" | "error";
    message?: string;
  }[];
  testCases?: any[];
  validationStats?: {
    total: number;
    passed: number;
    failed: number;
    fieldValidations: number;
    failedFieldValidations: number;
  };
  lastTestResult?: any;
}
