import { useState, useCallback, useMemo } from 'react';
import {
  RetirementAnalysisInput,
  RetirementAnalysisResults,
  CashFlowProjection,
  MonteCarloResults,
  RetirementRecommendation,
  InvestmentAccount,
  ExpenseCategory
} from '@/types/retirement';
import { useTaxRules } from './useTaxRules';
import { 
  calculateSWAGMetrics, 
  generatePhaseRecommendations,
  calculateAdvancedTaxEfficiency,
  SWAGEnhancedResults
} from '@/lib/swag/swagIntegration';

export const useRetirementCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { calculateTax, getStandardDeduction } = useTaxRules();

  // Calculate Social Security benefits based on earnings history
  const calculateSocialSecurityBenefit = useCallback((
    currentEarnings: number,
    filingAge: number,
    earningsHistory: number[] = []
  ): number => {
    // Simplified Social Security calculation
    // In production, this would use the full bend point formula
    const averageIndexedMonthlyEarnings = earningsHistory.length > 0 
      ? earningsHistory.reduce((sum, earning) => sum + earning, 0) / earningsHistory.length / 12
      : currentEarnings / 12;

    // Primary Insurance Amount (PIA) calculation using 2024 bend points
    let pia = 0;
    if (averageIndexedMonthlyEarnings <= 1174) {
      pia = averageIndexedMonthlyEarnings * 0.9;
    } else if (averageIndexedMonthlyEarnings <= 7078) {
      pia = 1174 * 0.9 + (averageIndexedMonthlyEarnings - 1174) * 0.32;
    } else {
      pia = 1174 * 0.9 + (7078 - 1174) * 0.32 + (averageIndexedMonthlyEarnings - 7078) * 0.15;
    }

    // Adjust for filing age (simplified)
    const fullRetirementAge = 67; // Assuming current full retirement age
    const adjustmentFactor = filingAge < fullRetirementAge 
      ? 0.75 + (filingAge - 62) * 0.05 // Early filing reduction
      : filingAge > fullRetirementAge 
      ? 1 + (filingAge - fullRetirementAge) * 0.08 // Delayed retirement credits
      : 1;

    return pia * adjustmentFactor * 12; // Return annual benefit
  }, []);

  // Calculate required minimum distributions
  const calculateRMD = useCallback((balance: number, age: number): number => {
    if (age < 73) return 0; // Current RMD age is 73
    
    // Simplified RMD table
    const rmdFactors: { [key: number]: number } = {
      73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
      79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
      85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2
    };
    
    const factor = rmdFactors[age] || (age > 90 ? 12.2 : 26.5);
    return balance / factor;
  }, []);

  // Run Monte Carlo simulation
  const runMonteCarloSimulation = useCallback((
    portfolioValue: number,
    annualWithdrawal: number,
    expectedReturn: number,
    volatility: number,
    years: number,
    simulations: number = 1000
  ): MonteCarloResults => {
    let successes = 0;
    const finalValues: number[] = [];

    for (let sim = 0; sim < simulations; sim++) {
      let currentValue = portfolioValue;
      let simulationSuccessful = true;

      for (let year = 0; year < years; year++) {
        // Generate random return using normal distribution approximation
        const randomReturn = expectedReturn + volatility * (Math.random() - 0.5) * 2;
        
        // Apply market return
        currentValue *= (1 + randomReturn / 100);
        
        // Subtract annual withdrawal
        currentValue -= annualWithdrawal * Math.pow(1.025, year); // 2.5% inflation
        
        if (currentValue <= 0) {
          simulationSuccessful = false;
          break;
        }
      }

      if (simulationSuccessful) successes++;
      finalValues.push(Math.max(0, currentValue));
    }

    finalValues.sort((a, b) => a - b);
    
    const successProbability = (successes / simulations) * 100;
    const medianPortfolioValue = finalValues[Math.floor(simulations / 2)];
    const worstCase10th = finalValues[Math.floor(simulations * 0.1)];
    const bestCase90th = finalValues[Math.floor(simulations * 0.9)];
    
    // Calculate SWAG Score (0-100 based on success probability and buffer)
    const swagScore = Math.min(100, successProbability + (medianPortfolioValue > portfolioValue ? 10 : 0));

    return {
      successProbability,
      medianPortfolioValue,
      worstCase10th,
      bestCase90th,
      yearsOfPortfolioSustainability: years,
      swagScore
    };
  }, []);

  // Calculate optimal withdrawal sequence for tax efficiency
  const calculateOptimalWithdrawal = useCallback((
    accounts: InvestmentAccount[],
    targetWithdrawal: number,
    age: number,
    taxYear: number
  ): { accountId: string; amount: number; taxImpact: number }[] => {
    const withdrawals: { accountId: string; amount: number; taxImpact: number }[] = [];
    let remainingWithdrawal = targetWithdrawal;

    // Sort accounts by tax efficiency (taxable first, then tax-deferred, then tax-free)
    const sortedAccounts = [...accounts].sort((a, b) => {
      const taxOrder = { 'after_tax': 1, 'pre_tax': 2, 'tax_free': 3 };
      return taxOrder[a.taxStatus] - taxOrder[b.taxStatus];
    });

    for (const account of sortedAccounts) {
      if (remainingWithdrawal <= 0) break;

      // Check for RMD requirements
      const rmdRequired = account.requiredMinDistribution && account.rmdAge && age >= account.rmdAge
        ? calculateRMD(account.balance, age)
        : 0;

      const withdrawalAmount = Math.min(
        remainingWithdrawal + rmdRequired,
        account.balance
      );

      if (withdrawalAmount > 0) {
        const taxImpact = account.taxStatus === 'pre_tax' 
          ? calculateTax(withdrawalAmount, taxYear, 'married_filing_jointly') // Simplified
          : 0;

        withdrawals.push({
          accountId: account.id,
          amount: withdrawalAmount,
          taxImpact
        });

        remainingWithdrawal -= withdrawalAmount;
      }
    }

    return withdrawals;
  }, [calculateTax, calculateRMD]);

  // Generate cash flow projections
  const generateCashFlowProjections = useCallback((
    inputs: RetirementAnalysisInput
  ): CashFlowProjection[] => {
    const projections: CashFlowProjection[] = [];
    const years = inputs.goals.lifeExpectancy - inputs.goals.currentAge;
    
    let currentAccounts = [...inputs.accounts];
    const socialSecurityAnnual = inputs.socialSecurity.enabled 
      ? calculateSocialSecurityBenefit(
          inputs.socialSecurity.currentEarnings,
          inputs.socialSecurity.filingAge,
          inputs.socialSecurity.earningsHistory
        )
      : 0;

    for (let year = 0; year < years; year++) {
      const currentAge = inputs.goals.currentAge + year;
      const isRetired = currentAge >= inputs.goals.retirementAge;
      
      // Calculate beginning balance
      const beginningBalance = currentAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      
      // Calculate income
      const income = {
        socialSecurity: isRetired && currentAge >= inputs.socialSecurity.filingAge ? socialSecurityAnnual : 0,
        pension: isRetired && inputs.pension.enabled && currentAge >= inputs.pension.startAge 
          ? inputs.pension.monthlyBenefit * 12 : 0,
        partTimeWork: 0, // Could be added as input
        other: 0
      };

      // Calculate expenses with inflation
      const inflationMultiplier = Math.pow(1 + inputs.goals.inflationRate / 100, year);
      const totalExpenses = inputs.expenses.reduce((sum, expense) => {
        const adjustedAmount = expense.retirementAmount * inflationMultiplier;
        return sum + adjustedAmount;
      }, 0);

      // Calculate healthcare costs
      const healthcareCosts = inputs.healthcare.estimatedAnnualCost * inflationMultiplier;

      // Calculate required withdrawals
      const totalIncome = Object.values(income).reduce((sum, val) => sum + val, 0);
      const requiredWithdrawal = Math.max(0, totalExpenses + healthcareCosts - totalIncome);

      // Calculate optimal withdrawals
      const withdrawals = calculateOptimalWithdrawal(currentAccounts, requiredWithdrawal, currentAge, 2024);
      
      const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);
      const totalTaxes = withdrawals.reduce((sum, w) => sum + w.taxImpact, 0);

      // Update account balances
      currentAccounts = currentAccounts.map(account => {
        const withdrawal = withdrawals.find(w => w.accountId === account.id);
        const withdrawalAmount = withdrawal?.amount || 0;
        
        // Apply growth
        const newBalance = (account.balance - withdrawalAmount) * 
          (1 + account.expectedReturn / 100);
        
        return { ...account, balance: Math.max(0, newBalance) };
      });

      // Calculate ending balance
      const endingBalance = currentAccounts.reduce((sum, acc) => sum + acc.balance, 0);

      // Determine portfolio sustainability
      const portfolioSustainability = 
        endingBalance > beginningBalance * 0.8 ? 'excellent' :
        endingBalance > beginningBalance * 0.6 ? 'good' :
        endingBalance > beginningBalance * 0.3 ? 'at_risk' : 'critical';

      projections.push({
        year: year + 1,
        age: currentAge,
        beginningBalance,
        income,
        withdrawals: {
          taxable: withdrawals.filter(w => currentAccounts.find(a => a.id === w.accountId)?.taxStatus === 'after_tax')
            .reduce((sum, w) => sum + w.amount, 0),
          taxDeferred: withdrawals.filter(w => currentAccounts.find(a => a.id === w.accountId)?.taxStatus === 'pre_tax')
            .reduce((sum, w) => sum + w.amount, 0),
          taxFree: withdrawals.filter(w => currentAccounts.find(a => a.id === w.accountId)?.taxStatus === 'tax_free')
            .reduce((sum, w) => sum + w.amount, 0)
        },
        expenses: {
          essential: inputs.expenses.filter(e => e.essential).reduce((sum, e) => sum + e.retirementAmount * inflationMultiplier, 0),
          discretionary: inputs.expenses.filter(e => !e.essential).reduce((sum, e) => sum + e.retirementAmount * inflationMultiplier, 0),
          healthcare: healthcareCosts,
          taxes: totalTaxes
        },
        endingBalance,
        portfolioSustainability
      });
    }

    return projections;
  }, [calculateSocialSecurityBenefit, calculateOptimalWithdrawal]);

  // Generate recommendations
  const generateRecommendations = useCallback((
    inputs: RetirementAnalysisInput,
    projections: CashFlowProjection[],
    monteCarlo: MonteCarloResults
  ): RetirementRecommendation[] => {
    const recommendations: RetirementRecommendation[] = [];

    // Savings increase recommendation
    if (monteCarlo.successProbability < 80) {
      const totalCurrentSavings = inputs.accounts.reduce((sum, acc) => sum + acc.annualContribution, 0);
      const recommendedIncrease = totalCurrentSavings * 0.2; // Suggest 20% increase
      
      recommendations.push({
        id: 'increase_savings',
        type: 'savings_increase',
        priority: 'high',
        title: 'Increase Annual Savings',
        description: `Increase your annual savings to improve retirement readiness. Current success rate: ${monteCarlo.successProbability.toFixed(1)}%`,
        impactAmount: recommendedIncrease,
        implementation: [
          `Increase 401(k) contributions by $${(recommendedIncrease * 0.6).toLocaleString()}`,
          `Add $${(recommendedIncrease * 0.4).toLocaleString()} to taxable investments`,
          'Consider maximizing employer match if not already done'
        ]
      });
    }

    // Asset allocation recommendation
    const totalBalance = inputs.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const conservativeAllocation = inputs.accounts.some(acc => acc.expectedReturn < 6);
    
    if (conservativeAllocation && inputs.goals.currentAge < 55) {
      recommendations.push({
        id: 'asset_allocation',
        type: 'asset_allocation',
        priority: 'medium',
        title: 'Optimize Asset Allocation',
        description: 'Consider a more growth-oriented portfolio given your time horizon',
        impactAmount: totalBalance * 0.02, // Potential 2% additional return
        implementation: [
          'Increase equity allocation in tax-advantaged accounts',
          'Consider low-cost index funds',
          'Rebalance annually'
        ]
      });
    }

    // Tax strategy recommendation
    const hasTraditionalAndRoth = inputs.accounts.some(acc => acc.taxStatus === 'pre_tax') &&
                                   inputs.accounts.some(acc => acc.taxStatus === 'tax_free');
    
    if (!hasTraditionalAndRoth) {
      recommendations.push({
        id: 'tax_diversification',
        type: 'tax_strategy',
        priority: 'medium',
        title: 'Diversify Tax Strategies',
        description: 'Add Roth accounts to your retirement savings mix for tax flexibility',
        impactAmount: 15000, // Estimated tax savings
        implementation: [
          'Open a Roth IRA',
          'Consider Roth 401(k) contributions',
          'Evaluate Roth conversion opportunities'
        ]
      });
    }

    return recommendations;
  }, []);

  // Main calculation function
  const calculateRetirement = useCallback(async (
    inputs: RetirementAnalysisInput
  ): Promise<SWAGEnhancedResults> => {
    setLoading(true);
    setError(null);

    try {
      // Generate cash flow projections
      const projectedCashFlow = generateCashFlowProjections(inputs);
      
      // Calculate total portfolio value
      const totalPortfolioValue = inputs.accounts.reduce((sum, acc) => sum + acc.balance, 0);
      const avgExpectedReturn = inputs.accounts.reduce((sum, acc, _, arr) => 
        sum + (acc.expectedReturn * acc.balance / totalPortfolioValue), 0);
      
      // Run Monte Carlo simulation
      const monteCarlo = runMonteCarloSimulation(
        totalPortfolioValue,
        inputs.goals.annualRetirementIncome,
        avgExpectedReturn,
        15, // Assumed volatility
        inputs.goals.lifeExpectancy - inputs.goals.retirementAge
      );

      // Calculate readiness score
      const incomeReplacement = (
        (inputs.socialSecurity.enabled ? calculateSocialSecurityBenefit(
          inputs.socialSecurity.currentEarnings,
          inputs.socialSecurity.filingAge
        ) : 0) +
        (inputs.pension.enabled ? inputs.pension.monthlyBenefit * 12 : 0)
      ) / inputs.goals.annualRetirementIncome;

      const readinessScore = Math.min(100, (monteCarlo.successProbability + incomeReplacement * 50) / 1.5);

      // Calculate monthly income gap
      const totalExpectedIncome = inputs.socialSecurity.enabled ? calculateSocialSecurityBenefit(
        inputs.socialSecurity.currentEarnings,
        inputs.socialSecurity.filingAge
      ) : 0;
      
      const monthlyIncomeGap = Math.max(0, (inputs.goals.annualRetirementIncome - totalExpectedIncome) / 12);

      // Generate recommendations
      const recommendations = generateRecommendations(inputs, projectedCashFlow, monteCarlo);

      // Base results
      const baseResults: RetirementAnalysisResults = {
        readinessScore,
        monthlyIncomeGap,
        projectedCashFlow,
        monteCarlo,
        recommendations,
        scenarioComparisons: [] // Would be populated with scenario analysis
      };

      // Calculate SWAG analytics
      const swagPhaseMetrics = calculateSWAGMetrics(inputs, baseResults, projectedCashFlow);
      const phaseRecommendations = generatePhaseRecommendations(swagPhaseMetrics, inputs);
      const taxEfficiency = calculateAdvancedTaxEfficiency(inputs, projectedCashFlow);

      // Calculate overall SWAG score
      const overallScore = Object.values(swagPhaseMetrics).reduce((sum, metrics) => 
        sum + metrics.OS * 25, 0); // Average of 4 phases

      // Enhanced results with SWAG analytics
      const enhancedResults: SWAGEnhancedResults = {
        ...baseResults,
        swagAnalytics: {
          overallScore,
          phaseMetrics: swagPhaseMetrics,
          riskAnalysis: {
            primaryRisks: [
              monteCarlo.successProbability < 70 ? 'Low success probability in Monte Carlo simulation' : '',
              swagPhaseMetrics.INCOME_NOW.DGBP > 0.3 ? 'High drawdown risk in early retirement' : '',
              swagPhaseMetrics.INCOME_LATER.LCR < 1.0 ? 'Insufficient longevity coverage' : '',
              taxEfficiency.taxOptimizationPotential > 0.1 ? 'Significant tax optimization opportunity' : '',
              swagPhaseMetrics.LEGACY.LCI < 0.5 ? 'Legacy goals may not be achievable' : ''
            ].filter(Boolean),
            mitigationStrategies: [
              'Implement dynamic withdrawal strategies with guardrails',
              'Optimize asset allocation across retirement phases',
              'Enhance tax-efficient withdrawal sequencing',
              'Consider longevity insurance for late-life coverage',
              'Develop flexible spending priorities for market volatility'
            ],
            confidenceLevel: Math.min(95, monteCarlo.successProbability + 10)
          },
          phaseRecommendations
        }
      };

      return enhancedResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate retirement analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    generateCashFlowProjections,
    runMonteCarloSimulation,
    calculateSocialSecurityBenefit,
    generateRecommendations
  ]);

  return {
    calculateRetirement,
    loading,
    error
  };
};