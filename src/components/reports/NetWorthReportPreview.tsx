
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useNetWorthReport } from "@/hooks/useNetWorthReport";
import { Badge } from "@/components/ui/badge";

interface NetWorthReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

export const NetWorthReportPreview: React.FC<NetWorthReportPreviewProps> = ({ formatCurrency }) => {
  const { 
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    getTotalAssetsByType
  } = useNetWorthReport();
  
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = getNetWorth();
  
  const propertyValue = getTotalAssetsByType('property');
  const investmentsValue = getTotalAssetsByType('investment');
  const cashValue = getTotalAssetsByType('cash');
  const retirementValue = getTotalAssetsByType('retirement');
  const vehicleValue = getTotalAssetsByType('vehicle');
  const otherValue = getTotalAssetsByType('other');
  
  const hasAssetData = totalAssets > 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Total Assets</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Liabilities</div>
          <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-md">
          <div className="text-sm text-purple-700 dark:text-purple-400">Net Worth</div>
          <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Asset Allocation</h4>
        
        {!hasAssetData ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">
              Add assets and liabilities to see your net worth breakdown
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {propertyValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Real Estate</span>
                  <span>{formatCurrency(propertyValue)}</span>
                </div>
                <Progress value={(propertyValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
            
            {investmentsValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Investments</span>
                  <span>{formatCurrency(investmentsValue)}</span>
                </div>
                <Progress value={(investmentsValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
            
            {cashValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Cash & Equivalents</span>
                  <span>{formatCurrency(cashValue)}</span>
                </div>
                <Progress value={(cashValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
            
            {retirementValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Retirement Accounts</span>
                  <span>{formatCurrency(retirementValue)}</span>
                </div>
                <Progress value={(retirementValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
            
            {vehicleValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Vehicles</span>
                  <span>{formatCurrency(vehicleValue)}</span>
                </div>
                <Progress value={(vehicleValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
            
            {otherValue > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Other Assets</span>
                  <span>{formatCurrency(otherValue)}</span>
                </div>
                <Progress value={(otherValue / totalAssets) * 100} className="h-2" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
