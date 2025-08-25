import { useState } from 'react';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';

export interface McResult {
  scenario: string;
  probability: number;
  timeline: string;
  details: string;
}

export function useMc401k() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<McResult[]>([]);

  const runSimulation = async (params: {
    currentValue: number;
    monthlyContribution: number;
    employerMatch: number;
    yearsToRetirement: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  }) => {
    setLoading(true);
    
    try {
      // Simulate Monte Carlo computation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const scenarios: McResult[] = [
        {
          scenario: 'Conservative (10th percentile)',
          probability: 0.1,
          timeline: `${params.yearsToRetirement} years`,
          details: `Final value: $${(params.currentValue * 1.8).toLocaleString()}`
        },
        {
          scenario: 'Moderate (50th percentile)',
          probability: 0.5,
          timeline: `${params.yearsToRetirement} years`,
          details: `Final value: $${(params.currentValue * 3.2).toLocaleString()}`
        },
        {
          scenario: 'Aggressive (90th percentile)',
          probability: 0.9,
          timeline: `${params.yearsToRetirement} years`,
          details: `Final value: $${(params.currentValue * 5.1).toLocaleString()}`
        }
      ];
      
      setResults(scenarios);
      
      // Generate hash of simulation parameters and results
      const simulationData = JSON.stringify({ params, scenarios, timestamp: new Date().toISOString() });
      const hash = await generateHash(simulationData);
      
      // Record content-free receipt
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'mc401k.simulation.run',
        reasons: [params.riskTolerance, hash.slice(0, 16)],
        created_at: new Date().toISOString()
      } as any);
      
      // Optional anchoring
      await maybeAnchor('mc401k.simulation', hash);
      
    } catch (error) {
      console.error('MC simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    runSimulation
  };
}