import { useState, useEffect, useCallback } from 'react';
import { FormValidationTestResult } from '@/types/diagnostics';

interface UseFormValidationDiagnosticsProps {
  formId?: string;
  enabled?: boolean;
}

// Updated mock data structure to match the FormValidationTestResult type
const mockFormValidationTests: FormValidationTestResult[] = [
  {
    id: "test-1",
    name: 'Register Form Email Validation',
    formId: "register-form",
    formName: "register-form",
    location: '/auth/register',
    status: 'success',
    message: 'Email validation working correctly',
    timestamp: Date.now() - 300000,
    fields: [
      {
        id: "email-field",
        name: 'email',
        type: 'email',
        validations: ['required', 'email'],
        value: 'test@example.com',
        status: 'success',
        errors: []
      }
    ]
  },
  {
    id: "test-2",
    name: 'Register Form Password Validation',
    formId: "register-form",
    formName: "register-form",
    location: '/auth/register',
    status: 'warning',
    message: 'Password strength indicator showing warnings inconsistently',
    timestamp: Date.now() - 200000,
    fields: [
      {
        id: "password-field",
        name: 'password',
        type: 'password',
        validations: ['required', 'minLength:8'],
        value: 'Password123',
        status: 'warning',
        errors: ['Password not strong enough']
      }
    ]
  },
  {
    id: "test-3",
    name: 'Login Form Email Validation',
    formId: "login-form",
    formName: "login-form",
    location: '/auth/login',
    status: 'error',
    message: 'Email validation not triggering on blur',
    timestamp: Date.now() - 100000,
    fields: [
      {
        id: "email-field",
        name: 'email',
        type: 'email',
        validations: ['required', 'email'],
        value: 'invalid-email',
        status: 'error',
        errors: ['Invalid email format']
      }
    ]
  },
  {
    id: "test-4",
    name: 'Contact Form Message Validation',
    formId: "contact-form",
    formName: "contact-form",
    location: '/contact',
    status: 'success',
    message: 'Message length validation working correctly',
    timestamp: Date.now() - 50000,
    fields: [
      {
        id: "message-field",
        name: 'message',
        type: 'text',
        validations: ['required', 'minLength:10'],
        value: 'This is a test message with proper length',
        status: 'success',
        errors: []
      }
    ]
  }
];

// Mock available forms
const availableFormsList = [
  { id: 'register-form', name: 'User Registration', location: '/auth/register' },
  { id: 'login-form', name: 'User Login', location: '/auth/login' },
  { id: 'contact-form', name: 'Contact Form', location: '/contact' },
  { id: 'profile-form', name: 'Profile Update', location: '/profile' },
];

export const useFormValidationDiagnostics = (props?: UseFormValidationDiagnosticsProps) => {
  const formId = props?.formId;
  const enabled = props?.enabled ?? true;
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastRun, setLastRun] = useState<number | null>(null);
  const [results, setResults] = useState<FormValidationTestResult[]>([]);
  const [availableForms, setAvailableForms] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const loadAvailableForms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 300));
      setAvailableForms(availableFormsList);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runFormValidation = useCallback(async () => {
    if (!formId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock results for the specified form
      const formResults = mockFormValidationTests.filter(test => 
        test.formId === formId || test.form === formId || test.formName === formId
      );
      setResults(formResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  const runFormTest = useCallback(async (formId: string, testIndex?: number) => {
    setIsRunning(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Filter mock results for the specified form
      const formResults = mockFormValidationTests.filter(test => 
        test.formId === formId || test.form === formId || test.formName === formId
      );
      
      if (testIndex !== undefined && formResults[testIndex]) {
        setResults([formResults[testIndex]]);
      } else {
        setResults(formResults);
      }
      
      setLastRun(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runAllFormTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResults(mockFormValidationTests);
      setLastRun(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && formId) {
      runFormValidation();
    }
  }, [formId, enabled, runFormValidation]);

  const getFieldStatus = useCallback((fieldName: string): 'success' | 'warning' | 'error' | 'idle' => {
    for (const result of results) {
      const field = result.fields?.find(f => f.name === fieldName);
      if (field) {
        if (field.status) return field.status;
        if (!field.valid) return 'error';
        return field.errors && field.errors.length > 0 ? 'warning' : 'success';
      }
    }
    return 'idle';
  }, [results]);

  const getFieldMessage = useCallback((fieldName: string): string | null => {
    for (const result of results) {
      const field = result.fields?.find(f => f.name === fieldName);
      if (field) {
        if (field.message) return field.message;
        if (field.errors && field.errors.length > 0) return field.errors[0];
      }
    }
    return null;
  }, [results]);

  const hasErrors = useCallback((): boolean => {
    return results.some(result => result.status === 'error');
  }, [results]);

  const hasWarnings = useCallback((): boolean => {
    return results.some(result => result.status === 'warning');
  }, [results]);

  const getErrorCount = useCallback((): number => {
    return results.filter(result => result.status === 'error').length;
  }, [results]);

  const getWarningCount = useCallback((): number => {
    return results.filter(result => result.status === 'warning').length;
  }, [results]);

  const getSuccessCount = useCallback((): number => {
    return results.filter(result => result.status === 'success').length;
  }, [results]);

  return {
    isLoading,
    isRunning,
    lastRun,
    results,
    error,
    availableForms,
    runFormValidation,
    runFormTest,
    runAllFormTests,
    loadAvailableForms,
    getFieldStatus,
    getFieldMessage,
    hasErrors,
    hasWarnings,
    getErrorCount,
    getWarningCount,
    getSuccessCount
  };
};
