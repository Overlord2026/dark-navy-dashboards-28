import { useState, useCallback } from 'react';
import { SwagRetirementAnalysisInput, SwagRetirementAnalysisResults } from '@/types/swag-retirement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSwagRetirementCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSwagRetirement = useCallback(async (
    inputs: SwagRetirementAnalysisInput
  ): Promise<SwagRetirementAnalysisResults> => {
    setLoading(true);
    setError(null);

    try {
      // Call the enhanced retirement analyzer edge function
      const { data, error: functionError } = await supabase.functions.invoke('retirement-analyzer', {
        body: {
          inputs,
          analysisType: 'swag_comprehensive',
          includePhases: true
        }
      });

      if (functionError) throw functionError;

      // Process the enhanced results with SWAG phases
      const enhancedResults = await processSwagResults(data, inputs);
      
      toast.success('SWAG Retirement Analysis Complete!');
      return enhancedResults;

    } catch (err) {
      console.error('SWAG calculation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processSwagResults = async (
    baseResults: any,
    inputs: SwagRetirementAnalysisInput
  ): Promise<SwagRetirementAnalysisResults> => {
    
    // Calculate phase allocations based on assets and rules
    const phaseAllocations = calculatePhaseAllocations(inputs);
    
    // Project each phase performance
    const phaseProjections = calculatePhaseProjections(inputs, phaseAllocations);
    
    // Create investment allocation summary
    const investmentAllocationSummary = createAllocationSummary(inputs, phaseAllocations);

    return {
      ...baseResults,
      phaseAllocations,
      phaseProjections,
      investmentAllocationSummary
    };
  };

  const calculatePhaseAllocations = (inputs: SwagRetirementAnalysisInput) => {
    const totalAssets = calculateTotalAssets(inputs.profile.assets);
    
    return inputs.phases.map(phase => {
      // Apply allocation rules based on phase timing and client age
      const allocatedAmount = applyPhaseAllocationRules(phase, totalAssets, inputs);
      const projectedIncome = calculatePhaseIncome(phase, allocatedAmount);
      const fundingStatus = determineFundingStatus(phase, allocatedAmount, inputs);
      
      return {
        phaseId: phase.id,
        allocatedAmount,
        projectedIncome,
        fundingStatus,
        recommendedActions: generatePhaseRecommendations(phase, fundingStatus)
      };
    });
  };

  const calculatePhaseProjections = (
    inputs: SwagRetirementAnalysisInput,
    allocations: any[]
  ) => {
    return inputs.phases.map(phase => {
      const allocation = allocations.find(a => a.phaseId === phase.id);
      const currentAge = inputs.profile.primaryClient.age;
      const yearsToPhase = Math.max(0, phase.yearStart - (inputs.goals.retirementAge - currentAge));
      
      // Project growth and income for this phase
      const projectedBalance = allocation?.allocatedAmount * Math.pow(1.07, yearsToPhase) || 0;
      const projectedIncome = projectedBalance * 0.04; // 4% withdrawal assumption
      const shortfall = Math.max(0, phase.fundingRequirement - projectedIncome);
      
      return {
        phaseId: phase.id,
        projectedBalance,
        projectedIncome,
        shortfall,
        confidenceLevel: calculatePhaseConfidence(phase, projectedBalance, shortfall),
        riskFactors: identifyPhaseRisks(phase, shortfall)
      };
    });
  };

  const createAllocationSummary = (
    inputs: SwagRetirementAnalysisInput,
    allocations: any[]
  ) => {
    const totalPortfolioValue = calculateTotalAssets(inputs.profile.assets);
    
    const allocationByPhase = allocations.map(allocation => ({
      phaseId: allocation.phaseId,
      allocation: allocation.allocatedAmount,
      percentage: (allocation.allocatedAmount / totalPortfolioValue) * 100
    }));

    return {
      totalPortfolioValue,
      allocationByPhase,
      allocationByAccount: [], // TODO: Implement account-level mapping
      rebalancingNeeded: checkRebalancingNeeded(allocations),
      recommendations: generateAllocationRecommendations(allocations, inputs)
    };
  };

  // Helper functions
  const calculateTotalAssets = (assets: any) => {
    let total = 0;
    Object.values(assets).forEach((category: any) => {
      if (Array.isArray(category)) {
        total += category.reduce((sum: number, asset: any) => sum + (asset.balance || asset.currentValue || 0), 0);
      }
    });
    return total;
  };

  const applyPhaseAllocationRules = (phase: any, totalAssets: number, inputs: any) => {
    // Default allocation logic - can be enhanced with admin rules
    const baseAllocation = totalAssets * 0.25; // Equal weight by default
    
    // Adjust based on phase timing and client age
    const currentAge = inputs.profile.primaryClient.age;
    const yearsToPhase = Math.max(0, phase.yearStart - (inputs.goals.retirementAge - currentAge));
    
    // Earlier phases get more conservative allocations
    const timingMultiplier = yearsToPhase < 5 ? 1.2 : yearsToPhase > 15 ? 0.8 : 1.0;
    
    return baseAllocation * timingMultiplier;
  };

  const calculatePhaseIncome = (phase: any, allocatedAmount: number) => {
    // Conservative income assumption based on phase type
    const incomeRate = phase.name.includes('Income') ? 0.05 : 
                      phase.name.includes('Growth') ? 0.03 : 0.04;
    return allocatedAmount * incomeRate;
  };

  const determineFundingStatus = (phase: any, allocatedAmount: number, inputs: any) => {
    const requiredAmount = phase.fundingRequirement || 0;
    const ratio = allocatedAmount / requiredAmount;
    
    if (ratio >= 1.1) return 'overfunded';
    if (ratio >= 0.9) return 'on_track';
    return 'underfunded';
  };

  const generatePhaseRecommendations = (phase: any, status: string) => {
    const recommendations = [];
    
    if (status === 'underfunded') {
      recommendations.push(`Increase contributions to ${phase.name} phase`);
      recommendations.push('Consider rebalancing from other phases');
    } else if (status === 'overfunded') {
      recommendations.push('Consider tax-loss harvesting opportunities');
    }
    
    return recommendations;
  };

  const calculatePhaseConfidence = (phase: any, balance: number, shortfall: number) => {
    if (shortfall === 0) return 95;
    const shortfallRatio = shortfall / (balance || 1);
    return Math.max(20, 95 - (shortfallRatio * 100));
  };

  const identifyPhaseRisks = (phase: any, shortfall: number) => {
    const risks = [];
    if (shortfall > 0) risks.push('Funding shortfall');
    if (phase.name.includes('Growth')) risks.push('Market volatility');
    if (phase.name.includes('Income')) risks.push('Interest rate risk');
    return risks;
  };

  const checkRebalancingNeeded = (allocations: any[]) => {
    // Simple check - can be enhanced
    return allocations.some(allocation => allocation.fundingStatus === 'underfunded');
  };

  const generateAllocationRecommendations = (allocations: any[], inputs: any) => {
    const recommendations = [];
    
    const underfunded = allocations.filter(a => a.fundingStatus === 'underfunded');
    if (underfunded.length > 0) {
      recommendations.push('Rebalance portfolio to address underfunded phases');
    }
    
    return recommendations;
  };

  return {
    calculateSwagRetirement,
    loading,
    error
  };
};