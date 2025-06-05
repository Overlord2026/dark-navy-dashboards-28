
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardMetricsCards } from "./DashboardMetricsCards";
import { AssetAllocationChart } from "./AssetAllocationChart";
import { DashboardCard } from "@/components/ui/DashboardCard";

export const NetWorthSummary = () => {
  console.log('NetWorthSummary rendering with real-time data');
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const navigate = useNavigate();
  
  const { metrics, assetBreakdown, loading } = useDashboardData();

  if (loading) {
    return (
      <DashboardCard 
        title="Dashboard" 
        icon={<Wallet className="h-5 w-5" />}
        className="min-h-[640px]"
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading dashboard data...</span>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Dashboard" 
      icon={<Wallet className={cn(
        "h-5 w-5",
        isLightTheme ? "text-blue-600" : "text-blue-400"
      )} />}
      className="min-h-[640px]"
      footer={
        <div className={cn(
          "pt-5 border-t flex justify-end",
          isLightTheme ? "border-border" : "border-gray-800"
        )}>
          <Button 
            variant="link" 
            className={cn(
              "text-base p-0",
              isLightTheme ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"
            )}
            onClick={() => navigate('/client-all-assets')}
          >
            View All Assets →
          </Button>
        </div>
      }
    >
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
    </DashboardCard>
  );
};
