
import React from "react";
import { useNetWorth } from "@/context/NetWorthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";

export const AssetsSummary: React.FC = () => {
  const { getTotalNetWorth, getTotalAssetsByType } = useNetWorth();
  
  const totalNetWorth = getTotalNetWorth();
  const realEstateValue = getTotalAssetsByType('property');
  const vehiclesValue = getTotalAssetsByType('vehicle') + getTotalAssetsByType('boat');
  const investmentsValue = getTotalAssetsByType('investment');
  const cashValue = getTotalAssetsByType('cash');
  const retirementValue = getTotalAssetsByType('retirement');
  const collectiblesValue = 
    getTotalAssetsByType('art') + 
    getTotalAssetsByType('antique') + 
    getTotalAssetsByType('jewelry') + 
    getTotalAssetsByType('collectible');
  const digitalValue = getTotalAssetsByType('digital');
  const otherValue = getTotalAssetsByType('other');
  
  // Calculate percentages
  const calculatePercentage = (value: number) => {
    return totalNetWorth > 0 ? Math.round((value / totalNetWorth) * 100) : 0;
  };
  
  const realEstatePercentage = calculatePercentage(realEstateValue);
  const vehiclesPercentage = calculatePercentage(vehiclesValue);
  const investmentsPercentage = calculatePercentage(investmentsValue);
  const cashPercentage = calculatePercentage(cashValue);
  const retirementPercentage = calculatePercentage(retirementValue);
  const collectiblesPercentage = calculatePercentage(collectiblesValue);
  const digitalPercentage = calculatePercentage(digitalValue);
  const otherPercentage = calculatePercentage(otherValue);
  
  const assetCategories = [
    { name: "Real Estate", value: realEstateValue, percentage: realEstatePercentage, color: "bg-blue-500" },
    { name: "Vehicles & Boats", value: vehiclesValue, percentage: vehiclesPercentage, color: "bg-green-500" },
    { name: "Investments", value: investmentsValue, percentage: investmentsPercentage, color: "bg-purple-500" },
    { name: "Cash", value: cashValue, percentage: cashPercentage, color: "bg-amber-500" },
    { name: "Retirement", value: retirementValue, percentage: retirementPercentage, color: "bg-pink-500" },
    { name: "Collectibles & Art", value: collectiblesValue, percentage: collectiblesPercentage, color: "bg-indigo-500" },
    { name: "Digital Assets", value: digitalValue, percentage: digitalPercentage, color: "bg-cyan-500" },
    { name: "Other", value: otherValue, percentage: otherPercentage, color: "bg-gray-500" }
  ].filter(category => category.value > 0);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-1">Assets Overview</h2>
          <p className="text-muted-foreground">Total value: {formatCurrency(totalNetWorth)}</p>
        </div>
        
        <div className="space-y-4">
          {assetCategories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{category.name}</span>
                <div className="text-right">
                  <span className="font-medium">{formatCurrency(category.value)}</span>
                  <span className="text-muted-foreground ml-2">({category.percentage}%)</span>
                </div>
              </div>
              <Progress 
                value={category.percentage} 
                className={`h-2 ${category.color}/20`} 
                indicatorClassName={category.color} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
