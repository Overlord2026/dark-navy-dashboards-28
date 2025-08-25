import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMc401k, createMcInput } from './useMc401k';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Loader2 } from 'lucide-react';
import K401Strip from './K401Strip';

interface K401PanelProps {
  currentAge?: number;
  retireAge?: number;
  currentBalance?: number;
  income?: number;
  initialDeferralPct?: number;
  employerMatch?: {
    kind: 'none' | 'simple' | 'tiered';
    pct?: number;
    limitPct?: number;
  };
  expectedExpenses?: number;
}

export const K401Panel: React.FC<K401PanelProps> = ({
  currentAge = 35,
  retireAge = 65,
  currentBalance = 25000,
  income = 75000,
  initialDeferralPct = 6,
  employerMatch = { kind: 'simple', pct: 50, limitPct: 6 },
  expectedExpenses = 60000
}) => {
  const [deferralPct, setDeferralPct] = React.useState(initialDeferralPct);
  const [escalationEnabled, setEscalationEnabled] = React.useState(true);
  const [retirementExpenses, setRetirementExpenses] = React.useState(expectedExpenses);
  
  // Create Monte Carlo input
  const mcInput = React.useMemo(() => 
    createMcInput(
      currentAge,
      retireAge,
      currentBalance,
      income,
      deferralPct,
      employerMatch,
      retirementExpenses,
      {
        escalationPct: escalationEnabled ? 1 : 0,
        sims: 10000
      }
    ), [currentAge, retireAge, currentBalance, income, deferralPct, employerMatch, retirementExpenses, escalationEnabled]
  );
  
  const { output, isRunning, error } = useMc401k(mcInput);
  
  const getSuccessColor = (probability: number) => {
    if (probability >= 0.85) return 'text-green-600 bg-green-50';
    if (probability >= 0.70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };
  
  const getSuccessIcon = (probability: number) => {
    if (probability >= 0.85) return <TrendingUp className="h-4 w-4" />;
    if (probability >= 0.70) return <Target className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const currentEmployerMatch = React.useMemo(() => {
    if (employerMatch.kind === 'none') return 0;
    if (employerMatch.kind === 'simple') {
      const matchablePct = Math.min(deferralPct, employerMatch.limitPct || 0);
      return income * (matchablePct / 100) * ((employerMatch.pct || 0) / 100);
    }
    return 0; // Simplified for tiered matches
  }, [income, deferralPct, employerMatch]);
  
  const missedMatch = React.useMemo(() => {
    if (employerMatch.kind === 'simple' && employerMatch.limitPct) {
      if (deferralPct < employerMatch.limitPct) {
        const missedPct = employerMatch.limitPct - deferralPct;
        return income * (missedPct / 100) * ((employerMatch.pct || 0) / 100);
      }
    }
    return 0;
  }, [income, deferralPct, employerMatch]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>401(k) Monte Carlo Analysis</span>
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Monte Carlo Strip */}
        <K401Strip input={mcInput} />
        
        {/* Current Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="deferral-slider">Employee Deferral: {deferralPct}%</Label>
              <Slider
                id="deferral-slider"
                min={0}
                max={22}
                step={0.5}
                value={[deferralPct]}
                onValueChange={(value) => setDeferralPct(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="expenses-input">Annual Retirement Expenses</Label>
              <Input
                id="expenses-input"
                type="number"
                value={retirementExpenses}
                onChange={(e) => setRetirementExpenses(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="escalation-check"
                checked={escalationEnabled}
                onChange={(e) => setEscalationEnabled(e.target.checked)}
              />
              <Label htmlFor="escalation-check">Auto-escalate deferral (+1% annually)</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="text-sm font-medium">Annual Contributions</div>
              <div className="text-lg font-bold">
                {formatCurrency(income * (deferralPct / 100))}
              </div>
              <div className="text-sm text-gray-600">Employee ({deferralPct}% of {formatCurrency(income)})</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="text-sm font-medium">Employer Match</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(currentEmployerMatch)}
              </div>
              {employerMatch.kind === 'simple' && (
                <div className="text-sm text-gray-600">
                  {employerMatch.pct}% match up to {employerMatch.limitPct}% deferral
                </div>
              )}
            </div>
            
            {missedMatch > 0 && (
              <div className="bg-red-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-sm font-medium text-red-800">Missed Match</div>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(missedMatch)}
                </div>
                <div className="text-sm text-red-700">
                  Increase deferral to {employerMatch.limitPct}% to capture full match
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Monte Carlo Results */}
        {output && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${getSuccessColor(output.successProb)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {getSuccessIcon(output.successProb)}
                  <div className="text-sm font-medium">Success Rate</div>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(output.successProb * 100)}%
                </div>
                <div className="text-xs opacity-75">
                  Money lasts to age {mcInput.longevityAge}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Median Balance</div>
                <div className="text-xl font-bold">
                  {formatCurrency(output.p50End)}
                </div>
                <div className="text-xs text-gray-500">50th percentile</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Conservative</div>
                <div className="text-xl font-bold">
                  {formatCurrency(output.p10End)}
                </div>
                <div className="text-xs text-gray-500">10th percentile</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-2">Optimistic</div>
                <div className="text-xl font-bold">
                  {formatCurrency(output.p90End)}
                </div>
                <div className="text-xs text-gray-500">90th percentile</div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">Recommendations</div>
              <div className="text-sm text-blue-700 space-y-1">
                {missedMatch > 0 && (
                  <div>• Increase deferral to {employerMatch.limitPct}% to capture full employer match ({formatCurrency(missedMatch)} annual benefit)</div>
                )}
                {output.successProb < 0.85 && (
                  <div>• Consider increasing deferral percentage or reducing retirement expenses to improve success rate</div>
                )}
                {!escalationEnabled && (
                  <div>• Enable auto-escalation to gradually increase savings rate over time</div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="text-sm font-medium text-red-800">Simulation Error</div>
            </div>
            <div className="text-sm text-red-700 mt-1">{error}</div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 border-t pt-4">
          Simulation based on 10,000 scenarios with 7% expected return, 15% volatility, and 2.5% inflation.
          Results are projections and not guaranteed.
        </div>
      </CardContent>
    </Card>
  );
};