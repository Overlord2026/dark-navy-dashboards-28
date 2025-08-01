import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrophyIcon } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface CompetitorData {
  name: string;
  symbol: string;
  type: 'etf' | 'portfolio';
  metrics: {
    annualReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    expenseRatio: number;
    yield: number;
    beta: number;
    aum: number;
  };
  isCurrent?: boolean;
}

interface CompetitorComparisonProps {
  currentPortfolio: {
    name: string;
    metrics: CompetitorData['metrics'];
  };
  previewMode?: boolean;
}

// Popular ETF options for quick selection
const POPULAR_ETFS = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF' },
  { symbol: 'VWO', name: 'Vanguard Emerging Markets Stock ETF' },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' }
];

// Mock competitor data - in real app, this would come from API
const mockCompetitorData: Record<string, CompetitorData> = {
  'SPY': {
    name: 'SPDR S&P 500 ETF',
    symbol: 'SPY',
    type: 'etf',
    metrics: {
      annualReturn: 10.2,
      volatility: 15.8,
      sharpeRatio: 0.64,
      maxDrawdown: -23.9,
      expenseRatio: 0.09,
      yield: 1.6,
      beta: 1.0,
      aum: 450000000000
    }
  },
  'VTI': {
    name: 'Vanguard Total Stock Market ETF',
    symbol: 'VTI',
    type: 'etf',
    metrics: {
      annualReturn: 10.8,
      volatility: 16.2,
      sharpeRatio: 0.67,
      maxDrawdown: -24.5,
      expenseRatio: 0.03,
      yield: 1.4,
      beta: 1.02,
      aum: 320000000000
    }
  },
  'QQQ': {
    name: 'Invesco QQQ Trust',
    symbol: 'QQQ',
    type: 'etf',
    metrics: {
      annualReturn: 14.1,
      volatility: 22.4,
      sharpeRatio: 0.63,
      maxDrawdown: -32.7,
      expenseRatio: 0.20,
      yield: 0.7,
      beta: 1.18,
      aum: 220000000000
    }
  }
};

export default function CompetitorComparison({ currentPortfolio, previewMode = false }: CompetitorComparisonProps) {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(['SPY', 'VTI']);
  const [customSymbol, setCustomSymbol] = useState('');
  const [sortBy, setSortBy] = useState<keyof CompetitorData['metrics']>('annualReturn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const addCompetitor = (symbol: string) => {
    if (selectedCompetitors.length < 3 && !selectedCompetitors.includes(symbol)) {
      setSelectedCompetitors([...selectedCompetitors, symbol]);
    }
  };

  const addCustomCompetitor = () => {
    if (customSymbol && selectedCompetitors.length < 3 && !selectedCompetitors.includes(customSymbol)) {
      // In real app, would fetch data for custom symbol
      setSelectedCompetitors([...selectedCompetitors, customSymbol]);
      setCustomSymbol('');
    }
  };

  const removeCompetitor = (symbol: string) => {
    setSelectedCompetitors(selectedCompetitors.filter(s => s !== symbol));
  };

  const allPortfolios = useMemo(() => {
    const competitors = selectedCompetitors.map(symbol => 
      mockCompetitorData[symbol] || {
        name: symbol,
        symbol,
        type: 'portfolio' as const,
        metrics: {
          annualReturn: Math.random() * 15 + 5,
          volatility: Math.random() * 10 + 10,
          sharpeRatio: Math.random() * 0.5 + 0.3,
          maxDrawdown: -(Math.random() * 20 + 5),
          expenseRatio: Math.random() * 0.5,
          yield: Math.random() * 3,
          beta: Math.random() * 0.5 + 0.8,
          aum: Math.random() * 100000000000
        }
      }
    );
    
    return [
      {
        name: currentPortfolio.name,
        symbol: 'CURRENT',
        type: 'portfolio' as const,
        metrics: currentPortfolio.metrics,
        isCurrent: true
      },
      ...competitors
    ];
  }, [selectedCompetitors, currentPortfolio]);

  const sortedPortfolios = useMemo(() => {
    return [...allPortfolios].sort((a, b) => {
      const aValue = a.metrics[sortBy];
      const bValue = b.metrics[sortBy];
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [allPortfolios, sortBy, sortOrder]);

  const getWinner = (metric: keyof CompetitorData['metrics']) => {
    // For some metrics, lower is better
    const lowerIsBetter = ['volatility', 'maxDrawdown', 'expenseRatio'];
    const best = allPortfolios.reduce((best, current) => {
      const bestValue = best.metrics[metric];
      const currentValue = current.metrics[metric];
      
      if (lowerIsBetter.includes(metric)) {
        return Math.abs(currentValue) < Math.abs(bestValue) ? current : best;
      } else {
        return currentValue > bestValue ? current : best;
      }
    });
    return best;
  };

  const getPerformanceColor = (value: number, metric: keyof CompetitorData['metrics'], isWinner: boolean) => {
    if (isWinner) return 'text-primary font-bold';
    
    if (metric === 'annualReturn' || metric === 'sharpeRatio' || metric === 'yield') {
      return value > 0 ? 'text-emerald-600' : 'text-destructive';
    }
    if (metric === 'volatility' || metric === 'expenseRatio') {
      return value < 15 ? 'text-emerald-600' : 'text-amber-600';
    }
    if (metric === 'maxDrawdown') {
      return value > -20 ? 'text-emerald-600' : 'text-destructive';
    }
    return 'text-foreground';
  };

  const formatMetricValue = (value: number, metric: keyof CompetitorData['metrics']) => {
    switch (metric) {
      case 'annualReturn':
      case 'volatility':
      case 'yield':
      case 'expenseRatio':
      case 'maxDrawdown':
        return formatPercentage(value);
      case 'sharpeRatio':
        return value.toFixed(2);
      case 'beta':
        return value.toFixed(2);
      case 'aum':
        return formatCurrency(value);
      default:
        return value.toString();
    }
  };

  if (previewMode) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          Competitor Comparison Analysis
        </h2>
        
        <div className="grid gap-4 mb-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 border-r font-semibold">Portfolio/ETF</th>
                  <th className="text-center p-3 border-r font-semibold">Annual Return</th>
                  <th className="text-center p-3 border-r font-semibold">Volatility</th>
                  <th className="text-center p-3 border-r font-semibold">Sharpe Ratio</th>
                  <th className="text-center p-3 border-r font-semibold">Max Drawdown</th>
                  <th className="text-center p-3 border-r font-semibold">Expense Ratio</th>
                  <th className="text-center p-3 font-semibold">Yield</th>
                </tr>
              </thead>
              <tbody>
                {allPortfolios.map((portfolio, index) => (
                  <tr key={portfolio.symbol} className={`border-b ${portfolio.isCurrent ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 border-r font-medium">
                      <div className="flex items-center gap-2">
                        {portfolio.name}
                        {portfolio.isCurrent && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 border-r text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('annualReturn').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.annualReturn, 
                          'annualReturn',
                          getWinner('annualReturn').symbol === portfolio.symbol
                        )}>
                          {formatPercentage(portfolio.metrics.annualReturn)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border-r text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('volatility').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.volatility, 
                          'volatility',
                          getWinner('volatility').symbol === portfolio.symbol
                        )}>
                          {formatPercentage(portfolio.metrics.volatility)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border-r text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('sharpeRatio').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.sharpeRatio, 
                          'sharpeRatio',
                          getWinner('sharpeRatio').symbol === portfolio.symbol
                        )}>
                          {portfolio.metrics.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border-r text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('maxDrawdown').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.maxDrawdown, 
                          'maxDrawdown',
                          getWinner('maxDrawdown').symbol === portfolio.symbol
                        )}>
                          {formatPercentage(portfolio.metrics.maxDrawdown)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border-r text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('expenseRatio').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.expenseRatio, 
                          'expenseRatio',
                          getWinner('expenseRatio').symbol === portfolio.symbol
                        )}>
                          {formatPercentage(portfolio.metrics.expenseRatio)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getWinner('yield').symbol === portfolio.symbol && (
                          <TrophyIcon className="h-3 w-3 text-primary" />
                        )}
                        <span className={getPerformanceColor(
                          portfolio.metrics.yield, 
                          'yield',
                          getWinner('yield').symbol === portfolio.symbol
                        )}>
                          {formatPercentage(portfolio.metrics.yield)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Winner Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Best Return</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrophyIcon className="h-4 w-4 text-primary" />
                  <span className="font-bold">{getWinner('annualReturn').name}</span>
                </div>
                <p className="text-sm text-primary font-semibold">
                  {formatPercentage(getWinner('annualReturn').metrics.annualReturn)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Best Risk-Adj. Return</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrophyIcon className="h-4 w-4 text-primary" />
                  <span className="font-bold">{getWinner('sharpeRatio').name}</span>
                </div>
                <p className="text-sm text-primary font-semibold">
                  {getWinner('sharpeRatio').metrics.sharpeRatio.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">Lowest Cost</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrophyIcon className="h-4 w-4 text-primary" />
                  <span className="font-bold">{getWinner('expenseRatio').name}</span>
                </div>
                <p className="text-sm text-primary font-semibold">
                  {formatPercentage(getWinner('expenseRatio').metrics.expenseRatio)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Interactive controls for report configuration
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrophyIcon className="h-5 w-5" />
          Competitor Comparison Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Competitors */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Competitors (up to 3)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedCompetitors.map(symbol => (
              <Badge 
                key={symbol} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {mockCompetitorData[symbol]?.name || symbol}
                <button 
                  onClick={() => removeCompetitor(symbol)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 mb-3">
            <Select onValueChange={addCompetitor} disabled={selectedCompetitors.length >= 3}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add popular ETF..." />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_ETFS.filter(etf => !selectedCompetitors.includes(etf.symbol)).map(etf => (
                  <SelectItem key={etf.symbol} value={etf.symbol}>
                    {etf.symbol} - {etf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Or enter custom symbol..."
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
              disabled={selectedCompetitors.length >= 3}
            />
            <Button 
              onClick={addCustomCompetitor}
              disabled={!customSymbol || selectedCompetitors.length >= 3}
              variant="outline"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <Select value={sortBy} onValueChange={(value: keyof CompetitorData['metrics']) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annualReturn">Annual Return</SelectItem>
                <SelectItem value="volatility">Volatility</SelectItem>
                <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                <SelectItem value="maxDrawdown">Max Drawdown</SelectItem>
                <SelectItem value="expenseRatio">Expense Ratio</SelectItem>
                <SelectItem value="yield">Yield</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Order</label>
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High to Low</SelectItem>
                <SelectItem value="asc">Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview Table */}
        {selectedCompetitors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border rounded">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 border-r">Name</th>
                    <th className="text-center p-2 border-r">Return</th>
                    <th className="text-center p-2 border-r">Volatility</th>
                    <th className="text-center p-2">Sharpe</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPortfolios.slice(0, 3).map(portfolio => (
                    <tr key={portfolio.symbol} className="border-b">
                      <td className="p-2 border-r">
                        {portfolio.name}
                        {portfolio.isCurrent && <Badge variant="outline" className="ml-1 text-xs">Current</Badge>}
                      </td>
                      <td className="p-2 border-r text-center">{formatPercentage(portfolio.metrics.annualReturn)}</td>
                      <td className="p-2 border-r text-center">{formatPercentage(portfolio.metrics.volatility)}</td>
                      <td className="p-2 text-center">{portfolio.metrics.sharpeRatio.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}