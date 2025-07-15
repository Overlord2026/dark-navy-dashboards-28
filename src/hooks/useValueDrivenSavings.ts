import { useState, useMemo } from 'react';

type FeeType = 'percentage' | 'flat';

export interface ValueDrivenCalculation {
  traditional: {
    finalValue: number;
    totalFees: number;
    yearlyBalances: number[];
  };
  valueModel: {
    finalValue: number;
    totalFees: number;
    yearlyBalances: number[];
  };
  totalFeeSavings: number;
  extraPortfolioGrowth: number;
  longevityYears: number;
}

export function calculateValueDrivenSavings(
  portfolioValue: number,
  growthRate: number,
  timeHorizon: number,
  currentAdvisorFee: number,
  ourFee: number,
  ourFeeType: FeeType,
  annualWithdrawal: number
): ValueDrivenCalculation {
  const rate = growthRate / 100;
  
  // Calculate traditional (current advisor) scenario
  let traditionalBalance = portfolioValue;
  let traditionalTotalFees = 0;
  const traditionalBalances = [portfolioValue];
  
  for (let year = 1; year <= timeHorizon; year++) {
    const annualFee = traditionalBalance * (currentAdvisorFee / 100);
    traditionalTotalFees += annualFee;
    traditionalBalance = (traditionalBalance - annualFee) * (1 + rate);
    traditionalBalances.push(traditionalBalance);
  }
  
  // Calculate our value model scenario
  let valueModelBalance = portfolioValue;
  let valueModelTotalFees = 0;
  const valueModelBalances = [portfolioValue];
  
  for (let year = 1; year <= timeHorizon; year++) {
    const annualFee = ourFeeType === 'percentage' 
      ? valueModelBalance * (ourFee / 100)
      : ourFee;
    valueModelTotalFees += annualFee;
    valueModelBalance = (valueModelBalance - annualFee) * (1 + rate);
    valueModelBalances.push(valueModelBalance);
  }
  
  const totalFeeSavings = traditionalTotalFees - valueModelTotalFees;
  const extraPortfolioGrowth = valueModelBalance - traditionalBalance;
  const longevityYears = Math.max(0, extraPortfolioGrowth / annualWithdrawal);
  
  return {
    traditional: {
      finalValue: traditionalBalance,
      totalFees: traditionalTotalFees,
      yearlyBalances: traditionalBalances
    },
    valueModel: {
      finalValue: valueModelBalance,
      totalFees: valueModelTotalFees,
      yearlyBalances: valueModelBalances
    },
    totalFeeSavings,
    extraPortfolioGrowth,
    longevityYears
  };
}

export function useValueDrivenSavings() {
  const [portfolioValue, setPortfolioValue] = useState(2000000);
  const [growthRate, setGrowthRate] = useState(6.0);
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [currentAdvisorFee, setCurrentAdvisorFee] = useState(1.25);
  const [ourFee, setOurFee] = useState(0.75);
  const [ourFeeType, setOurFeeType] = useState<FeeType>('percentage');
  const [annualWithdrawal, setAnnualWithdrawal] = useState(75000);

  const timeHorizonOptions = [
    { value: 5, label: "5y" },
    { value: 10, label: "10y" },
    { value: 15, label: "15y" },
    { value: 20, label: "20y" },
    { value: 30, label: "30y" }
  ];

  const calculations = useMemo(() => {
    return calculateValueDrivenSavings(
      portfolioValue,
      growthRate,
      timeHorizon,
      currentAdvisorFee,
      ourFee,
      ourFeeType,
      annualWithdrawal
    );
  }, [portfolioValue, growthRate, timeHorizon, currentAdvisorFee, ourFee, ourFeeType, annualWithdrawal]);

  const resetToDefaults = () => {
    setPortfolioValue(2000000);
    setGrowthRate(6.0);
    setTimeHorizon(20);
    setCurrentAdvisorFee(1.25);
    setOurFee(0.75);
    setOurFeeType('percentage');
    setAnnualWithdrawal(75000);
  };

  const calculateSavings = () => {
    return calculateValueDrivenSavings(
      portfolioValue,
      growthRate,
      timeHorizon,
      currentAdvisorFee,
      ourFee,
      ourFeeType,
      annualWithdrawal
    );
  };

  return {
    portfolioValue,
    setPortfolioValue,
    growthRate,
    setGrowthRate,
    timeHorizon,
    setTimeHorizon,
    currentAdvisorFee,
    setCurrentAdvisorFee,
    ourFee,
    setOurFee,
    ourFeeType,
    setOurFeeType,
    annualWithdrawal,
    setAnnualWithdrawal,
    calculations,
    timeHorizonOptions,
    resetToDefaults,
    calculateSavings
  };
}