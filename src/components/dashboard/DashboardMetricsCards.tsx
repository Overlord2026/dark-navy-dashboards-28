
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

interface DashboardMetricsCardsProps {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetGrowth: number;
  liabilityGrowth: number;
  netWorthGrowth: number;
  propertyCount: number;
  vehicleCount: number;
  onNavigateToProperties?: () => void;
  onNavigateToAssets?: () => void;
}

export const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({
  totalAssets,
  totalLiabilities,
  netWorth,
  assetGrowth,
  liabilityGrowth,
  netWorthGrowth,
  propertyCount,
  vehicleCount,
  onNavigateToProperties,
  onNavigateToAssets,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <Card className={cn(
        "transition-colors",
        isLightTheme 
          ? "bg-card border-border" 
          : "bg-[#1a2236] border-gray-800"
      )}>
        <CardContent className="p-5">
          <div className={cn(
            "text-base mb-2",
            isLightTheme ? "text-muted-foreground" : "text-gray-400"
          )}>Total Assets</div>
          <div className="text-2xl font-semibold">{formatCurrency(totalAssets)}</div>
          <div className={cn(
            "text-sm mt-2",
            isLightTheme ? "text-green-600" : "text-green-400"
          )}>+{formatCurrency(totalAssets * (assetGrowth / 100))} ({assetGrowth}%)</div>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "transition-colors",
        isLightTheme 
          ? "bg-card border-border" 
          : "bg-[#1a2236] border-gray-800"
      )}>
        <CardContent className="p-5">
          <div className={cn(
            "text-base mb-2",
            isLightTheme ? "text-muted-foreground" : "text-gray-400"
          )}>Total Liabilities</div>
          <div className="text-2xl font-semibold">{formatCurrency(totalLiabilities)}</div>
          <div className={cn(
            "text-sm mt-2",
            isLightTheme ? "text-red-600" : "text-red-400"
          )}>+{formatCurrency(totalLiabilities * (liabilityGrowth / 100))} ({liabilityGrowth}%)</div>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "relative transition-colors",
        isLightTheme 
          ? "bg-card border-border" 
          : "bg-[#1a2236] border-gray-800"
      )}>
        <CardContent className="p-5">
          <div className={cn(
            "text-base mb-2",
            isLightTheme ? "text-muted-foreground" : "text-gray-400"
          )}>Net Worth</div>
          <div className={cn(
            "text-2xl font-semibold",
            isLightTheme ? "text-blue-600" : "text-blue-400"
          )}>{formatCurrency(netWorth)}</div>
          <div className={cn(
            "text-sm mt-2",
            isLightTheme ? "text-green-600" : "text-green-400"
          )}>+{formatCurrency(netWorth * (netWorthGrowth / 100))} ({netWorthGrowth}%)</div>
          
          <div className="flex gap-2 absolute top-3 right-3">
            {propertyCount > 0 && (
              <button 
                className={cn(
                  "text-sm flex items-center px-2 py-1 rounded hover:bg-opacity-80",
                  isLightTheme 
                    ? "text-blue-600 hover:bg-blue-50" 
                    : "text-blue-400 hover:bg-blue-900/20"
                )}
                onClick={onNavigateToProperties}
              >
                <span className="mr-1">🏠</span>
                {propertyCount}
              </button>
            )}
            
            {vehicleCount > 0 && (
              <button 
                className={cn(
                  "text-sm flex items-center px-2 py-1 rounded hover:bg-opacity-80",
                  isLightTheme 
                    ? "text-green-600 hover:bg-green-50" 
                    : "text-green-400 hover:bg-green-900/20"
                )}
                onClick={onNavigateToAssets}
              >
                <span className="mr-1">🚗</span>
                {vehicleCount}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
