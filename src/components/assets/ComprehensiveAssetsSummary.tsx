
import React from "react";
import { useNetWorth } from "@/context/NetWorthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface ComprehensiveAssetsSummaryProps {
  showTabs?: boolean;
  hideInternalTabs?: boolean;
}

export const ComprehensiveAssetsSummary: React.FC<ComprehensiveAssetsSummaryProps> = ({ 
  showTabs = true,
  hideInternalTabs = false 
}) => {
  const { 
    getTotalNetWorth, 
    getTotalAssetsByType, 
    assets, 
    accounts, 
    totalAssetValue,
    totalLiabilityValue,
    loading 
  } = useNetWorth();
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading asset data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
    return totalAssetValue > 0 ? Math.round((value / totalAssetValue) * 100) : 0;
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
    { name: "Real Estate", value: realEstateValue, percentage: realEstatePercentage, color: "#3b82f6" },
    { name: "Vehicles & Boats", value: vehiclesValue, percentage: vehiclesPercentage, color: "#22c55e" },
    { name: "Investments", value: investmentsValue, percentage: investmentsPercentage, color: "#a855f7" },
    { name: "Cash", value: cashValue, percentage: cashPercentage, color: "#f59e0b" },
    { name: "Retirement", value: retirementValue, percentage: retirementPercentage, color: "#ec4899" },
    { name: "Collectibles & Art", value: collectiblesValue, percentage: collectiblesPercentage, color: "#6366f1" },
    { name: "Digital Assets", value: digitalValue, percentage: digitalPercentage, color: "#06b6d4" },
    { name: "Other", value: otherValue, percentage: otherPercentage, color: "#6b7280" }
  ].filter(category => category.value > 0);
  
  // Financial overview stats
  const propertyCount = assets.filter(asset => asset.type === 'property').length;
  const vehicleCount = assets.filter(asset => asset.type === 'vehicle' || asset.type === 'boat').length;
  const accountCount = accounts.length;
  
  // Prepare data for pie chart
  const pieChartData = assetCategories.map(category => ({
    name: category.name,
    value: category.value
  }));

  const SummaryContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Asset Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAssetValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Asset Count</p>
              <p className="text-2xl font-bold">{assets.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="text-xl font-medium">{propertyCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicles</p>
              <p className="text-xl font-medium">{vehicleCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Financial Accounts</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Count</p>
              <p className="text-2xl font-bold">{accountCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(cashValue + investmentsValue + retirementValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cash Accounts</p>
              <p className="text-xl font-medium">{accounts.filter(a => a.type === 'banking').length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Investment</p>
              <p className="text-xl font-medium">{accounts.filter(a => a.type === 'investment' || a.type === 'managed').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Net Worth</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Net Worth</p>
              <p className="text-2xl font-bold">{formatCurrency(totalNetWorth)}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Assets</p>
                <p className="text-xl font-medium text-green-500">{formatCurrency(totalAssetValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Liabilities</p>
                <p className="text-xl font-medium text-red-500">{formatCurrency(totalLiabilityValue)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AllocationContent = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            {assetCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assets to display</p>
                <p className="text-sm text-muted-foreground mt-2">Add some assets to see your allocation</p>
              </div>
            ) : (
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
                      className={`h-2`} 
                      style={{backgroundColor: `${category.color}20`}}
                      indicatorClassName={`bg-${category.color}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {assetCategories.length > 0 && (
            <div className="md:w-1/2 h-[350px] mt-6 md:mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={1}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={assetCategories[index].color}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const NetWorthContent = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Net Worth Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-medium mb-3">Assets: {formatCurrency(totalAssetValue)}</h4>
            {assetCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assets to display</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {assetCategories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span>{category.name}</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(category.value)}</span>
                      </div>
                    </div>
                    <Progress 
                      value={category.value / totalAssetValue * 100} 
                      className={`h-2`}
                      style={{backgroundColor: `${category.color}20`}}
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Liabilities: {formatCurrency(totalLiabilityValue)}</h4>
            {totalLiabilityValue === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No liabilities to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Total Liabilities</span>
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(totalLiabilityValue)}</span>
                    </div>
                  </div>
                  <Progress value={100} className="h-2 bg-red-500/20" indicatorClassName="bg-red-500" />
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Net Worth</span>
                <span className="font-bold text-xl">{formatCurrency(totalNetWorth)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!showTabs || hideInternalTabs) {
    return (
      <div className="space-y-6">
        <AllocationContent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="summary">Asset Summary</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <SummaryContent />
        </TabsContent>
        
        <TabsContent value="allocation" className="pt-4">
          <AllocationContent />
        </TabsContent>
        
        <TabsContent value="networth" className="pt-4">
          <NetWorthContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
