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
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useLiabilities } from "@/context/LiabilitiesContext";

interface ComprehensiveAssetsSummaryProps {
  showTabs?: boolean;
  hideInternalTabs?: boolean;
}

export const ComprehensiveAssetsSummary: React.FC<ComprehensiveAssetsSummaryProps> = ({ 
  showTabs = true,
  hideInternalTabs = false 
}) => {
  const { 
    accounts, 
    loading: contextLoading 
  } = useNetWorth();
  
  const { assets: supabaseAssets, loading: assetsLoading } = useSupabaseAssets();
  const { getTotalLiabilities, loading: liabilitiesLoading } = useLiabilities();
  
  const loading = contextLoading || assetsLoading || liabilitiesLoading;
  
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
  
  // Calculate totals using real Supabase data
  const totalAssetValue = supabaseAssets.reduce((total, asset) => total + Number(asset.value), 0);
  const totalLiabilityValue = getTotalLiabilities();
  const totalNetWorth = totalAssetValue - totalLiabilityValue;
  
  // Calculate asset values by type using Supabase data
  const getAssetValueByType = (type: string) => {
    return supabaseAssets
      .filter(asset => asset.type === type)
      .reduce((total, asset) => total + Number(asset.value), 0);
  };

  const realEstateValue = getAssetValueByType('property');
  const vehiclesValue = getAssetValueByType('vehicle') + getAssetValueByType('boat');
  const investmentsValue = getAssetValueByType('investment');
  const cashValue = getAssetValueByType('cash');
  const retirementValue = getAssetValueByType('retirement');
  const collectiblesValue = 
    getAssetValueByType('art') + 
    getAssetValueByType('antique') + 
    getAssetValueByType('jewelry') + 
    getAssetValueByType('collectible');
  const digitalValue = getAssetValueByType('digital');
  const otherValue = getAssetValueByType('other');
  
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
  
  // Financial overview stats using real data
  const propertyCount = supabaseAssets.filter(asset => asset.type === 'property').length;
  const vehicleCount = supabaseAssets.filter(asset => asset.type === 'vehicle' || asset.type === 'boat').length;
  const accountCount = accounts.length;
  
  // Prepare data for pie chart
  const pieChartData = assetCategories.map(category => ({
    name: category.name,
    value: category.value
  }));

  // Custom tooltip component with proper styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 z-50">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium text-foreground">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-foreground">{((data.value / totalAssetValue) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
              <p className="text-2xl font-bold">{supabaseAssets.length}</p>
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
            <div className="md:w-1/2 h-[350px] mt-6 md:mt-0 relative">
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
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const NetWorthContent = () => (
    <div className="space-y-6">
      {/* Net Worth Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Total Net Worth</h3>
            <p className={`text-4xl font-bold ${totalNetWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalNetWorth)}
            </p>
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalAssetValue)}</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-muted-foreground">Total Liabilities</p>
                <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalLiabilityValue)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-xl font-semibold mb-4 text-green-600">Assets Breakdown</h4>
            {assetCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assets to display</p>
                <p className="text-sm text-muted-foreground mt-2">Add some assets to see your breakdown</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assetCategories.map((category, index) => (
                  <div key={index} className="border-b border-border pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category.name}</span>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(category.value)}</div>
                        <div className="text-sm text-muted-foreground">{category.percentage}% of assets</div>
                      </div>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2" 
                      style={{backgroundColor: `${category.color}20`}}
                    />
                  </div>
                ))}
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Assets</span>
                    <span className="text-green-600">{formatCurrency(totalAssetValue)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liabilities Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-xl font-semibold mb-4 text-red-600">Liabilities Breakdown</h4>
            {totalLiabilityValue === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No liabilities to display</p>
                <p className="text-sm text-muted-foreground mt-2">You have no recorded liabilities</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-border pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Liabilities</span>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(totalLiabilityValue)}</div>
                      <div className="text-sm text-muted-foreground">100% of liabilities</div>
                    </div>
                  </div>
                  <Progress value={100} className="h-2 bg-red-500/20" />
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Liabilities</span>
                    <span className="text-red-600">{formatCurrency(totalLiabilityValue)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Calculation */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold mb-4">Net Worth Calculation</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span>Total Assets</span>
              <span className="font-semibold text-green-600">+ {formatCurrency(totalAssetValue)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span>Total Liabilities</span>
              <span className="font-semibold text-red-600">- {formatCurrency(totalLiabilityValue)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Net Worth</span>
                <span className={totalNetWorth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(totalNetWorth)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
