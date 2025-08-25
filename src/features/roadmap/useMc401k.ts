import { useEffect, useMemo, useState } from 'react';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';
import type { McInput, McOutput } from '@/workers/mc401k.worker';

export function useMc401k(input: McInput) {
  const [out, setOut] = useState<McOutput | null>(null);
  const [loading, setLoading] = useState(false);
  
  const worker = useMemo(() => 
    new Worker(new URL('../../workers/mc401k.worker.ts', import.meta.url), { type: 'module' }), 
    []
  );
  
  useEffect(() => {
    if (!input) return;
    
    setLoading(true);
    const handler = (e: MessageEvent) => {
      setOut(e.data);
      setLoading(false);
    };
    
    worker.addEventListener('message', handler as any);
    worker.postMessage(input);
    
    // Log content-free receipt with optional anchoring
    (async () => {
      const inputHash = await generateHash(JSON.stringify(input));
      
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'roadmap.mc.run', 
        reasons: ['401k', inputHash.slice(0, 16)], 
        created_at: new Date().toISOString() 
      } as any);
      
      // Optional anchoring
      await maybeAnchor('roadmap.mc', inputHash);
    })();
    
    return () => worker.removeEventListener('message', handler as any);
  }, [JSON.stringify(input), worker]);

  useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);
  
  return { result: out, loading };
}