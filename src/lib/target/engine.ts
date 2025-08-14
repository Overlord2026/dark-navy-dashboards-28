import { TargetParams, TargetResult, YearRow } from "./types";

export function runTarget(p: TargetParams): TargetResult {
  const N = p.horizon ?? 40;
  const rows: YearRow[] = [];
  let age = p.currentAge;
  let bal = (p.balances ?? []).reduce((a, b) => a + b.value, 0);
  
  // Base income calculation - use current income if provided, otherwise derive from spend target
  const baseIncome = p.currentIncome ?? p.spendTarget * 1.5; // Rough estimation if not provided

  for (let y = 0; y < N; y++) {
    const working = age < p.retireAge;
    const earnedIncome = working ? baseIncome * p.workRate : 0;
    
    // Social Security calculation (simplified)
    const ss = p.ssStartAge && age >= p.ssStartAge ? 
      Math.min(baseIncome * 0.4, 50000) * (age >= 67 ? 1 : 0.75) : 0;
    
    // Pension calculations
    const pensions = (p.pensions ?? []).reduce(
      (total, pension) => total + (age >= pension.startAge ? pension.amount : 0), 
      0
    );
    
    const grossIncome = earnedIncome + ss + pensions;
    
    // Tax calculation (simplified effective rate)
    const taxes = grossIncome * p.taxRate;
    
    // Spending with inflation adjustment
    const inflationYears = Math.max(0, age - p.currentAge);
    const adjustedSpending = p.spendTarget * Math.pow(1 + p.inflation, inflationYears);
    
    // Additional expense growth
    const spending = adjustedSpending * Math.pow(1 + p.expGrowth, inflationYears);
    
    // Savings calculation
    const savings = working ? earnedIncome * p.savingsRate : 0;
    
    const portfolioStart = bal;
    const netIncome = grossIncome - taxes;
    const netCashFlow = netIncome + savings - spending;
    
    // Calculate withdrawals needed from portfolio
    const withdrawals = Math.max(0, -netCashFlow);
    
    // Portfolio growth calculation
    const portfolioAfterWithdrawal = Math.max(0, bal - withdrawals + savings);
    const growth = portfolioAfterWithdrawal * p.ror;
    bal = portfolioAfterWithdrawal + growth;

    rows.push({
      year: new Date().getFullYear() + y,
      age,
      earned: earnedIncome,
      ss,
      pensions,
      grossIncome,
      taxes,
      spending,
      savings,
      portfolioStart,
      portfolioEnd: bal,
      withdrawals
    });
    
    age++;
  }

  // Calculate gap - if portfolio is depleted and spending still needed
  const finalYear = rows[rows.length - 1];
  const finalShortfall = Math.max(0, finalYear.spending - (finalYear.grossIncome - finalYear.taxes));
  const gapAmount = finalYear.portfolioEnd < 0 ? Math.abs(finalYear.portfolioEnd) : 
                   finalYear.portfolioEnd < finalShortfall ? finalShortfall - finalYear.portfolioEnd : 0;
  
  // Success determination - if portfolio lasts through retirement with minimal shortfall
  const targetMet = finalYear.portfolioEnd > (finalYear.spending * 2) && gapAmount < (p.spendTarget * 0.1);
  const successRate = Math.max(0, Math.min(100, (finalYear.portfolioEnd / (finalYear.spending * 5)) * 100));

  return { 
    params: p, 
    rows, 
    gapAmount, 
    targetMet,
    successRate
  };
}

export function exportToCSV(result: TargetResult): string {
  const headers = [
    'Year', 'Age', 'Earned Income', 'Social Security', 'Pensions', 
    'Gross Income', 'Taxes', 'Spending', 'Savings', 'Portfolio Start', 
    'Portfolio End', 'Withdrawals'
  ];
  
  const csvContent = [
    headers.join(','),
    ...result.rows.map(row => [
      row.year,
      row.age,
      row.earned.toFixed(0),
      row.ss.toFixed(0),
      row.pensions.toFixed(0),
      row.grossIncome.toFixed(0),
      row.taxes.toFixed(0),
      row.spending.toFixed(0),
      row.savings.toFixed(0),
      row.portfolioStart.toFixed(0),
      row.portfolioEnd.toFixed(0),
      row.withdrawals.toFixed(0)
    ].join(','))
  ].join('\n');
  
  return csvContent;
}

export function downloadCSV(result: TargetResult, filename: string = 'target-analysis') {
  const csvContent = exportToCSV(result);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}