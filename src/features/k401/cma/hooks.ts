import { getCMA, getGlide, glideForAge } from './store';
import type { CMARow, GlideRow } from './types';

/**
 * Hook to access current CMA (Capital Market Assumptions) data
 */
export function useCMA(): CMARow[] {
  return getCMA();
}

/**
 * Hook to access current glide path data
 */
export function useGlidePath(): GlideRow[] {
  return getGlide();
}

/**
 * Hook to get allocation for a specific age
 */
export function useGlideForAge(age: number): GlideRow {
  return glideForAge(age);
}

/**
 * Get expected return and standard deviation for a given asset allocation
 */
export function calculatePortfolioMetrics(allocation: { equity: number; bonds: number; cash: number }): {
  expectedReturn: number;
  standardDeviation: number;
} {
  const cma = getCMA();
  
  // Find asset classes in CMA
  const equityAsset = cma.find(a => a.asset.toLowerCase().includes('equity'));
  const bondsAsset = cma.find(a => a.asset.toLowerCase().includes('bond'));
  const cashAsset = cma.find(a => a.asset.toLowerCase().includes('cash'));
  
  // Calculate weighted expected return
  const expectedReturn = 
    (allocation.equity * (equityAsset?.er || 0.07)) +
    (allocation.bonds * (bondsAsset?.er || 0.035)) +
    (allocation.cash * (cashAsset?.er || 0.02));
  
  // Calculate weighted standard deviation (simplified - not accounting for correlation)
  const standardDeviation = Math.sqrt(
    Math.pow(allocation.equity * (equityAsset?.stdev || 0.16), 2) +
    Math.pow(allocation.bonds * (bondsAsset?.stdev || 0.07), 2) +
    Math.pow(allocation.cash * (cashAsset?.stdev || 0.01), 2)
  );
  
  return { expectedReturn, standardDeviation };
}