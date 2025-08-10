import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, PieChart, AlertTriangle } from 'lucide-react';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';

interface BenchmarkData {
  total_revenue: number;
  total_expenses: number;
  gross_margin: number;
  gross_margin_pct: number;
}

interface MarketingROIData {
  marketing_spend: number;
  marketing_revenue: number;
  roi_percentage: number;
  roas: number;
}

export function AICFODashboard() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData | null>(null);
  const [marketingROI, setMarketingROI] = useState<MarketingROIData | null>(null);
  
  const { 
    invoke: invokeBenchmarks, 
    loading: benchmarksLoading 
  } = useEdgeFunction('calculate-benchmarks');
  
  const { 
    invoke: invokeMarketingROI, 
    loading: marketingLoading 
  } = useEdgeFunction('calculate-marketing-roi');

  useEffect(() => {
    const loadData = async () => {
      try {
        const benchmarkResult = await invokeBenchmarks();
        if (benchmarkResult.success && benchmarkResult.data?.benchmarks) {
          setBenchmarks(benchmarkResult.data.benchmarks);
        }

        const roiResult = await invokeMarketingROI();
        if (roiResult.success && roiResult.data) {
          setMarketingROI(roiResult.data);
        }
      } catch (error) {
        console.error('Error loading CFO data:', error);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI CFO Dashboard</h1>
          <p className="text-muted-foreground">
            Financial intelligence and performance insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {benchmarksLoading ? '...' : formatCurrency(benchmarks?.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Gross Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {benchmarksLoading ? '...' : formatPercentage(benchmarks?.gross_margin_pct || 0)}
            </div>
            <p className="text-xs text-muted-foreground">vs industry avg</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <PieChart className="h-4 w-4 text-purple-500" />
              Marketing ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {marketingLoading ? '...' : formatPercentage(marketingROI?.roi_percentage || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Return on ad spend</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {benchmarksLoading ? '...' : formatCurrency(benchmarks?.total_expenses || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(benchmarks?.total_revenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(benchmarks?.total_expenses || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium text-foreground">Net Profit</span>
                <span className="font-bold text-emerald-500">
                  {formatCurrency((benchmarks?.total_revenue || 0) - (benchmarks?.total_expenses || 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Marketing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ad Spend</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(marketingROI?.marketing_spend || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Marketing Revenue</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(marketingROI?.marketing_revenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROAS</span>
                <span className="font-medium text-foreground">
                  {(marketingROI?.roas || 0).toFixed(2)}x
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}