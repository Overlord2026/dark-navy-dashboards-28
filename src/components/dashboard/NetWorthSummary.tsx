
import React from "react";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardMetricsCards } from "./DashboardMetricsCards";
import { AssetAllocationChart } from "./AssetAllocationChart";
import { PropertySection } from "./PropertySection";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Separator } from "@/components/ui/separator";

export const NetWorthSummary = () => {
  console.log('NetWorthSummary rendering with real-time data');
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const navigate = useNavigate();
  
  const { metrics, assetBreakdown, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="dashboard-card animate-fade-in min-h-[640px]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card animate-fade-in min-h-[640px]">
      <div className="space-y-8">
        {/* Net Worth Metrics Section */}
        <div>
          <DashboardMetricsCards
            totalAssets={metrics.totalAssets}
            totalLiabilities={metrics.totalLiabilities}
            netWorth={metrics.netWorth}
            assetGrowth={metrics.assetGrowth}
            liabilityGrowth={metrics.liabilityGrowth}
            netWorthGrowth={metrics.netWorthGrowth}
            propertyCount={metrics.propertyCount}
            vehicleCount={metrics.vehicleCount}
            onNavigateToProperties={() => navigate('/properties')}
            onNavigateToAssets={() => navigate('/client-all-assets')}
          />
        </div>
        
        {/* Asset Allocation Chart */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <AssetAllocationChart
              realEstate={assetBreakdown.realEstate}
              vehicles={assetBreakdown.vehicles}
              investments={assetBreakdown.investments}
              cash={assetBreakdown.cash}
              retirement={assetBreakdown.retirement}
              collectibles={assetBreakdown.collectibles}
              digital={assetBreakdown.digital}
              other={assetBreakdown.other}
              totalValue={metrics.totalAssets}
            />
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8" />
        
        {/* Properties Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Properties Overview</h3>
          <div className="bg-muted/30 p-6 rounded-lg">
            <PropertySection />
          </div>
        </div>
      </div>
    </div>
  );
};
