import React from 'react';
import { MonteCarloWorker } from './worker';
import { logMonteCarloSimulation, logMonteCarloProgress } from './receipts';
import type { MonteCarloParams, MonteCarloResult, SimulationProgress } from './types';

export function useMonteCarloSimulation() {
  const [worker] = React.useState(() => new MonteCarloWorker());
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState<SimulationProgress | null>(null);
  const [result, setResult] = React.useState<MonteCarloResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const runSimulation = React.useCallback(async (params: MonteCarloParams) => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(null);
    setResult(null);
    setError(null);

    const sessionId = `mc_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    try {
      const result = await worker.runSimulation(params, (progress) => {
        setProgress(progress);
        logMonteCarloProgress(progress.completed, progress.total, sessionId);
      });

      setResult(result);
      await logMonteCarloSimulation(params, result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Simulation failed';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  }, [worker, isRunning]);

  const clearResults = React.useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(null);
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);

  return {
    runSimulation,
    clearResults,
    isRunning,
    progress,
    result,
    error
  };
}