import { useState, useMemo } from 'react';
import { useEventTracking } from '@/hooks/useEventTracking';

export interface LongevityInputs {
  age: number;
  currentAssets: number;
  annualIncome: number;
  expectedRetirementAge: number;
  annualSpending: number;
  healthspanYears: number;
  projectedLifespan: number;
  inflationRate: number;
  bucketAllocations: {
    incomeNow: number; // Years 1-5
    incomeLater: number; // Years 6-15
    growth: number; // Years 16+
    legacy: number; // Estate/legacy
  };
}

export interface BucketPlan {
  incomeNow: {
    allocation: number;
    value: number;
    purpose: string;
    years: string;
  };
  incomeLater: {
    allocation: number;
    value: number;
    purpose: string;
    years: string;
  };
  growth: {
    allocation: number;
    value: number;
    purpose: string;
    years: string;
  };
  legacy: {
    allocation: number;
    value: number;
    purpose: string;
    years: string;
  };
}

export interface ScenarioResults {
  worstCase: {
    moneyLastsYears: number;
    finalValue: number;
    shortfall: number;
  };
  averageCase: {
    moneyLastsYears: number;
    finalValue: number;
    surplus: number;
  };
  inflationAdjusted: {
    annualWithdrawals: Array<{ year: number; nominal: number; real: number }>;
    totalRealSpending: number;
  };
}

export interface LongevityScore {
  score: number;
  level: 'Excellent' | 'Good' | 'Caution' | 'High Risk';
  color: string;
  message: string;
  recommendations: string[];
}

const defaultInputs: LongevityInputs = {
  age: 55,
  currentAssets: 1000000,
  annualIncome: 150000,
  expectedRetirementAge: 65,
  annualSpending: 80000,
  healthspanYears: 25,
  projectedLifespan: 90,
  inflationRate: 3,
  bucketAllocations: {
    incomeNow: 20,
    incomeLater: 30,
    growth: 40,
    legacy: 10
  }
};

export function useLongevityScorecard() {
  const { trackFeatureUsed } = useEventTracking();
  const [inputs, setInputs] = useState<LongevityInputs>(defaultInputs);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateInput = (field: keyof LongevityInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateBucketAllocation = (bucket: keyof LongevityInputs['bucketAllocations'], value: number) => {
    setInputs(prev => ({
      ...prev,
      bucketAllocations: {
        ...prev.bucketAllocations,
        [bucket]: value
      }
    }));
  };

  const bucketPlan = useMemo((): BucketPlan => {
    const { currentAssets, bucketAllocations } = inputs;
    
    return {
      incomeNow: {
        allocation: bucketAllocations.incomeNow,
        value: currentAssets * (bucketAllocations.incomeNow / 100),
        purpose: 'Conservative investments for immediate income needs',
        years: 'Years 1-5'
      },
      incomeLater: {
        allocation: bucketAllocations.incomeLater,
        value: currentAssets * (bucketAllocations.incomeLater / 100),
        purpose: 'Moderate growth for medium-term income',
        years: 'Years 6-15'
      },
      growth: {
        allocation: bucketAllocations.growth,
        value: currentAssets * (bucketAllocations.growth / 100),
        purpose: 'Growth investments for long-term wealth building',
        years: 'Years 16+'
      },
      legacy: {
        allocation: bucketAllocations.legacy,
        value: currentAssets * (bucketAllocations.legacy / 100),
        purpose: 'Estate planning and legacy preservation',
        years: 'Lifetime'
      }
    };
  }, [inputs]);

  const scenarioResults = useMemo((): ScenarioResults => {
    const {
      age,
      currentAssets,
      expectedRetirementAge,
      annualSpending,
      projectedLifespan,
      inflationRate
    } = inputs;

    const yearsToRetirement = expectedRetirementAge - age;
    const retirementYears = projectedLifespan - expectedRetirementAge;
    const inflationDecimal = inflationRate / 100;

    // Sequence of returns stress test
    const worstCaseReturns = [0.85, 0.92, 0.88, 0.95, 1.03, 1.07, 1.06, 1.08]; // Poor early returns
    const averageCaseReturns = Array(retirementYears).fill(1.07); // 7% average

    const runScenario = (returns: number[]) => {
      let assets = currentAssets;
      let year = 0;
      const withdrawals = [];

      while (year < retirementYears && assets > 0) {
        const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflationDecimal, year);
        const returnRate = returns[Math.min(year, returns.length - 1)];
        
        assets = assets * returnRate - inflationAdjustedSpending;
        
        withdrawals.push({
          year: year + 1,
          nominal: inflationAdjustedSpending,
          real: annualSpending // Real purchasing power
        });
        
        year++;
        
        if (assets <= 0) break;
      }

      return {
        moneyLastsYears: year,
        finalValue: Math.max(0, assets),
        withdrawals
      };
    };

    const worstCase = runScenario(worstCaseReturns);
    const averageCase = runScenario(averageCaseReturns);

    return {
      worstCase: {
        moneyLastsYears: worstCase.moneyLastsYears,
        finalValue: worstCase.finalValue,
        shortfall: worstCase.finalValue < 0 ? Math.abs(worstCase.finalValue) : 0
      },
      averageCase: {
        moneyLastsYears: averageCase.moneyLastsYears,
        finalValue: averageCase.finalValue,
        surplus: averageCase.finalValue > 0 ? averageCase.finalValue : 0
      },
      inflationAdjusted: {
        annualWithdrawals: averageCase.withdrawals,
        totalRealSpending: averageCase.withdrawals.reduce((sum, w) => sum + w.real, 0)
      }
    };
  }, [inputs]);

  const longevityScore = useMemo((): LongevityScore => {
    const { healthspanYears, projectedLifespan, expectedRetirementAge, age } = inputs;
    const retirementYears = projectedLifespan - expectedRetirementAge;
    
    // Scoring factors
    let score = 50; // Base score
    
    // Money duration vs lifespan
    const worstCaseRatio = scenarioResults.worstCase.moneyLastsYears / retirementYears;
    const averageCaseRatio = scenarioResults.averageCase.moneyLastsYears / retirementYears;
    
    if (worstCaseRatio >= 1) score += 30;
    else if (worstCaseRatio >= 0.8) score += 20;
    else if (worstCaseRatio >= 0.6) score += 10;
    else score -= 10;
    
    if (averageCaseRatio >= 1.2) score += 20;
    else if (averageCaseRatio >= 1) score += 10;
    else score -= 5;
    
    // Healthspan vs retirement years
    const healthspanRatio = healthspanYears / retirementYears;
    if (healthspanRatio >= 0.8) score += 15;
    else if (healthspanRatio >= 0.6) score += 10;
    else score += 5;
    
    // Bucket diversification
    const allocations = Object.values(inputs.bucketAllocations);
    const isWellDiversified = allocations.every(a => a >= 5 && a <= 60);
    if (isWellDiversified) score += 10;
    
    // Inflation consideration
    if (inputs.inflationRate >= 2 && inputs.inflationRate <= 4) score += 5;
    
    score = Math.max(0, Math.min(100, score));
    
    let level: LongevityScore['level'];
    let color: string;
    let message: string;
    
    if (score >= 80) {
      level = 'Excellent';
      color = 'text-green-600';
      message = 'Your money is likely to last throughout your lifetime with room for legacy planning.';
    } else if (score >= 65) {
      level = 'Good';
      color = 'text-blue-600';
      message = 'You\'re on track, but some adjustments could improve your financial security.';
    } else if (score >= 50) {
      level = 'Caution';
      color = 'text-yellow-600';
      message = 'Several areas need attention to ensure your money lasts through retirement.';
    } else {
      level = 'High Risk';
      color = 'text-red-600';
      message = 'Significant changes are needed to avoid running out of money in retirement.';
    }
    
    const recommendations = [];
    
    if (worstCaseRatio < 0.8) {
      recommendations.push('Consider delaying retirement by 2-3 years');
      recommendations.push('Reduce planned spending by 10-15%');
    }
    
    if (averageCaseRatio < 1.1) {
      recommendations.push('Add guaranteed income sources (annuities, pensions)');
    }
    
    if (healthspanRatio < 0.7) {
      recommendations.push('Invest in longevity and health optimization');
      recommendations.push('Consider long-term care insurance');
    }
    
    if (!isWellDiversified) {
      recommendations.push('Rebalance your bucket allocations for better risk management');
    }
    
    if (inputs.inflationRate < 2) {
      recommendations.push('Consider higher inflation scenarios in your planning');
    }
    
    return {
      score,
      level,
      color,
      message,
      recommendations
    };
  }, [inputs, scenarioResults]);

  const calculateScore = async () => {
    setIsCalculating(true);
    
    // Track usage for analytics
    trackFeatureUsed('longevity_scorecard_calculation', {
      age: inputs.age,
      assets: inputs.currentAssets,
      inflation_rate: inputs.inflationRate,
      score: longevityScore.score,
      level: longevityScore.level
    });
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCalculating(false);
    
    return longevityScore;
  };

  const resetToDefaults = () => {
    setInputs(defaultInputs);
  };

  return {
    inputs,
    updateInput,
    updateBucketAllocation,
    bucketPlan,
    scenarioResults,
    longevityScore,
    calculateScore,
    resetToDefaults,
    isCalculating
  };
}