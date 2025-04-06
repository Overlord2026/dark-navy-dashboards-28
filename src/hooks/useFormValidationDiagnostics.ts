
import { useState, useEffect } from 'react';
import { FormValidationTestResult } from '@/services/diagnostics/types';

interface UseFormValidationDiagnosticsProps {
  formId: string;
  enabled?: boolean;
}

const mockFormValidationTests: FormValidationTestResult[] = [
  {
    id: 'form-1',
    formId: 'register-form',
    field: 'email',
    status: 'success',
    message: 'Email validation working correctly',
    timestamp: Date.now() - 300000
  },
  {
    id: 'form-2',
    formId: 'register-form',
    field: 'password',
    status: 'warning',
    message: 'Password strength indicator showing warnings inconsistently',
    timestamp: Date.now() - 200000
  },
  {
    id: 'form-3',
    formId: 'login-form',
    field: 'email',
    status: 'error',
    message: 'Email validation not triggering on blur',
    timestamp: Date.now() - 100000
  },
  {
    id: 'form-4',
    formId: 'contact-form',
    field: 'message',
    status: 'success',
    message: 'Message length validation working correctly',
    timestamp: Date.now() - 50000
  }
];

export const useFormValidationDiagnostics = ({ 
  formId, 
  enabled = true 
}: UseFormValidationDiagnosticsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<FormValidationTestResult[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const runFormValidation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock results for the specified form
      const formResults = mockFormValidationTests.filter(test => test.formId === formId);
      setResults(formResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      runFormValidation();
    }
  }, [formId, enabled]);

  const getFieldStatus = (fieldName: string): 'success' | 'warning' | 'error' | 'idle' => {
    const fieldTest = results.find(test => test.field === fieldName);
    return fieldTest ? fieldTest.status : 'idle';
  };

  const getFieldMessage = (fieldName: string): string | null => {
    const fieldTest = results.find(test => test.field === fieldName);
    return fieldTest ? fieldTest.message : null;
  };

  const hasErrors = (): boolean => {
    return results.some(result => result.status === 'error');
  };

  const hasWarnings = (): boolean => {
    return results.some(result => result.status === 'warning');
  };

  const getErrorCount = (): number => {
    return results.filter(result => result.status === 'error').length;
  };

  const getWarningCount = (): number => {
    return results.filter(result => result.status === 'warning').length;
  };

  const getSuccessCount = (): number => {
    return results.filter(result => result.status === 'success').length;
  };

  return {
    isLoading,
    results,
    error,
    runFormValidation,
    getFieldStatus,
    getFieldMessage,
    hasErrors,
    hasWarnings,
    getErrorCount,
    getWarningCount,
    getSuccessCount
  };
};
