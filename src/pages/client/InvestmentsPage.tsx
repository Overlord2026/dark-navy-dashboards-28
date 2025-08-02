import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity } from 'lucide-react';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  change: number;
  changePercent: number;
  value: number;
  allocation: number;
}

const mockHoldings: Holding[] = [
  {
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    shares: 150,
    price: 245.30,
    change: 2.15,
    changePercent: 0.88,
    value: 36795,
    allocation: 35
  },
  {
    symbol: 'VTIAX',
    name: 'Vanguard Total International Stock',
    shares: 200,
    price: 125.60,
    change: -0.75,
    changePercent: -0.59,
    value: 25120,
    allocation: 25
  },
  {
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    shares: 300,
    price: 82.45,
    change: 0.12,
    changePercent: 0.15,
    value: 24735,
    allocation: 25
  },
  {
    symbol: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    shares: 100,
    price: 98.75,
    change: 1.25,
    changePercent: 1.28,
    value: 9875,
    allocation: 10
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    shares: 25,
    price: 185.20,
    change: -1.80,
    changePercent: -0.96,
    value: 4630,
    allocation: 5
  }
];

export default function InvestmentsPage() {
  const [selectedView, setSelectedView] = useState<'holdings' | 'performance' | 'allocation'>('holdings');

  const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.value, 0);
  const totalGainLoss = mockHoldings.reduce((sum, holding) => sum + (holding.change * holding.shares), 0);
  const totalGainLossPercent = (totalGainLoss / totalValue) * 100;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight">
              INVESTMENT PORTFOLIO
            </h1>
            <p className="text-text-secondary text-lg">
              Monitor your investment performance and portfolio allocation
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Total Value</p>
                    <p className="text-2xl font-bold text-white">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Today's Change</p>
                    <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                    </p>
                  </div>
                  {totalGainLoss >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">% Change</p>
                    <p className={`text-2xl font-bold ${totalGainLossPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-accent-aqua" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Holdings</p>
                    <p className="text-2xl font-bold text-white">{mockHoldings.length}</p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Toggle */}
          <Card className="mb-6 bg-surface border-border-primary">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button 
                  variant={selectedView === 'holdings' ? 'default' : 'outline'}
                  onClick={() => setSelectedView('holdings')}
                  className={selectedView === 'holdings' ? 'bg-accent-gold text-primary' : 'border-accent-gold text-accent-gold'}
                >
                  Holdings
                </Button>
                <Button 
                  variant={selectedView === 'allocation' ? 'default' : 'outline'}
                  onClick={() => setSelectedView('allocation')}
                  className={selectedView === 'allocation' ? 'bg-accent-aqua text-primary' : 'border-accent-aqua text-accent-aqua'}
                >
                  Allocation
                </Button>
                <Button 
                  variant={selectedView === 'performance' ? 'default' : 'outline'}
                  onClick={() => setSelectedView('performance')}
                  className={selectedView === 'performance' ? 'bg-emerald-500 text-primary' : 'border-emerald-500 text-emerald-500'}
                >
                  Performance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Holdings View */}
          {selectedView === 'holdings' && (
            <Card className="bg-surface border-border-primary">
              <CardHeader>
                <CardTitle className="text-white font-display">Investment Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHoldings.map((holding) => (
                    <div key={holding.symbol} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border-primary">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">{holding.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{holding.symbol}</h3>
                            <p className="text-text-secondary text-sm">{holding.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-white font-bold">${holding.price.toFixed(2)}</p>
                            <p className="text-text-secondary text-sm">{holding.shares} shares</p>
                          </div>
                          <div>
                            <p className="text-white font-bold">${holding.value.toLocaleString()}</p>
                            <div className="flex items-center gap-1">
                              <Badge className={`${holding.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                                {holding.change >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allocation View */}
          {selectedView === 'allocation' && (
            <Card className="bg-surface border-border-primary">
              <CardHeader>
                <CardTitle className="text-white font-display">Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockHoldings.map((holding, index) => (
                    <div key={holding.symbol} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{holding.symbol}</span>
                        <span className="text-accent-gold font-bold">{holding.allocation}%</span>
                      </div>
                      <Progress 
                        value={holding.allocation} 
                        className="h-3"
                        style={{
                          background: 'var(--card)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance View */}
          {selectedView === 'performance' && (
            <Card className="bg-surface border-border-primary">
              <CardHeader>
                <CardTitle className="text-white font-display">Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-text-secondary mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Detailed Analytics Coming Soon</h3>
                  <p className="text-text-secondary">
                    Historical performance charts and analysis tools will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}