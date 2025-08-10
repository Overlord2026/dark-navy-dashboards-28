export interface PM3Score {
  overall: number;
  performance: number;
  risk: number;
  fees: number;
  breakdown: { alpha: number; beta: number; sharpe: number; maxDrawdown: number; expenseRatio: number; };
}

export const calculatePM3Score = (
  portfolio: { returns: number[]; benchmark: number[]; fees: number; holdings: Array<{symbol: string; weight: number}>; }
): PM3Score => {
  const portfolioReturn = portfolio.returns.reduce((sum, r) => sum + r, 0) / portfolio.returns.length;
  const benchmarkReturn = portfolio.benchmark.reduce((sum, r) => sum + r, 0) / portfolio.benchmark.length;
  
  const alpha = portfolioReturn - benchmarkReturn;
  const beta = calculateBeta(portfolio.returns, portfolio.benchmark);
  const sharpe = portfolioReturn / standardDeviation(portfolio.returns);
  const maxDrawdown = calculateMaxDrawdown(portfolio.returns);
  
  const performance = Math.min(100, (alpha + 0.1) * 500);
  const risk = Math.max(0, 100 - (maxDrawdown * 1000));
  const fees = Math.max(0, 100 - (portfolio.fees * 100));
  
  return {
    overall: (performance * 0.4 + risk * 0.4 + fees * 0.2),
    performance, risk, fees,
    breakdown: { alpha, beta, sharpe, maxDrawdown, expenseRatio: portfolio.fees }
  };
};

function calculateBeta(returns: number[], benchmark: number[]): number {
  const covariance = returns.reduce((sum, r, i) => sum + (r * benchmark[i]), 0) / returns.length;
  const variance = benchmark.reduce((sum, r) => sum + Math.pow(r, 2), 0) / benchmark.length;
  return covariance / variance;
}

function standardDeviation(values: number[]): number {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateMaxDrawdown(returns: number[]): number {
  let peak = 0, maxDrawdown = 0, cumulative = 0;
  for (const ret of returns) {
    cumulative += ret;
    peak = Math.max(peak, cumulative);
    maxDrawdown = Math.max(maxDrawdown, peak - cumulative);
  }
  return maxDrawdown;
}