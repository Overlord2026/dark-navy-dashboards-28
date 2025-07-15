import { useState, useMemo } from 'react';

type FeeType = 'percentage' | 'flat';

export function useHealthcareSavings() {
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [currentAdvisorFee, setCurrentAdvisorFee] = useState(1.5);
  const [currentFeeType, setCurrentFeeType] = useState<FeeType>('percentage');
  const [ourFee, setOurFee] = useState(0.75);
  const [ourFeeType, setOurFeeType] = useState<FeeType>('percentage');
  const [growthRate, setGrowthRate] = useState(7);
  const [timeHorizon, setTimeHorizon] = useState("20y");

  const timeHorizonOptions = [
    { value: "5y", label: "5y" },
    { value: "10y", label: "10y" },
    { value: "15y", label: "15y" },
    { value: "20y", label: "20y" },
    { value: "25y", label: "25y" },
    { value: "30y", label: "30y" }
  ];

  const metrics = useMemo(() => {
    const years = parseInt(timeHorizon.replace('y', ''));
    const rate = growthRate / 100;

    // Calculate annual fees
    const currentAnnualFee = currentFeeType === 'percentage' 
      ? portfolioValue * (currentAdvisorFee / 100)
      : currentAdvisorFee;
    
    const ourAnnualFee = ourFeeType === 'percentage'
      ? portfolioValue * (ourFee / 100)
      : ourFee;

    // Convert to percentage for compound calculations
    const currentFeeRate = currentFeeType === 'percentage' 
      ? currentAdvisorFee / 100
      : currentAnnualFee / portfolioValue;
    
    const ourFeeRate = ourFeeType === 'percentage'
      ? ourFee / 100
      : ourAnnualFee / portfolioValue;

    // Compound growth calculations
    const traditionalFinalValue = portfolioValue * Math.pow(1 + rate - currentFeeRate, years);
    const valueModelFinalValue = portfolioValue * Math.pow(1 + rate - ourFeeRate, years);
    
    // Calculate total fees paid over time
    const traditionalTotalFees = currentAnnualFee * years;
    const valueModelTotalFees = ourAnnualFee * years;
    
    // Annual and total savings
    const annualFeeSavings = currentAnnualFee - ourAnnualFee;
    const totalCompoundSavings = valueModelFinalValue - traditionalFinalValue;
    
    // Additional longevity calculation (years money lasts longer)
    const withdrawalRate = 0.04; // 4% withdrawal rate
    const traditionalWithdrawalYears = traditionalFinalValue / (portfolioValue * withdrawalRate);
    const valueModelWithdrawalYears = valueModelFinalValue / (portfolioValue * withdrawalRate);
    const additionalYears = Math.max(0, valueModelWithdrawalYears - traditionalWithdrawalYears);
    
    // Healthcare funding (annual savings available)
    const healthcareFunding = annualFeeSavings;

    return {
      traditional: {
        annualFee: currentAnnualFee,
        finalValue: traditionalFinalValue,
        totalFees: traditionalTotalFees
      },
      valueModel: {
        annualFee: ourAnnualFee,
        finalValue: valueModelFinalValue,
        totalFees: valueModelTotalFees
      },
      annualFeeSavings,
      totalCompoundSavings,
      additionalYears,
      healthcareFunding
    };
  }, [portfolioValue, currentAdvisorFee, currentFeeType, ourFee, ourFeeType, growthRate, timeHorizon]);

  return {
    portfolioValue,
    setPortfolioValue,
    currentAdvisorFee,
    setCurrentAdvisorFee,
    currentFeeType,
    setCurrentFeeType,
    ourFee,
    setOurFee,
    ourFeeType,
    setOurFeeType,
    growthRate,
    setGrowthRate,
    timeHorizon,
    setTimeHorizon,
    metrics,
    timeHorizonOptions
  };
}