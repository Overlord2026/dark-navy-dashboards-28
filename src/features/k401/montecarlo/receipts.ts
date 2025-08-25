import { recordReceipt } from '@/features/receipts/record';
import type { MonteCarloParams, MonteCarloResult } from './types';

export async function logMonteCarloSimulation(
  params: MonteCarloParams,
  result: MonteCarloResult
): Promise<void> {
  // Log simulation execution with content-free receipt
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'k401.montecarlo.executed',
    reasons: [
      `iterations:${result.iterations}`,
      `success_rate:${result.successRate.toFixed(1)}%`,
      `execution_time:${result.executionTime.toFixed(0)}ms`,
      `age_span:${params.currentAge}-${params.retireAge}`,
      `deferral:${params.deferralPct}%`
    ],
    created_at: new Date().toISOString()
  });
}

export async function logMonteCarloProgress(
  completed: number,
  total: number,
  sessionId: string
): Promise<void> {
  // Log progress milestones (every 25%)
  const percentage = Math.round((completed / total) * 100);
  if (percentage % 25 === 0 && percentage > 0) {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'k401.montecarlo.progress',
      reasons: [
        `session:${sessionId}`,
        `progress:${percentage}%`,
        `completed:${completed}`,
        `total:${total}`
      ],
      created_at: new Date().toISOString()
    });
  }
}