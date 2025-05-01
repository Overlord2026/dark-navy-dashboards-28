
import { useState, useCallback } from 'react';
import { FormField, FormValidationTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export function useFormValidationDiagnostics() {
  const [results, setResults] = useState<FormValidationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [availableForms, setAvailableForms] = useState<{id: string, name: string}[]>([
    { id: "login-form", name: "Login Form" },
    { id: "profile-form", name: "Profile Form" },
    { id: "payment-form", name: "Payment Form" }
  ]);
  
  const loadAvailableForms = useCallback(() => {
    // This would typically load available forms from your services
    console.log("Loading available forms...");
    // Forms are already set in state
    return availableForms;
  }, [availableForms]);

  const validateForm = useCallback((
    formId: string, 
    formName: string,
    fields: FormField[],
    formValues: Record<string, any>
  ) => {
    setIsRunning(true);
    
    // Mock implementation for form validation diagnostics
    const invalidFields: string[] = [];
    const validationDetails = { invalidFields };
    
    // Do validation checks...
    
    const newResult: FormValidationTestResult = {
      id: uuidv4(),
      formId,
      formName,
      testName: `Validation test for ${formName}`,
      status: invalidFields.length === 0 ? "pass" : "fail",
      message: invalidFields.length === 0 
        ? "Form validation successful" 
        : `Form has ${invalidFields.length} invalid fields`,
      timestamp: new Date().toISOString(),
      validationDetails,
      fields: fields.map(field => ({
        name: field.name,
        type: field.type,
        status: invalidFields.includes(field.name) ? "fail" : "pass",
        validations: field.validations || []
      }))
    };
    
    setResults(prev => [...prev, newResult]);
    setIsRunning(false);
    
    return newResult;
  }, []);

  const runFormTest = useCallback(async (formId: string, testIndex?: number) => {
    setIsRunning(true);
    setError(null);
    
    try {
      // Mock implementation that would run tests for a specific form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const form = availableForms.find(f => f.id === formId);
      if (!form) throw new Error(`Form with ID ${formId} not found`);
      
      const mockFields: FormField[] = [
        { name: "field1", type: "text", required: true },
        { name: "field2", type: "email", required: true, validations: ["email"] }
      ];
      
      const result = validateForm(formId, form.name, mockFields, {});
      setLastRun(new Date().toISOString());
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error("Error running form test:", error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [availableForms, validateForm]);

  const runAllFormTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    const newResults: FormValidationTestResult[] = [];
    
    try {
      // Run tests for each available form
      for (const form of availableForms) {
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockFields: FormField[] = [
          { name: "field1", type: "text", required: true },
          { name: "field2", type: "email", required: true, validations: ["email"] }
        ];
        
        const result = validateForm(form.id, form.name, mockFields, {});
        newResults.push(result);
      }
      
      setResults(newResults);
      setLastRun(new Date().toISOString());
      return newResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error("Error running all form tests:", error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [availableForms, validateForm]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isRunning,
    lastRun,
    error,
    availableForms,
    validateForm,
    runFormTest,
    runAllFormTests,
    loadAvailableForms,
    clearResults
  };
}
