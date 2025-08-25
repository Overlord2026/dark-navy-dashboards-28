import { useEffect, useMemo, useState, useCallback } from 'react';
import { recordReceipt } from '@/features/receipts/record';
import type { McInput, McOutput } from '../../../workers/mc401k.worker';

export function useMc401k(input: McInput | null) {
  const [output, setOutput] = useState<McOutput | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const worker = useMemo(() => {
    if (typeof Worker !== 'undefined') {
      return new Worker(new URL('../../../workers/mc401k.worker.ts', import.meta.url), { 
        type: 'module' 
      });
    }
    return null;
  }, []);
  
  const runSimulation = useCallback(async (simInput: McInput) => {
    if (!worker) {
      setError('Web Workers not supported');
      return;
    }
    
    setIsRunning(true);
    setError(null);
    
    try {
      // Log start of simulation (content-free)
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'roadmap.mc.run', 
        reasons: ['401k', 'sims_' + simInput.sims, 'age_' + simInput.currentAge], 
        created_at: new Date().toISOString() 
      } as any);
      
      worker.postMessage(simInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
      setIsRunning(false);
    }
  }, [worker]);
  
  useEffect(() => {
    if (!worker) return;
    
    const handleMessage = (e: MessageEvent<McOutput>) => {
      setOutput(e.data);
      setIsRunning(false);
      
      // Log completion (content-free)
      recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'roadmap.mc.complete', 
        reasons: ['success_prob_' + Math.round(e.data.successProb * 100)], 
        created_at: new Date().toISOString() 
      } as any);
    };
    
    const handleError = (error: ErrorEvent) => {
      setError(error.message);
      setIsRunning(false);
    };
    
    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    
    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
    };
  }, [worker]);
  
  useEffect(() => {
    if (input) {
      runSimulation(input);
    }
  }, [input, runSimulation]);
  
  useEffect(() => {
    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, [worker]);
  
  return { 
    output, 
    isRunning, 
    error, 
    runSimulation: useCallback((newInput: McInput) => runSimulation(newInput), [runSimulation])
  };
}

export function createMcInput(
  currentAge: number,
  retireAge: number,
  currentBalance: number,
  income: number,
  employeePct: number,
  employerMatch: { kind: 'none' | 'simple' | 'tiered'; pct?: number; limitPct?: number },
  expRetExpenses: number,
  options: {
    longevityAge?: number;
    escalationPct?: number;
    sims?: number;
    mean?: number;
    stdev?: number;
    inflation?: number;
  } = {}
): McInput {
  return {
    currentAge,
    retireAge,
    longevityAge: options.longevityAge || 95,
    currentBalance,
    income,
    employeePct,
    employerRule: employerMatch,
    annualEscalationPct: options.escalationPct || 0,
    expRetExpenses,
    sims: options.sims || 10000,
    mean: options.mean || 0.07, // 7% expected return
    stdev: options.stdev || 0.15, // 15% volatility
    inflation: options.inflation || 0.025 // 2.5% inflation
  };
}