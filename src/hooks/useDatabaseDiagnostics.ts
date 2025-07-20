import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  test_number: number;
  area_feature: string;
  test_case: string;
  expected_result: string;
  actual_result: string;
  pass_fail: 'PASS' | 'FAIL';
  notes: string;
}

export interface DatabaseDiagnosticsState {
  isLoading: boolean;
  isRunning: boolean;
  lastRun: number | null;
  results: DatabaseTestResult[];
  error: Error | null;
}

export const useDatabaseDiagnostics = () => {
  const [state, setState] = useState<DatabaseDiagnosticsState>({
    isLoading: false,
    isRunning: false,
    lastRun: null,
    results: [],
    error: null
  });

  const runDatabaseTests = useCallback(async () => {
    setState(prev => ({ ...prev, isRunning: true, error: null }));

    try {
      const { data, error } = await supabase.rpc('run_database_review_tests');
      
      if (error) {
        throw new Error(`Database test error: ${error.message}`);
      }

      const formattedResults: DatabaseTestResult[] = (data || []).map(item => ({
        ...item,
        pass_fail: item.pass_fail as 'PASS' | 'FAIL'
      }));

      setState(prev => ({
        ...prev,
        results: formattedResults,
        lastRun: Date.now(),
        isRunning: false,
        error: null
      }));

      return data || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown database test error');
      setState(prev => ({
        ...prev,
        isRunning: false,
        error
      }));
      throw error;
    }
  }, []);

  const runTransferValidationTests = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.rpc('test_transfer_validation');
      
      if (error) {
        throw new Error(`Transfer validation test error: ${error.message}`);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      return data || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown transfer validation error');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
      throw error;
    }
  }, []);

  const runHsaComplianceTests = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.rpc('test_hsa_compliance');
      
      if (error) {
        throw new Error(`HSA compliance test error: ${error.message}`);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      return data || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown HSA compliance error');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
      throw error;
    }
  }, []);

  const runAuditLoggingTests = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.rpc('test_audit_logging');
      
      if (error) {
        throw new Error(`Audit logging test error: ${error.message}`);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      return data || [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown audit logging error');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    runDatabaseTests,
    runTransferValidationTests,
    runHsaComplianceTests,
    runAuditLoggingTests
  };
};