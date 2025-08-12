/**
 * SWAG Phase Shift Logic
 * Placeholder for phase transition and rebalancing logic
 */

import { PhaseId } from './models';

export function getNextPhase(currentPhase: PhaseId, age: number, portfolioValue: number): PhaseId {
  // Simplified phase transition logic
  if (age < 62) return 'GROWTH';
  if (age < 67) return 'INCOME_NOW';
  if (portfolioValue > 2000000) return 'LEGACY';
  return 'INCOME_LATER';
}

export function shouldRebalance(currentAllocation: Record<string, number>, targetAllocation: Record<string, number>, threshold = 0.05): boolean {
  return Object.keys(targetAllocation).some(asset => {
    const current = currentAllocation[asset] || 0;
    const target = targetAllocation[asset] || 0;
    return Math.abs(current - target) > threshold;
  });
}