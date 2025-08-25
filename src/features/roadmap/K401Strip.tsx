import React from 'react';
import { useMc401k } from '@/features/roadmap/useMc401k';

export default function K401Strip() {
  const mc = useMc401k();
  const { loading, results } = mc;
  
  return (
    <div className="rounded-xl border border-border p-3 bg-card">
      <div className="text-sm font-medium text-foreground">Retirement Readiness</div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Running simulations…</div>
      ) : results.length > 0 ? (
        <div className="text-sm text-foreground">
          Success probability: <span className="font-semibold text-primary">{Math.round(results.find(r => r.scenario.includes('50th'))?.probability * 100 || 50)}%</span>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Ready to simulate</div>
      )}
    </div>
  );
}