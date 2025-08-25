import React from 'react';
import { useMc401k } from '@/features/roadmap/useMc401k'; // from earlier MC harness

export default function K401Strip({ input }:{ input:any }){
  const { result, loading } = useMc401k(input);
  return (
    <div className="rounded-xl border p-3 bg-white">
      <div className="text-sm font-medium">Retirement Readiness</div>
      {loading || !result ? <div className="text-xs text-gray-500">Running simulations…</div> : (
        <div className="text-sm">Success probability: <span className="font-semibold">{Math.round(result.successProb*100)}%</span></div>
      )}
    </div>
  );
}