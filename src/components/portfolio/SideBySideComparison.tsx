import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { Shield, DollarSign } from 'lucide-react';
import { RiskScoreCalculator } from './RiskScoreCalculator';
import { MarketDataService, MarketDataDisplay } from './MarketDataService';

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    marketData?: {
      beta?: number;
      alpha?: number;
      volatility?: number;
      yield?: number;
      ytdReturn?: number;
      oneYearReturn?: number;
    };
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

interface SideBySideComparisonProps {
  currentPortfolio: Portfolio;
  proposedPortfolio: Portfolio;
  clientName?: string;
  riskProfile?: {
    age?: number;
    timeHorizon?: number;
    riskTolerance?: 'conservative' | 'moderate' | 'growth' | 'aggressive';
  };
  onScheduleReview?: () => void;
  className?: string;
}

export function SideBySideComparison({
  currentPortfolio,
  proposedPortfolio,
  clientName = "Client",
  riskProfile,
  onScheduleReview,
  className = ""
}: SideBySideComparisonProps) {
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const [loadingMarketData, setLoadingMarketData] = useState(false);

  // Get all unique symbols from both portfolios
  const allSymbols = [
    ...new Set([
      ...currentPortfolio.holdings.map(h => h.symbol),
      ...proposedPortfolio.holdings.map(h => h.symbol)
    ])
  ];

  const handleMarketDataLoaded = (data: Record<string, any>) => {
    setMarketData(data);
    setLoadingMarketData(false);
  };

  const getRiskLabel = (score: number) => {
    if (score <= 25) return { label: "Conservative", color: "bg-green-500" };
    if (score <= 45) return { label: "Moderate-Income", color: "bg-blue-500" };
    if (score <= 65) return { label: "Growth", color: "bg-yellow-500" };
    return { label: "Aggressive", color: "bg-red-500" };
  };

  const riskDiff = proposedPortfolio.riskScore - currentPortfolio.riskScore;
  const incomeDiff = proposedPortfolio.annualIncome - currentPortfolio.annualIncome;
  const incomePercent = currentPortfolio.annualIncome > 0 
    ? ((incomeDiff / currentPortfolio.annualIncome) * 100).toFixed(1)
    : "N/A";

  const comparisonData = [
    {
      name: 'Risk Score',
      current: currentPortfolio.riskScore,
      proposed: proposedPortfolio.riskScore
    },
    {
      name: 'Annual Income',
      current: currentPortfolio.annualIncome / 1000, // Convert to thousands
      proposed: proposedPortfolio.annualIncome / 1000
    }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Market Data Service */}
      <MarketDataService 
        symbols={allSymbols}
        onDataLoaded={handleMarketDataLoaded}
      />

      {/* Visual Side-by-Side Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>5. Visual Side-by-Side Comparison</CardTitle>
          <CardDescription>
            Comparing {clientName}'s current portfolio with the proposed model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk & Income Bar Chart */}
            <div>
              <h4 className="font-medium mb-4">Risk & Income Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Risk Score' ? value : formatCurrency(Number(value) * 1000),
                        name === 'current' ? 'Current' : 'Proposed'
                      ]}
                    />
                    <Bar dataKey="current" fill={COLORS[0]} name="current" />
                    <Bar dataKey="proposed" fill={COLORS[1]} name="proposed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Stats */}
            <div>
              <h4 className="font-medium mb-4">Portfolio Summary</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {currentPortfolio.riskScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Risk Score</div>
                    <Badge className={`${getRiskLabel(currentPortfolio.riskScore).color} mt-2`}>
                      {getRiskLabel(currentPortfolio.riskScore).label}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {proposedPortfolio.riskScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Proposed Risk Score</div>
                    <Badge className={`${getRiskLabel(proposedPortfolio.riskScore).color} mt-2`}>
                      {getRiskLabel(proposedPortfolio.riskScore).label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xl font-bold">
                      {formatCurrency(currentPortfolio.annualIncome)}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Income/yr</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xl font-bold">
                      {formatCurrency(proposedPortfolio.annualIncome)}
                    </div>
                    <div className="text-sm text-muted-foreground">Proposed Income/yr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
            <h4 className="font-semibold text-lg mb-4">Portfolio Impact Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${riskDiff < 0 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  <Shield className={`w-5 h-5 ${riskDiff < 0 ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <div className="font-medium">
                    Risk Score Change: {riskDiff > 0 ? '+' : ''}{riskDiff}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {riskDiff < 0 ? 'Lower risk profile' : riskDiff > 0 ? 'Higher risk profile' : 'No change'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${incomeDiff > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <DollarSign className={`w-5 h-5 ${incomeDiff > 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <div className="font-medium">
                    Income Change: {formatCurrency(incomeDiff)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {incomePercent !== "N/A" ? `${incomeDiff > 0 ? '+' : ''}${incomePercent}%` : 'N/A'} change
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium mb-2">Analysis Summary</h4>
            <p className="text-sm text-slate-700">
              Switching to the proposed portfolio would {riskDiff < 0 ? 'lower' : riskDiff > 0 ? 'increase' : 'maintain'} 
              {' '}{clientName}'s risk score by {Math.abs(riskDiff)} points 
              {riskDiff < 0 ? `(from ${getRiskLabel(currentPortfolio.riskScore).label} to ${getRiskLabel(proposedPortfolio.riskScore).label})` : ''} 
              and {incomeDiff > 0 ? 'increase' : incomeDiff < 0 ? 'decrease' : 'maintain'} annual income by{' '}
              {incomePercent !== "N/A" ? `${Math.abs(Number(incomePercent))}%` : formatCurrency(Math.abs(incomeDiff))}.
            </p>
          </div>

          {/* Market Data Display */}
          {Object.keys(marketData).length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-4">Market Data Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPortfolio.holdings.slice(0, 6).map(holding => (
                  <Card key={holding.symbol} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-sm text-muted-foreground">{holding.allocation}%</div>
                      </div>
                      <Badge variant="outline">{formatCurrency(holding.value)}</Badge>
                    </div>
                    <MarketDataDisplay 
                      symbol={holding.symbol}
                      marketData={marketData[holding.symbol]}
                      compact={true}
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={onScheduleReview}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Schedule Your Portfolio Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}