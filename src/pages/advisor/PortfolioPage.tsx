import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Plus, DollarSign } from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  allocation: number;
  change: number;
  changePercent: number;
}

interface Portfolio {
  id: string;
  clientName: string;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export default function AdvisorPortfolioPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'allocation'>('overview');

  const mockPortfolio: Portfolio = {
    id: '1',
    clientName: 'Johnson Family Portfolio',
    totalValue: 1250000,
    dayChange: 15420,
    dayChangePercent: 1.24,
    allocation: {
      stocks: 65,
      bonds: 25,
      cash: 5,
      alternatives: 5
    }
  };

  const mockHoldings: Holding[] = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 500,
      price: 175.50,
      value: 87750,
      allocation: 7.02,
      change: 2.25,
      changePercent: 1.30
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 200,
      price: 410.80,
      value: 82160,
      allocation: 6.57,
      change: -1.15,
      changePercent: -0.28
    },
    {
      id: '3',
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      shares: 300,
      price: 521.25,
      value: 156375,
      allocation: 12.51,
      change: 4.10,
      changePercent: 0.79
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Management</h1>
            <p className="text-muted-foreground">Monitor and manage client portfolios</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mockPortfolio.clientName}
              <Badge variant="outline">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(mockPortfolio.totalValue)}</div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
              </div>
              <div>
                <div className={`text-2xl font-bold flex items-center ${getChangeColor(mockPortfolio.dayChange)}`}>
                  {getChangeIcon(mockPortfolio.dayChange)}
                  {mockPortfolio.dayChange > 0 ? '+' : ''}{formatCurrency(mockPortfolio.dayChange)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {mockPortfolio.dayChangePercent > 0 ? '+' : ''}{mockPortfolio.dayChangePercent}% Today
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Total Holdings</p>
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-sm text-muted-foreground">Asset Allocation Target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {['overview', 'holdings', 'allocation'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stocks</span>
                      <span>{mockPortfolio.allocation.stocks}%</span>
                    </div>
                    <Progress value={mockPortfolio.allocation.stocks} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bonds</span>
                      <span>{mockPortfolio.allocation.bonds}%</span>
                    </div>
                    <Progress value={mockPortfolio.allocation.bonds} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cash</span>
                      <span>{mockPortfolio.allocation.cash}%</span>
                    </div>
                    <Progress value={mockPortfolio.allocation.cash} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Alternatives</span>
                      <span>{mockPortfolio.allocation.alternatives}%</span>
                    </div>
                    <Progress value={mockPortfolio.allocation.alternatives} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>YTD Return</span>
                    <span className="text-green-600 font-medium">+8.42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 Year Return</span>
                    <span className="text-green-600 font-medium">+12.15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Benchmark (S&P 500)</span>
                    <span className="text-muted-foreground">+9.73%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alpha</span>
                    <span className="text-green-600 font-medium">+2.42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio</span>
                    <span className="font-medium">1.24</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'holdings' && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHoldings.map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-sm text-muted-foreground">{holding.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-medium">{holding.shares} shares</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(holding.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(holding.value)}</div>
                        <div className="text-sm text-muted-foreground">{holding.allocation}% allocation</div>
                      </div>
                      <div className={`text-right ${getChangeColor(holding.change)}`}>
                        <div className="flex items-center font-medium">
                          {getChangeIcon(holding.change)}
                          {holding.change > 0 ? '+' : ''}{formatCurrency(holding.change)}
                        </div>
                        <div className="text-sm">
                          {holding.changePercent > 0 ? '+' : ''}{holding.changePercent}%
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'allocation' && (
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Detailed Allocation View</h3>
                <p className="text-muted-foreground">
                  Interactive allocation charts and rebalancing tools coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}