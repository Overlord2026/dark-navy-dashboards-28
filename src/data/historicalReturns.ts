// Historical market returns data for sequence of returns analysis
export interface HistoricalReturn {
  year: number;
  sp500Return: number;
  bondReturn: number;
  inflationRate: number;
  realReturn: number;
}

// Historical S&P 500 returns (1990-2024) - key years for sequence risk analysis
export const historicalReturns: HistoricalReturn[] = [
  { year: 1990, sp500Return: -0.0310, bondReturn: 0.0814, inflationRate: 0.0540, realReturn: -0.0840 },
  { year: 1991, sp500Return: 0.3047, bondReturn: 0.1593, inflationRate: 0.0420, realReturn: 0.2627 },
  { year: 1992, sp500Return: 0.0760, bondReturn: 0.0740, inflationRate: 0.0300, realReturn: 0.0460 },
  { year: 1993, sp500Return: 0.1008, bondReturn: 0.0967, inflationRate: 0.0300, realReturn: 0.0708 },
  { year: 1994, sp500Return: 0.0132, bondReturn: -0.0269, inflationRate: 0.0260, realReturn: -0.0128 },
  { year: 1995, sp500Return: 0.3758, bondReturn: 0.1843, inflationRate: 0.0280, realReturn: 0.3478 },
  { year: 1996, sp500Return: 0.2296, bondReturn: 0.0343, inflationRate: 0.0300, realReturn: 0.1996 },
  { year: 1997, sp500Return: 0.3336, bondReturn: 0.0970, inflationRate: 0.0230, realReturn: 0.3106 },
  { year: 1998, sp500Return: 0.2858, bondReturn: 0.1302, inflationRate: 0.0160, realReturn: 0.2698 },
  { year: 1999, sp500Return: 0.2104, bondReturn: -0.0094, inflationRate: 0.0220, realReturn: 0.1884 },
  // Critical sequence risk period - Dot-com crash (2000-2002)
  { year: 2000, sp500Return: -0.0910, bondReturn: 0.1163, inflationRate: 0.0340, realReturn: -0.1250 },
  { year: 2001, sp500Return: -0.1189, bondReturn: 0.0446, inflationRate: 0.0280, realReturn: -0.1469 },
  { year: 2002, sp500Return: -0.2210, bondReturn: 0.1027, inflationRate: 0.0160, realReturn: -0.2370 },
  { year: 2003, sp500Return: 0.2868, bondReturn: 0.0145, inflationRate: 0.0230, realReturn: 0.2638 },
  { year: 2004, sp500Return: 0.1088, bondReturn: 0.0434, inflationRate: 0.0270, realReturn: 0.0818 },
  { year: 2005, sp500Return: 0.0491, bondReturn: 0.0281, inflationRate: 0.0340, realReturn: 0.0151 },
  { year: 2006, sp500Return: 0.1579, bondReturn: 0.0397, inflationRate: 0.0320, realReturn: 0.1259 },
  { year: 2007, sp500Return: 0.0549, bondReturn: 0.0699, inflationRate: 0.0290, realReturn: 0.0259 },
  // Critical sequence risk period - Financial Crisis (2008-2009)
  { year: 2008, sp500Return: -0.3700, bondReturn: 0.0520, inflationRate: 0.0038, realReturn: -0.3738 },
  { year: 2009, sp500Return: 0.2656, bondReturn: -0.1142, inflationRate: -0.0036, realReturn: 0.2692 },
  { year: 2010, sp500Return: 0.1506, bondReturn: 0.0654, inflationRate: 0.0164, realReturn: 0.1342 },
  { year: 2011, sp500Return: 0.0210, bondReturn: 0.1075, inflationRate: 0.0315, realReturn: -0.0105 },
  { year: 2012, sp500Return: 0.1600, bondReturn: 0.0197, inflationRate: 0.0207, realReturn: 0.1393 },
  { year: 2013, sp500Return: 0.3239, bondReturn: -0.0209, inflationRate: 0.0150, realReturn: 0.3089 },
  { year: 2014, sp500Return: 0.1369, bondReturn: 0.0597, inflationRate: 0.0012, realReturn: 0.1357 },
  { year: 2015, sp500Return: 0.0138, bondReturn: 0.0055, inflationRate: 0.0001, realReturn: 0.0137 },
  { year: 2016, sp500Return: 0.1196, bondReturn: 0.0165, inflationRate: 0.0213, realReturn: 0.0983 },
  { year: 2017, sp500Return: 0.2183, bondReturn: 0.0245, inflationRate: 0.0213, realReturn: 0.1970 },
  { year: 2018, sp500Return: -0.0462, bondReturn: 0.0086, inflationRate: 0.0244, realReturn: -0.0706 },
  { year: 2019, sp500Return: 0.3157, bondReturn: 0.0869, inflationRate: 0.0181, realReturn: 0.2976 },
  { year: 2020, sp500Return: 0.1840, bondReturn: 0.0745, inflationRate: 0.0123, realReturn: 0.1717 },
  { year: 2021, sp500Return: 0.2889, bondReturn: -0.0154, inflationRate: 0.0470, realReturn: 0.2419 },
  { year: 2022, sp500Return: -0.1811, bondReturn: -0.1319, inflationRate: 0.0800, realReturn: -0.2611 },
  { year: 2023, sp500Return: 0.2626, bondReturn: 0.0531, inflationRate: 0.0410, realReturn: 0.2216 },
  { year: 2024, sp500Return: 0.2400, bondReturn: 0.0280, inflationRate: 0.0320, realReturn: 0.2080 }
];

// Preset scenarios for common sequence risk analysis
export const sequenceRiskScenarios = {
  dotComCrash: {
    name: "Dot-com Crash (2000-2002)",
    startYear: 2000,
    description: "Portfolio stress test during the dot-com bubble burst",
    marketLoss: -0.45, // Cumulative 45% loss
    duration: 3,
    recoveryYears: 4
  },
  financialCrisis: {
    name: "Financial Crisis (2008-2009)", 
    startYear: 2008,
    description: "Portfolio stress test during the 2008 financial crisis",
    marketLoss: -0.37, // 37% loss in 2008 alone
    duration: 2,
    recoveryYears: 3
  },
  perfectTiming: {
    name: "Perfect Timing (1982-1999)",
    startYear: 1982,
    description: "Best case scenario - retiring at start of bull market",
    averageReturn: 0.17,
    duration: 18
  }
};

export const getReturnsForPeriod = (startYear: number, endYear: number): HistoricalReturn[] => {
  return historicalReturns.filter(r => r.year >= startYear && r.year <= endYear);
};

export const calculateCumulativeReturn = (returns: HistoricalReturn[], useRealReturns = false): number => {
  return returns.reduce((cumulative, yearData) => {
    const returnToUse = useRealReturns ? yearData.realReturn : yearData.sp500Return;
    return cumulative * (1 + returnToUse);
  }, 1) - 1;
};