
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, PieChart } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { formatCurrency } from "@/lib/formatters";
import { ReportsGenerator } from "./ReportsGenerator";

export const FinancialOverview = () => {
  const { metrics, loading } = useRealTimeData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate diversification score based on asset allocation
  const calculateDiversificationScore = () => {
    if (metrics.totalAssets === 0) return 0;
    
    // For now, we'll use a simple calculation based on the number of assets
    // In a real implementation, this would be based on actual asset type distribution
    const baseScore = Math.min(100, (metrics.assetCount * 20));
    return Math.max(0, baseScore);
  };

  const diversificationScore = calculateDiversificationScore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalAssets)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.assetCount} asset{metrics.assetCount !== 1 ? 's' : ''} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.netWorth)}</div>
            <p className="text-xs text-muted-foreground">
              Assets minus liabilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.liabilityCount} liabilit{metrics.liabilityCount !== 1 ? 'ies' : 'y'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diversification</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diversificationScore.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Portfolio balance score
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportsGenerator />
    </div>
  );
};
