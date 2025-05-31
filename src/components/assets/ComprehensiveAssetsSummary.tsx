
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
}

export const ComprehensiveAssetsSummary: React.FC<ComprehensiveAssetsSummaryProps> = ({ 
  showTabs = true 
}) => {
  const { 
    getTotalNetWorth, 
    getTotalAssetsByType, 
    assets, 
    accounts, 
    totalAssetValue,
    totalLiabilityValue 
  } = useNetWorth();
  
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
    { name: "Real Estate", value: realEstateValue, percentage: realEstatePercentage, color: "#3b82f6" }, // blue-500
    { name: "Vehicles & Boats", value: vehiclesValue, percentage: vehiclesPercentage, color: "#22c55e" }, // green-500
    { name: "Investments", value: investmentsValue, percentage: investmentsPercentage, color: "#a855f7" }, // purple-500
    { name: "Cash", value: cashValue, percentage: cashPercentage, color: "#f59e0b" }, // amber-500
    { name: "Retirement", value: retirementValue, percentage: retirementPercentage, color: "#ec4899" }, // pink-500
    { name: "Collectibles & Art", value: collectiblesValue, percentage: collectiblesPercentage, color: "#6366f1" }, // indigo-500
    { name: "Digital Assets", value: digitalValue, percentage: digitalPercentage, color: "#06b6d4" }, // cyan-500
    { name: "Other", value: otherValue, percentage: otherPercentage, color: "#6b7280" }  // gray-500
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
              <p className="text-2xl font-bold">{formatCurrency(totalAssetValue - totalLiabilityValue)}</p>
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
          </div>
          
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
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Liabilities: {formatCurrency(totalLiabilityValue)}</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Mortgage</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(685000)}</span>
                  </div>
                </div>
                <Progress value={685000 / totalLiabilityValue * 100} className="h-2 bg-red-500/20" indicatorClassName="bg-red-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Auto Loans</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(48210)}</span>
                  </div>
                </div>
                <Progress value={48210 / totalLiabilityValue * 100} className="h-2 bg-orange-500/20" indicatorClassName="bg-orange-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Student Loans</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(72000)}</span>
                  </div>
                </div>
                <Progress value={72000 / totalLiabilityValue * 100} className="h-2 bg-pink-500/20" indicatorClassName="bg-pink-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Credit Cards</span>
                  <div className="text-right">
                    <span className="font-medium">{formatCurrency(40000)}</span>
                  </div>
                </div>
                <Progress value={40000 / totalLiabilityValue * 100} className="h-2 bg-cyan-500/20" indicatorClassName="bg-cyan-500" />
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Net Worth</span>
                <span className="font-bold text-xl">{formatCurrency(totalAssetValue - totalLiabilityValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!showTabs) {
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
