import React from 'react';
import { useMc401k } from '@/features/roadmap/useMc401k';

export default function K401Strip({ input }: { input: any }) {
  const out = useMc401k(input);
  
  return (
    <div className="rounded-xl border border-border p-3 bg-card">
      <div className="text-sm font-medium text-foreground">Retirement Readiness</div>
      {out.isRunning ? (
        <div className="text-xs text-muted-foreground">Running simulations…</div>
      ) : out.output ? (
        <div className="text-sm text-foreground">
          Success probability: <span className="font-semibold text-primary">{Math.round(out.output.successProb * 100)}%</span>
        </div>
      ) : out.error ? (
        <div className="text-xs text-destructive">Error: {out.error}</div>
      ) : (
        <div className="text-xs text-muted-foreground">Ready to simulate</div>
      )}
    </div>
  );
}