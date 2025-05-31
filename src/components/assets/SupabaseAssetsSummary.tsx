
import React from "react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { 
  BarChart3, 
  Package
} from "lucide-react";

export const SupabaseAssetsSummary: React.FC = () => {
  const { assets, getTotalValue, getAssetsByType, loading } = useSupabaseAssets();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading summary...</p>
        </CardContent>
      </Card>
    );
  }

  const totalValue = getTotalValue();
  const assetCount = assets.length;
  const propertyCount = getAssetsByType('property').length;
  const vehicleCount = getAssetsByType('vehicle').length + getAssetsByType('boat').length;
  
  // Sample liabilities value - you can replace this with actual data source
  const totalLiabilities = 150000;
  const netWorth = totalValue - totalLiabilities;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Asset Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Asset Overview</CardTitle>
          <BarChart3 className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Asset Count</p>
              <p className="text-xl font-bold">{assetCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="text-xl font-bold">{propertyCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicles</p>
              <p className="text-xl font-bold">{vehicleCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Worth Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Net Worth</CardTitle>
          <Package className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Net Worth</p>
            <p className="text-2xl font-bold">{formatCurrency(netWorth)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Assets</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liabilities</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(totalLiabilities)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
