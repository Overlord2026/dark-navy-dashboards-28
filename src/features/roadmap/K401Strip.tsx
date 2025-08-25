import React from 'react';
import { useMc401k } from '@/features/roadmap/useMc401k';
import type { McInput } from '@/workers/mc401k.worker';

export default function K401Strip() {
  // Simple default simulation
  const defaultInput: McInput = {
    currentAge: 35,
    retireAge: 65,
    longevityAge: 90,
    currentBalance: 50000,
    income: 75000,
    employeePct: 8,
    employerRule: { kind: 'simple', pct: 50, limitPct: 6 },
    expRetExpenses: 50000,
    sims: 10000,
    mean: 0.07,
    stdev: 0.15,
    inflation: 0.025
  };

  const { result, loading } = useMc401k(defaultInput);
  
  return (
    <div className="rounded-xl border border-border p-3 bg-card">
      <div className="text-sm font-medium text-foreground">Retirement Readiness</div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Running simulations…</div>
      ) : result ? (
        <div className="text-sm text-foreground">
          Success probability: <span className="font-semibold text-primary">{Math.round(result.successProb * 100)}%</span>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Ready to simulate</div>
      )}
    </div>
  );
}