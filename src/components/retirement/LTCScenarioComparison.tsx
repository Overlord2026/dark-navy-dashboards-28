import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { LTCComprehensiveAnalysis } from '@/engines/stressTesting/ltcStressEngine';

interface LTCScenarioComparisonProps {
  analysis: LTCComprehensiveAnalysis;
}

export function LTCScenarioComparison({ analysis }: LTCScenarioComparisonProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Expected Case</h4>
                <p className="text-2xl font-bold">
                  {formatCurrency(analysis.expectedValueScenario.outOfPocketCost)}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Worst Case</h4>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(analysis.worstCaseScenario.outOfPocketCost)}
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Insurance Gap</h4>
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(analysis.insuranceGap)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}