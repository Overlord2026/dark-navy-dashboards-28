/* eslint-disable no-restricted-globals */

export type McInput = {
  currentAge: number; 
  retireAge: number; 
  longevityAge: number;
  currentBalance: number; 
  income: number;
  employeePct: number; 
  employeeFixed?: number; 
  employerRule: { 
    kind: 'none' | 'simple' | 'tiered'; 
    pct?: number; 
    limitPct?: number; 
    tiers?: Array<{ matchPct: number; compPct: number }> 
  };
  annualEscalationPct?: number;
  expRetExpenses: number;               // annual expenses in retirement
  sims: number;                         // e.g., 10000
  mean: number; 
  stdev: number;           // annual return distribution (pre-ret/ret same for now)
  inflation: number;
};

export type McOutput = { 
  successProb: number; 
  p50End: number; 
  p10End: number; 
  p90End: number;
  projectedBalance: number;
  totalContributions: number;
};

function randn() { // Box-Muller
  let u = 0, v = 0; 
  while (u === 0) u = Math.random(); 
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function annualEmployer(income: number, employeePct: number, rule: McInput['employerRule']) {
  if (rule.kind === 'none') return 0;
  if (rule.kind === 'simple') {
    const employeeContrib = Math.min(employeePct, rule.limitPct || 100);
    return income * (employeeContrib / 100) * ((rule.pct || 0) / 100);
  }
  if (rule.kind === 'tiered') {
    let rem = employeePct; 
    let match = 0;
    for (const tier of (rule.tiers || [])) {
      const take = Math.min(rem, tier.compPct); 
      match += income * (take / 100) * (tier.matchPct / 100); 
      rem -= take; 
      if (rem <= 0) break;
    }
    return match;
  }
  return 0;
}

self.onmessage = (e: MessageEvent<McInput>) => {
  const params = e.data;
  const sims = params.sims || 10000;
  let successCount = 0; 
  const endBalances: number[] = [];
  let totalContributions = 0;

  for (let sim = 0; sim < sims; sim++) {
    let age = params.currentAge;
    let balance = params.currentBalance;
    let income = params.income;
    let deferralPct = params.employeePct;
    let simContributions = 0;
    
    // Accumulation phase
    for (; age < params.retireAge; age++) {
      const employeeContrib = income * (deferralPct / 100) + (params.employeeFixed || 0);
      const employerContrib = annualEmployer(income, deferralPct, params.employerRule);
      const totalContrib = employeeContrib + employerContrib;
      
      const annualReturn = params.mean + params.stdev * randn();
      balance = (balance + totalContrib) * (1 + annualReturn);
      
      simContributions += totalContrib;
      income = income * (1 + (params.annualEscalationPct || 0) / 100);
      
      // Auto-escalate deferral percentage
      if (params.annualEscalationPct) {
        deferralPct = Math.min(deferralPct + 1, 22); // Cap at 22% (typical 401k limit)
      }
    }
    
    if (sim === 0) totalContributions = simContributions; // Use first sim for estimate
    
    // Decumulation phase
    let survived = true; 
    let expenses = params.expRetExpenses;
    
    for (; age < params.longevityAge; age++) {
      const annualReturn = params.mean + params.stdev * randn();
      balance = balance * (1 + annualReturn) - expenses;
      expenses = expenses * (1 + params.inflation);
      
      if (balance <= 0) { 
        survived = false; 
        break; 
      }
    }
    
    if (survived) successCount++;
    endBalances.push(Math.max(0, balance));
  }
  
  endBalances.sort((a, b) => a - b);
  const getPercentile = (percentile: number) => 
    endBalances[Math.floor(percentile * endBalances.length)];
  
  const output: McOutput = { 
    successProb: successCount / sims, 
    p10End: getPercentile(0.1), 
    p50End: getPercentile(0.5), 
    p90End: getPercentile(0.9),
    projectedBalance: getPercentile(0.5), // Use median as projection
    totalContributions
  };
  
  self.postMessage(output);
};