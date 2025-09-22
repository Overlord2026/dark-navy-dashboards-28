import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import type { LTCComprehensiveAnalysis } from '@/engines/stressTesting/ltcStressEngine';

interface LTCStressResultsProps {
  analysis: LTCComprehensiveAnalysis;
}

export function LTCStressResults({ analysis }: LTCStressResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stress Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.scenarios.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{result.scenario.name}</h4>
                  <Badge variant={result.riskLevel === 'severe' ? 'destructive' : 'secondary'}>
                    {result.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {result.scenario.description}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">{formatCurrency(result.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Pocket:</span>
                    <span className="font-medium">{formatCurrency(result.outOfPocketCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Worth Impact:</span>
                    <span className="font-medium">{Math.round(result.impactOnNetWorth * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}