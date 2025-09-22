import { useState, useMemo } from 'react';
import { SequenceRiskEngine, SequenceRiskInput, SequenceRiskResults } from '@/engines/sequenceRisk/sequenceRiskEngine';
import { sequenceRiskScenarios } from '@/data/historicalReturns';

export const useSequenceRiskAnalysis = () => {
  const [input, setInput] = useState<SequenceRiskInput>({
    initialPortfolio: 1000000,
    annualWithdrawal: 50000,
    withdrawalRate: 5.0,
    retirementAge: 65,
    longevityAge: 95,
    startYear: 2000,
    inflationAdjustedWithdrawals: true,
    assetAllocation: {
      stocks: 100,
      bonds: 0,
      alternatives: 0
    },
    phaseProtection: {
      enabled: false,
      incomeNowYears: 12,
      incomeNowReturn: 0.08,
      maxDrawdown: 0.04
    }
  });

  const [compareScenarios, setCompareScenarios] = useState<number[]>([2000, 2008]);
  const [loading, setLoading] = useState(false);

  // Calculate single scenario results
  const results = useMemo(() => {
    setLoading(true);
    try {
      const analysis = SequenceRiskEngine.analyzeSequenceRisk(input);
      setLoading(false);
      return analysis;
    } catch (error) {
      console.error('Sequence risk analysis error:', error);
      setLoading(false);
      return null;
    }
  }, [input]);

  // Calculate phase protection comparison
  const phaseComparison = useMemo(() => {
    if (!input.phaseProtection?.enabled) return null;
    
    setLoading(true);
    try {
      const comparison = SequenceRiskEngine.analyzePhaseProtectionBenefit(input);
      setLoading(false);
      return comparison;
    } catch (error) {
      console.error('Phase protection analysis error:', error);
      setLoading(false);
      return null;
    }
  }, [input]);

  // Calculate scenario comparisons
  const scenarioComparisons = useMemo(() => {
    if (compareScenarios.length === 0) return [];
    
    setLoading(true);
    try {
      const comparisons = SequenceRiskEngine.compareScenarios(input, compareScenarios);
      setLoading(false);
      return comparisons;
    } catch (error) {
      console.error('Scenario comparison error:', error);
      setLoading(false);
      return [];
    }
  }, [input, compareScenarios]);

  const updateInput = (updates: Partial<SequenceRiskInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  };

  const updateAssetAllocation = (allocation: Partial<SequenceRiskInput['assetAllocation']>) => {
    setInput(prev => ({
      ...prev,
      assetAllocation: { ...prev.assetAllocation, ...allocation }
    }));
  };

  const updatePhaseProtection = (protection: Partial<SequenceRiskInput['phaseProtection']>) => {
    setInput(prev => ({
      ...prev,
      phaseProtection: { ...prev.phaseProtection, ...protection }
    }));
  };

  const loadPresetScenario = (scenarioKey: keyof typeof sequenceRiskScenarios) => {
    const scenario = sequenceRiskScenarios[scenarioKey];
    updateInput({ startYear: scenario.startYear });
  };

  const resetToDefaults = () => {
    setInput({
      initialPortfolio: 1000000,
      annualWithdrawal: 50000,
      withdrawalRate: 5.0,
      retirementAge: 65,
      longevityAge: 95,
      startYear: 2000,
      inflationAdjustedWithdrawals: true,
      assetAllocation: {
        stocks: 100,
        bonds: 0,
        alternatives: 0
      },
      phaseProtection: {
        enabled: false,
        incomeNowYears: 12,
        incomeNowReturn: 0.08,
        maxDrawdown: 0.04
      }
    });
  };

  return {
    input,
    results,
    phaseComparison,
    scenarioComparisons,
    compareScenarios,
    loading,
    updateInput,
    updateAssetAllocation,
    updatePhaseProtection,
    setCompareScenarios,
    loadPresetScenario,
    resetToDefaults
  };
};