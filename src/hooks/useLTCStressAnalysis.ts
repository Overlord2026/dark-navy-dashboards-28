/**
 * React Hook for Long-Term Care Stress Analysis
 */

import { useState, useCallback, useMemo } from 'react';
import { LTCStressEngine, type LTCStressTestInputs, type LTCComprehensiveAnalysis } from '@/engines/stressTesting/ltcStressEngine';

export interface UseLTCStressAnalysisReturn {
  inputs: LTCStressTestInputs;
  setInputs: (inputs: LTCStressTestInputs) => void;
  updateInputs: (updates: Partial<LTCStressTestInputs>) => void;
  analysis: LTCComprehensiveAnalysis | null;
  loading: boolean;
  error: string | null;
  runAnalysis: () => void;
  clearResults: () => void;
}

const defaultInputs: LTCStressTestInputs = {
  primaryPerson: {
    currentAge: 55,
    gender: 'male',
    healthStatus: 'good',
    familyHistory: 'average',
    smoker: false,
    exerciseLevel: 'moderate',
    chronicConditions: []
  },
  currentNetWorth: 2000000,
  liquidAssets: 500000,
  annualRetirementIncome: 120000,
  inflationRate: 0.03,
  discountRate: 0.04,
  currentState: 'CA',
  primaryInsurance: {
    hasInsurance: false
  },
  preferredCareType: 'nursing_home',
  carePreference: 'home_first'
};

export function useLTCStressAnalysis(): UseLTCStressAnalysisReturn {
  const [inputs, setInputs] = useState<LTCStressTestInputs>(defaultInputs);
  const [analysis, setAnalysis] = useState<LTCComprehensiveAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const engine = useMemo(() => new LTCStressEngine(), []);

  const updateInputs = useCallback((updates: Partial<LTCStressTestInputs>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  }, []);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate async processing for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = engine.runComprehensiveAnalysis(inputs);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  }, [inputs, engine]);

  const clearResults = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    inputs,
    setInputs,
    updateInputs,
    analysis,
    loading,
    error,
    runAnalysis,
    clearResults
  };
}