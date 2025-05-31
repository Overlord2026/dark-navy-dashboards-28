
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useSupabaseLiabilities } from "@/hooks/useSupabaseLiabilities";
import { formatCurrency } from "@/lib/formatters";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

export const NetWorthAnalysis: React.FC = () => {
  const { assets, loading: assetsLoading, getTotalValue } = useSupabaseAssets();
  const { liabilities, loading: liabilitiesLoading, getTotalLiabilities } = useSupabaseLiabilities();
  
  const loading = assetsLoading || liabilitiesLoading;
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading net worth data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAssets = getTotalValue();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = totalAssets - totalLiabilities;
  
  // Calculate asset breakdown by type
  const getAssetValueByType = (type: string) => {
    return assets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + Number(asset.value), 0);
  };

  const assetBreakdown = [
    { name: "Real Estate", value: getAssetValueByType('property'), color: "#3b82f6" },
    { name: "Vehicles & Boats", value: getAssetValueByType('vehicle') + getAssetValueByType('boat'), color: "#22c55e" },
    { name: "Investments", value: getAssetValueByType('investment'), color: "#a855f7" },
    { name: "Cash", value: getAssetValueByType('cash'), color: "#f59e0b" },
    { name: "Retirement", value: getAssetValueByType('retirement'), color: "#ec4899" },
    { name: "Art & Collectibles", value: getAssetValueByType('art') + getAssetValueByType('antique') + getAssetValueByType('jewelry') + getAssetValueByType('collectible'), color: "#6366f1" },
    { name: "Digital Assets", value: getAssetValueByType('digital'), color: "#06b6d4" },
    { name: "Other", value: getAssetValueByType('other'), color: "#6b7280" }
  ].filter(item => item.value > 0);

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</div>
            <p className="text-xs text-muted-foreground">
              {assets.length} asset{assets.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">
              {liabilities.length} liabilit{liabilities.length !== 1 ? 'ies' : 'y'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(netWorth)}
            </div>
            <p className="text-xs text-muted-foreground">
              Assets - Liabilities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Assets Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assetBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assets to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assetBreakdown.map((asset, index) => {
                  const percentage = calculatePercentage(asset.value, totalAssets);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">{formatCurrency(asset.value)}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2" 
                        style={{backgroundColor: `${asset.color}20`}}
                      />
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Assets</span>
                    <span className="text-green-600">{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liabilities Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Liabilities Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liabilities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No liabilities to display</p>
                <p className="text-sm text-muted-foreground mt-2">Great! You have no recorded liabilities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liabilities.map((liability) => {
                  const percentage = calculatePercentage(Number(liability.amount), totalLiabilities);
                  return (
                    <div key={liability.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{liability.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">{formatCurrency(Number(liability.amount))}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-red-500/20" 
                      />
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Liabilities</span>
                    <span className="text-red-600">{formatCurrency(totalLiabilities)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-lg font-medium">Total Assets</span>
              <span className="text-xl font-bold text-green-600">+ {formatCurrency(totalAssets)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-lg font-medium">Total Liabilities</span>
              <span className="text-xl font-bold text-red-600">- {formatCurrency(totalLiabilities)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <span className="text-xl font-bold">Net Worth</span>
              <span className={`text-2xl font-bold ${netWorth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(netWorth)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
