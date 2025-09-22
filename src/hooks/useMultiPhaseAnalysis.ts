/**
 * React Hook for Multi-Phase Performance Analysis
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  MultiPhaseEngine, 
  MultiPhaseInput, 
  MultiPhaseResults,
  PhaseId,
  AlternativeAssetConfig 
} from '@/engines/multiPhase/multiPhaseEngine';

export interface UseMultiPhaseAnalysisProps {
  initialInput?: Partial<MultiPhaseInput>;
}

export interface MultiPhaseAnalysisState {
  input: MultiPhaseInput;
  results: MultiPhaseResults | null;
  isAnalyzing: boolean;
  error: string | null;
}

const DEFAULT_INPUT: MultiPhaseInput = {
  currentAge: 45,
  retirementAge: 65,
  portfolioValue: 500000,
  annualContribution: 25000,
  targetIncome: 80000,
  taxRates: {
    ordinary: 0.24,
    qualified: 0.15,
    ltg: 0.15,
    stg: 0.24
  },
  alternativeAssets: {
    privateCredit: {
      expectedReturn: 0.09,
      maxDrawdown: 0.08,
      liquidityDays: 90,
      minimumInvestment: 250000
    },
    infrastructure: {
      expectedReturn: 0.08,
      maxDrawdown: 0.15,
      liquidityDays: 180,
      minimumInvestment: 500000
    },
    cryptoStaking: {
      stakingAPR: 0.06,
      slashingProb: 0.02,
      unbondDays: 21,
      taxRate: 0.24
    }
  }
};

export function useMultiPhaseAnalysis({ initialInput }: UseMultiPhaseAnalysisProps = {}) {
  const [state, setState] = useState<MultiPhaseAnalysisState>({
    input: { ...DEFAULT_INPUT, ...initialInput },
    results: null,
    isAnalyzing: false,
    error: null
  });

  const runAnalysis = useCallback(async (newInput?: Partial<MultiPhaseInput>) => {
    const analysisInput = newInput ? { ...state.input, ...newInput } : state.input;
    
    setState(prev => ({
      ...prev,
      input: analysisInput,
      isAnalyzing: true,
      error: null
    }));

    try {
      // Simulate async analysis (in real implementation, this might involve API calls)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = MultiPhaseEngine.runMultiPhaseAnalysis(analysisInput);
      
      setState(prev => ({
        ...prev,
        results,
        isAnalyzing: false
      }));
      
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isAnalyzing: false
      }));
      throw error;
    }
  }, [state.input]);

  const updateInput = useCallback((updates: Partial<MultiPhaseInput>) => {
    setState(prev => ({
      ...prev,
      input: { ...prev.input, ...updates }
    }));
  }, []);

  const updateAlternativeAssets = useCallback((updates: Partial<AlternativeAssetConfig>) => {
    setState(prev => ({
      ...prev,
      input: {
        ...prev.input,
        alternativeAssets: { ...prev.input.alternativeAssets, ...updates }
      }
    }));
  }, []);

  const updateAdvisorOverrides = useCallback((overrides: MultiPhaseInput['advisorOverrides']) => {
    setState(prev => ({
      ...prev,
      input: { ...prev.input, advisorOverrides: overrides }
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState({
      input: { ...DEFAULT_INPUT, ...initialInput },
      results: null,
      isAnalyzing: false,
      error: null
    });
  }, [initialInput]);

  // Calculated properties
  const currentPhase = useMemo<PhaseId>(() => {
    const { currentAge, retirementAge } = state.input;
    const yearsToRetirement = retirementAge - currentAge;
    
    if (yearsToRetirement > 10) return 'growth';
    if (yearsToRetirement > 0) return 'income_later';
    if (currentAge < retirementAge + 10) return 'income_now';
    return 'legacy';
  }, [state.input.currentAge, state.input.retirementAge]);

  const hasAlternativeAssetAccess = useMemo(() => ({
    privateCredit: state.input.portfolioValue >= 250000,
    infrastructure: state.input.portfolioValue >= 500000,
    cryptoStaking: state.input.portfolioValue >= 10000
  }), [state.input.portfolioValue]);

  const performanceComparison = useMemo(() => {
    if (!state.results) return null;
    
    const { traditional, multiPhase } = state.results.projectedOutcomes;
    
    return {
      finalValueImprovement: ((multiPhase.finalValue - traditional.finalValue) / traditional.finalValue) * 100,
      drawdownReduction: ((traditional.maxDrawdown - multiPhase.maxDrawdown) / traditional.maxDrawdown) * 100,
      sequenceRiskReduction: ((traditional.sequenceRisk - multiPhase.sequenceRisk) / traditional.sequenceRisk) * 100,
      incomeGapReduction: traditional.incomeShortfall > 0 
        ? ((traditional.incomeShortfall - multiPhase.incomeShortfall) / traditional.incomeShortfall) * 100
        : 0
    };
  }, [state.results]);

  return {
    // State
    input: state.input,
    results: state.results,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    
    // Calculated properties
    currentPhase,
    hasAlternativeAssetAccess,
    performanceComparison,
    
    // Actions
    runAnalysis,
    updateInput,
    updateAlternativeAssets,
    updateAdvisorOverrides,
    resetToDefaults
  };
}