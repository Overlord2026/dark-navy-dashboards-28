
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, PieChart } from "lucide-react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useSupabaseLiabilities } from "@/hooks/useSupabaseLiabilities";
import { formatCurrency } from "@/lib/formatters";
import { ReportsGenerator } from "./ReportsGenerator";

export const FinancialOverview = () => {
  const { assets, getTotalValue, loading: assetsLoading } = useSupabaseAssets();
  const { getTotalLiabilities, loading: liabilitiesLoading } = useSupabaseLiabilities();

  const loading = assetsLoading || liabilitiesLoading;
  
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

  const totalAssets = getTotalValue();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = totalAssets - totalLiabilities;
  
  // Calculate asset allocation
  const getAssetValueByType = (type: string) => {
    return assets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + Number(asset.value), 0);
  };

  const realEstateValue = getAssetValueByType('property');
  const investmentValue = getAssetValueByType('investment');
  const cashValue = getAssetValueByType('cash');
  const retirementValue = getAssetValueByType('retirement');
  
  // Calculate diversification score based on asset allocation
  const calculateDiversificationScore = () => {
    if (totalAssets === 0) return 0;
    
    const allocations = [
      realEstateValue / totalAssets,
      investmentValue / totalAssets,
      cashValue / totalAssets,
      retirementValue / totalAssets
    ].filter(allocation => allocation > 0);
    
    // Simple diversification score: more balanced = higher score
    const variance = allocations.reduce((sum, allocation) => {
      const diff = allocation - (1 / allocations.length);
      return sum + diff * diff;
    }, 0);
    
    return Math.max(0, Math.min(100, 100 - (variance * 1000)));
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
            <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
            <p className="text-xs text-muted-foreground">
              {assets.length} asset{assets.length !== 1 ? 's' : ''} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
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
            <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding debts
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
