/**
 * Phase Allocation Visualization Chart
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { PhaseAllocation } from '@/engines/multiPhase/multiPhaseEngine';

interface PhaseAllocationChartProps {
  phases: PhaseAllocation[];
}

export function PhaseAllocationChart({ phases }: PhaseAllocationChartProps) {
  const COLORS = {
    us_stocks: '#10b981',
    international_stocks: '#3b82f6',
    bonds: '#8b5cf6',
    cash: '#f59e0b',
    private_credit: '#ef4444',
    infrastructure: '#f97316',
    crypto_staking: '#06b6d4'
  };

  const ASSET_LABELS = {
    us_stocks: 'US Stocks',
    international_stocks: 'International Stocks',
    bonds: 'Bonds',
    cash: 'Cash',
    private_credit: 'Private Credit',
    infrastructure: 'Infrastructure',
    crypto_staking: 'Crypto Staking'
  };

  const formatPhaseData = (phase: PhaseAllocation) => {
    return Object.entries(phase.allocations)
      .filter(([_, weight]) => weight > 0)
      .map(([assetId, weight]) => ({
        name: ASSET_LABELS[assetId as keyof typeof ASSET_LABELS] || assetId,
        value: weight * 100,
        weight,
        color: COLORS[assetId as keyof typeof COLORS] || '#6b7280'
      }));
  };

  const getPhaseLabel = (phaseId: string) => {
    const labels = {
      growth: 'Growth Phase',
      income_later: 'Pre-Retirement',
      income_now: 'Income Now',
      legacy: 'Legacy Phase'
    };
    return labels[phaseId as keyof typeof labels] || phaseId;
  };

  const getPhaseColor = (phaseId: string) => {
    const colors = {
      growth: 'bg-green-500',
      income_later: 'bg-blue-500',
      income_now: 'bg-purple-500', 
      legacy: 'bg-amber-500'
    };
    return colors[phaseId as keyof typeof colors] || 'bg-gray-500';
  };

  // Prepare data for comparison chart
  const comparisonData = phases.map(phase => ({
    phase: getPhaseLabel(phase.phaseId),
    expectedReturn: phase.expectedReturn * 100,
    volatility: phase.expectedVolatility * 100,
    maxDrawdown: phase.maxDrawdown * 100,
    liquidityScore: phase.liquidityScore * 100
  }));

  return (
    <div className="space-y-6">
      {/* Phase Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Phase Performance Comparison</CardTitle>
          <CardDescription>
            Expected returns, volatility, and risk metrics across phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, name]}
                />
                <Bar dataKey="expectedReturn" fill="#10b981" name="Expected Return" />
                <Bar dataKey="volatility" fill="#3b82f6" name="Volatility" />
                <Bar dataKey="maxDrawdown" fill="#ef4444" name="Max Drawdown" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Phase Allocations */}
      <div className="grid md:grid-cols-2 gap-6">
        {phases.map((phase) => {
          const phaseData = formatPhaseData(phase);
          
          return (
            <Card key={phase.phaseId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase.phaseId)}`} />
                  {getPhaseLabel(phase.phaseId)}
                </CardTitle>
                <CardDescription>
                  Expected Return: {(phase.expectedReturn * 100).toFixed(1)}% | 
                  Max Drawdown: {(phase.maxDrawdown * 100).toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pie Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={phaseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {phaseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${typeof value === 'number' ? value.toFixed(1) : value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="space-y-2">
                    {phaseData.map((asset) => (
                      <div key={asset.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: asset.color }}
                            />
                            <span>{asset.name}</span>
                          </div>
                          <span className="font-medium">{asset.value.toFixed(1)}%</span>
                        </div>
                        <Progress value={asset.value} className="h-2" />
                      </div>
                    ))}
                  </div>

                  {/* Phase Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Liquidity Score</p>
                      <p className="font-medium">{(phase.liquidityScore * 100).toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Volatility</p>
                      <p className="font-medium">{(phase.expectedVolatility * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}