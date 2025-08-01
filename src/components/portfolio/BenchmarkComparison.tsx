import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface Holding {
  symbol: string;
  name: string;
  allocation: number;
  value: number;
  assetClass: 'stock' | 'bond' | 'reit' | 'commodity' | 'cash';
  marketData?: {
    beta?: number;
    volatility?: number;
    yield?: number;
    ytdReturn?: number;
    oneYearReturn?: number;
  };
}

interface Portfolio {
  name: string;
  holdings: Holding[];
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

interface BenchmarkComparisonProps {
  portfolio: Portfolio;
  onExportPDF?: () => void;
}

const BENCHMARKS = {
  'SPY': { name: 'S&P 500 (SPY)', type: 'equity', beta: 1.0 },
  'AGG': { name: 'Bond Aggregate (AGG)', type: 'bond', beta: 0.05 },
  'VTI': { name: 'Total Stock Market (VTI)', type: 'equity', beta: 1.02 },
  'IWM': { name: 'Small Cap (IWM)', type: 'equity', beta: 1.25 },
  'QQQ': { name: 'Nasdaq 100 (QQQ)', type: 'equity', beta: 1.15 }
};

export function BenchmarkComparison({ portfolio, onExportPDF }: BenchmarkComparisonProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  
  // Calculate portfolio-level metrics
  const portfolioMetrics = useMemo(() => {
    let weightedBeta = 0;
    let weightedVolatility = 0;
    let totalWeight = 0;

    portfolio.holdings.forEach(holding => {
      const weight = holding.allocation / 100;
      const benchmark = holding.assetClass === 'bond' ? 'AGG' : 'SPY';
      const beta = holding.marketData?.beta || BENCHMARKS[benchmark].beta;
      const volatility = holding.marketData?.volatility || 
        (holding.assetClass === 'bond' ? 4 : 16); // Default volatilities
      
      weightedBeta += beta * weight;
      weightedVolatility += volatility * weight;
      totalWeight += weight;
    });

    return {
      portfolioBeta: totalWeight > 0 ? weightedBeta / totalWeight : 1.0,
      portfolioVolatility: totalWeight > 0 ? weightedVolatility / totalWeight : 10.0,
      benchmarkBeta: BENCHMARKS[selectedBenchmark].beta
    };
  }, [portfolio, selectedBenchmark]);

  const volatilityComparison = useMemo(() => {
    const benchmarkVol = selectedBenchmark === 'AGG' ? 4.2 : 16.5; // Historical volatilities
    const difference = ((portfolioMetrics.portfolioVolatility - benchmarkVol) / benchmarkVol) * 100;
    return {
      isMore: difference > 0,
      percentage: Math.abs(difference),
      portfolioVol: portfolioMetrics.portfolioVolatility,
      benchmarkVol
    };
  }, [portfolioMetrics.portfolioVolatility, selectedBenchmark]);

  const chartData = [
    {
      name: 'Portfolio',
      beta: portfolioMetrics.portfolioBeta,
      volatility: portfolioMetrics.portfolioVolatility
    },
    {
      name: BENCHMARKS[selectedBenchmark].name,
      beta: portfolioMetrics.benchmarkBeta,
      volatility: selectedBenchmark === 'AGG' ? 4.2 : 16.5
    }
  ];

  const holdingsWithBenchmarks = portfolio.holdings.map(holding => ({
    ...holding,
    benchmark: holding.assetClass === 'bond' ? 'AGG' : 'SPY',
    benchmarkBeta: holding.assetClass === 'bond' ? 0.05 : 1.0,
    effectiveBeta: holding.marketData?.beta || (holding.assetClass === 'bond' ? 0.05 : 1.0)
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Portfolio Benchmark Analysis
            <div className="flex gap-2">
              <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BENCHMARKS).map(([key, benchmark]) => (
                    <SelectItem key={key} value={key}>
                      {benchmark.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onExportPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {portfolioMetrics.portfolioBeta.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Portfolio Beta</div>
                <Badge variant={portfolioMetrics.portfolioBeta > 1 ? "destructive" : "secondary"} className="mt-2">
                  {portfolioMetrics.portfolioBeta > 1 ? "Higher Risk" : "Lower Risk"}
                </Badge>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {formatPercentage(portfolioMetrics.portfolioVolatility)}
                </div>
                <div className="text-sm text-muted-foreground">Portfolio Volatility</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {volatilityComparison.isMore ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {formatPercentage(volatilityComparison.percentage)} vs benchmark
                  </span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {BENCHMARKS[selectedBenchmark].beta.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Benchmark Beta</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {BENCHMARKS[selectedBenchmark].name}
                </div>
              </div>
            </Card>
          </div>

          {/* Volatility Comparison */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
            <h4 className="font-semibold mb-2">Volatility Analysis</h4>
            <p className="text-sm">
              Your portfolio is <strong>{formatPercentage(volatilityComparison.percentage)}</strong>{' '}
              {volatilityComparison.isMore ? 'more' : 'less'} volatile than the{' '}
              {BENCHMARKS[selectedBenchmark].name}. This indicates{' '}
              {volatilityComparison.isMore ? 'higher risk and potential return' : 'lower risk and more stability'}.
            </p>
          </div>

          {/* Beta vs Benchmark Chart */}
          <div>
            <h4 className="font-medium mb-4">Portfolio vs Benchmark Comparison</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'beta' ? value : `${Number(value).toFixed(1)}%`,
                      name === 'beta' ? 'Beta' : 'Volatility'
                    ]}
                  />
                  <Bar dataKey="beta" fill="hsl(var(--primary))" name="beta" />
                  <Bar dataKey="volatility" fill="hsl(var(--secondary))" name="volatility" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Holdings Beta Analysis */}
          <div>
            <h4 className="font-medium mb-4">Individual Holdings Beta Analysis</h4>
            <div className="space-y-2">
              {holdingsWithBenchmarks.slice(0, 10).map((holding, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{holding.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.allocation}% • vs {holding.benchmark}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">β {holding.effectiveBeta.toFixed(2)}</div>
                    <Badge 
                      variant={holding.effectiveBeta > holding.benchmarkBeta ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {holding.effectiveBeta > holding.benchmarkBeta ? 'Higher Risk' : 'Lower Risk'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Narrative */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Risk Assessment Summary
            </h4>
            <div className="text-sm space-y-2">
              <p>
                <strong>Portfolio Beta:</strong> At {portfolioMetrics.portfolioBeta.toFixed(2)}, this portfolio is{' '}
                {portfolioMetrics.portfolioBeta > 1 ? 'more volatile' : 'less volatile'} than the market.
              </p>
              <p>
                <strong>Risk Profile:</strong> The portfolio shows{' '}
                {portfolioMetrics.portfolioBeta > 1.2 ? 'aggressive' : 
                 portfolioMetrics.portfolioBeta > 1.0 ? 'moderate-growth' : 
                 portfolioMetrics.portfolioBeta > 0.8 ? 'moderate' : 'conservative'} risk characteristics.
              </p>
              <p>
                <strong>Diversification:</strong> Holdings are benchmarked against appropriate indices,{' '}
                with {portfolio.holdings.filter(h => h.assetClass === 'stock').length} equity positions{' '}
                and {portfolio.holdings.filter(h => h.assetClass === 'bond').length} fixed-income positions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}