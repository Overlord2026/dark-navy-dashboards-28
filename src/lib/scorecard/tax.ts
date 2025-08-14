import { Account, TaxType, WithdrawalSlice } from './types';

export function afterTaxValueForDisplay(
  balance: number,
  taxType: TaxType,
  effectiveTaxRate: number,
  capGainsRate?: number
): number {
  switch (taxType) {
    case 'taxable':
      // Apply capital gains rate if provided, otherwise effective tax rate
      const rate = capGainsRate ?? effectiveTaxRate;
      return balance * (1 - rate);
    case 'trad':
    case 'annuity_qualified':
      // Traditional accounts are fully taxable on withdrawal
      return balance * (1 - effectiveTaxRate);
    case 'roth':
    case 'hsa':
      // Tax-free withdrawals
      return balance;
    case 'annuity_nonqualified':
      // Only earnings are taxable, assume 50% basis for simplicity
      const earnings = balance * 0.5;
      return balance - (earnings * effectiveTaxRate);
    default:
      return balance;
  }
}

export function planWithdrawals(
  targetAmount: number,
  accounts: Account[],
  effectiveTaxRate: number,
  capGainsRate?: number
): WithdrawalSlice[] {
  const slices: WithdrawalSlice[] = [];
  let remainingNeed = targetAmount;
  
  // Withdrawal order: taxable → traditional → roth → hsa → annuities
  const withdrawalOrder: TaxType[] = ['taxable', 'trad', 'roth', 'hsa', 'annuity_qualified', 'annuity_nonqualified'];
  
  for (const taxType of withdrawalOrder) {
    if (remainingNeed <= 0) break;
    
    const accountsOfType = accounts.filter(acc => acc.taxType === taxType);
    const totalAvailable = accountsOfType.reduce((sum, acc) => sum + acc.balance, 0);
    
    if (totalAvailable > 0) {
      let taxRate = 0;
      
      switch (taxType) {
        case 'taxable':
          taxRate = capGainsRate ?? effectiveTaxRate;
          break;
        case 'trad':
        case 'annuity_qualified':
          taxRate = effectiveTaxRate;
          break;
        case 'roth':
        case 'hsa':
          taxRate = 0;
          break;
        case 'annuity_nonqualified':
          // Only earnings are taxable
          taxRate = effectiveTaxRate * 0.5;
          break;
      }
      
      // Calculate gross withdrawal needed to get net amount
      const netRate = 1 - taxRate;
      const grossNeeded = Math.min(remainingNeed / netRate, totalAvailable);
      const afterTaxAmount = grossNeeded * netRate;
      
      slices.push({
        source: taxType,
        amount: grossNeeded,
        taxRate,
        afterTaxAmount
      });
      
      remainingNeed -= afterTaxAmount;
    }
  }
  
  return slices;
}

export function calculateTaxDrag(accounts: Account[], effectiveTaxRate: number): number {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAfterTax = accounts.reduce((sum, acc) => {
    return sum + afterTaxValueForDisplay(acc.balance, acc.taxType, effectiveTaxRate);
  }, 0);
  
  return totalBalance > 0 ? (totalBalance - totalAfterTax) / totalBalance : 0;
}

export function calculateTaxEfficiencyScore(accounts: Account[], effectiveTaxRate: number): number {
  if (accounts.length === 0) return 0;
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  if (totalBalance === 0) return 0;
  
  // Calculate percentage in tax-advantaged accounts
  const taxAdvantagedBalance = accounts
    .filter(acc => ['roth', 'hsa', 'trad'].includes(acc.taxType))
    .reduce((sum, acc) => sum + acc.balance, 0);
  
  const taxAdvantagedPct = taxAdvantagedBalance / totalBalance;
  
  // Calculate diversification across tax buckets
  const taxBuckets = ['taxable', 'trad', 'roth'];
  const bucketsWithBalance = taxBuckets.filter(bucket => 
    accounts.some(acc => acc.taxType === bucket && acc.balance > 0)
  ).length;
  
  const diversificationScore = bucketsWithBalance / taxBuckets.length;
  
  // Combine tax advantage and diversification
  return Math.round((taxAdvantagedPct * 0.7 + diversificationScore * 0.3) * 100);
}