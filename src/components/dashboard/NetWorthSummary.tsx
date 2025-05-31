import React from "react";
import { Progress } from "@/components/ui/progress";
import { Wallet, Maximize2, Home, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetWorth } from "@/context/NetWorthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/lib/formatters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

export const NetWorthSummary = () => {
  console.log('NetWorthSummary rendering');
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  try {
    const { assets, getTotalNetWorth, getTotalAssetsByType, getAssetsByOwner } = useNetWorth();
    console.log('NetWorthSummary: useNetWorth hook loaded successfully', assets.length);
    const { userProfile } = useUser();
    const navigate = useNavigate();
    
    // Calculate asset allocation percentages
    const totalNetWorth = getTotalNetWorth();
    const realEstateValue = getTotalAssetsByType('property');
    const realEstatePercentage = totalNetWorth > 0 ? Math.round((realEstateValue / totalNetWorth) * 100) : 0;
    
    const retirementValue = getTotalAssetsByType('retirement');
    const retirementPercentage = totalNetWorth > 0 ? Math.round((retirementValue / totalNetWorth) * 100) : 0;
    
    const investmentsValue = getTotalAssetsByType('investment');
    const investmentsPercentage = totalNetWorth > 0 ? Math.round((investmentsValue / totalNetWorth) * 100) : 0;
    
    const cashValue = getTotalAssetsByType('cash');
    const cashPercentage = totalNetWorth > 0 ? Math.round((cashValue / totalNetWorth) * 100) : 0;
    
    // New asset categories
    const vehiclesValue = getTotalAssetsByType('vehicle') + getTotalAssetsByType('boat');
    const vehiclesPercentage = totalNetWorth > 0 ? Math.round((vehiclesValue / totalNetWorth) * 100) : 0;
    
    // Get property count
    const propertyCount = assets.filter(asset => asset.type === 'property').length;
    const vehicleCount = assets.filter(asset => asset.type === 'vehicle' || asset.type === 'boat').length;
    
    // Prepare data for pie chart
    const pieChartData = [
      realEstateValue > 0 && { name: "Real Estate", value: realEstateValue, percentage: realEstatePercentage, color: "#3b82f6" },
      vehiclesValue > 0 && { name: "Vehicles & Boats", value: vehiclesValue, percentage: vehiclesPercentage, color: "#22c55e" },
      retirementValue > 0 && { name: "Retirement Accounts", value: retirementValue, percentage: retirementPercentage, color: "#a855f7" },
      investmentsValue > 0 && { name: "Investments", value: investmentsValue, percentage: investmentsPercentage, color: "#6366f1" },
      cashValue > 0 && { name: "Cash & Equivalents", value: cashValue, percentage: cashPercentage, color: "#f59e0b" }
    ].filter(Boolean);

    return (
      <div className={cn(
        "rounded-lg p-6 border transition-all duration-300 min-h-[640px]",
        isLightTheme 
          ? "bg-card border-border text-foreground" 
          : "bg-[#121a2c]/80 border-gray-800"
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <Wallet className={cn(
              "mr-3 h-7 w-7",
              isLightTheme ? "text-blue-600" : "text-blue-400"
            )} />
            Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate('all-assets')}
            >
              <Maximize2 className="h-5 w-5" />
              <span className="sr-only">View All Assets</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className={cn(
            "p-5 rounded-lg border transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-base mb-2",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Total Assets</div>
            <div className="text-2xl font-semibold">{formatCurrency(totalNetWorth)}</div>
            <div className={cn(
              "text-sm mt-2",
              isLightTheme ? "text-green-600" : "text-green-400"
            )}>+$124,500 (5.3%)</div>
          </div>
          
          <div className={cn(
            "p-5 rounded-lg border transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-base mb-2",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Total Liabilities</div>
            <div className="text-2xl font-semibold">{formatCurrency(845210)}</div>
            <div className={cn(
              "text-sm mt-2",
              isLightTheme ? "text-red-600" : "text-red-400"
            )}>+$12,300 (1.5%)</div>
          </div>
          
          <div className={cn(
            "p-5 rounded-lg border relative transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-base mb-2",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Net Worth</div>
            <div className={cn(
              "text-2xl font-semibold",
              isLightTheme ? "text-blue-600" : "text-blue-400"
            )}>{formatCurrency(totalNetWorth - 845210)}</div>
            <div className={cn(
              "text-sm mt-2",
              isLightTheme ? "text-green-600" : "text-green-400"
            )}>+$112,200 (7.5%)</div>
            
            <div className="flex gap-2 absolute top-3 right-3">
              {propertyCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-sm flex items-center px-2",
                    isLightTheme 
                      ? "text-blue-600 hover:text-blue-700" 
                      : "text-blue-400 hover:text-blue-300"
                  )}
                  onClick={() => navigate('properties')}
                >
                  <Home className="h-4 w-4 mr-1" />
                  {propertyCount}
                </Button>
              )}
              
              {vehicleCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-sm flex items-center px-2",
                    isLightTheme 
                      ? "text-green-600 hover:text-green-700" 
                      : "text-green-400 hover:text-green-300"
                  )}
                  onClick={() => navigate('all-assets')}
                >
                  <Car className="h-4 w-4 mr-1" />
                  {vehicleCount}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-5">Asset Allocation</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Pie Chart */}
              <div className="md:w-1/2 h-[320px] flex items-center justify-center">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={64}
                        outerRadius={112}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{
                          backgroundColor: isLightTheme ? 'hsl(var(--card))' : '#1a2236',
                          border: isLightTheme ? '1px solid hsl(var(--border))' : '1px solid #374151',
                          borderRadius: '6px',
                          color: isLightTheme ? 'hsl(var(--foreground))' : '#e5e7eb'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={cn(
                    "text-center",
                    isLightTheme ? "text-muted-foreground" : "text-gray-400"
                  )}>No asset data available</div>
                )}
              </div>
              
              {/* Asset List */}
              <div className="md:w-1/2 space-y-3">
                {pieChartData.map((asset, index) => (
                  <AssetItem 
                    key={index}
                    label={asset.name} 
                    value={formatCurrency(asset.value)} 
                    percentage={asset.percentage} 
                    color={asset.color}
                    isLightTheme={isLightTheme}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "mt-6 pt-5 border-t flex justify-end",
          isLightTheme ? "border-border" : "border-gray-800"
        )}>
          <Button 
            variant="link" 
            className={cn(
              "text-base p-0",
              isLightTheme ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"
            )}
            onClick={() => navigate('all-assets')}
          >
            View All Assets →
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in NetWorthSummary:', error);
    return (
      <div className={cn(
        "rounded-lg p-6 border",
        isLightTheme 
          ? "bg-card border-border" 
          : "bg-[#121a2c]/80 border-gray-800"
      )}>
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <div className={cn(
          "p-6 text-center",
          isLightTheme ? "text-red-600" : "text-red-400"
        )}>
          Unable to load net worth data. Please reload the page.
        </div>
      </div>
    );
  }
};

interface AssetItemProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
  isLightTheme?: boolean;
}

const AssetItem = ({ label, value, percentage, color, isLightTheme }: AssetItemProps) => {
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-3" 
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <span className="text-base font-medium">{value}</span>
      </div>
      <div className="flex items-center">
        <Progress 
          value={percentage} 
          className="h-2" 
          style={{backgroundColor: `${color}20`}} 
        />
        <span className="ml-3 text-sm">{percentage}%</span>
      </div>
    </div>
  );
};
