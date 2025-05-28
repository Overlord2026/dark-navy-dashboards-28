
import React from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Wallet, Maximize2, Home, User, Car } from "lucide-react";
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
  try {
    const { assets, getTotalNetWorth, getTotalAssetsByType, getAssetsByOwner } = useNetWorth();
    console.log('NetWorthSummary: useNetWorth hook loaded successfully', assets.length);
    const { userProfile } = useUser();
    const { theme } = useTheme();
    const navigate = useNavigate();
    
    const isLightTheme = theme === "light";
    
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
        "rounded-lg p-4 border transition-all duration-300",
        isLightTheme 
          ? "bg-card border-border text-foreground" 
          : "bg-[#121a2c]/80 border-gray-800"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Wallet className={cn(
              "mr-2 h-5 w-5",
              isLightTheme ? "text-blue-600" : "text-blue-400"
            )} />
            Net Worth Summary
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => navigate('all-assets')}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">View All Assets</span>
            </Button>
            <span className={cn(
              "flex items-center text-sm",
              isLightTheme ? "text-green-600" : "text-green-400"
            )}>
              <ArrowUpRight className="mr-1 h-4 w-4" />
              +5.2%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={cn(
            "p-3 rounded-lg border transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-sm mb-1",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Total Assets</div>
            <div className="text-xl font-semibold">{formatCurrency(totalNetWorth)}</div>
            <div className={cn(
              "text-xs",
              isLightTheme ? "text-green-600" : "text-green-400"
            )}>+$124,500 (5.3%)</div>
          </div>
          
          <div className={cn(
            "p-3 rounded-lg border transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-sm mb-1",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Total Liabilities</div>
            <div className="text-xl font-semibold">{formatCurrency(845210)}</div>
            <div className={cn(
              "text-xs",
              isLightTheme ? "text-red-600" : "text-red-400"
            )}>+$12,300 (1.5%)</div>
          </div>
          
          <div className={cn(
            "p-3 rounded-lg border relative transition-colors",
            isLightTheme 
              ? "bg-card border-border" 
              : "bg-[#1a2236] border-gray-800"
          )}>
            <div className={cn(
              "text-sm mb-1",
              isLightTheme ? "text-muted-foreground" : "text-gray-400"
            )}>Net Worth</div>
            <div className={cn(
              "text-xl font-semibold",
              isLightTheme ? "text-blue-600" : "text-blue-400"
            )}>{formatCurrency(totalNetWorth - 845210)}</div>
            <div className={cn(
              "text-xs",
              isLightTheme ? "text-green-600" : "text-green-400"
            )}>+$112,200 (7.5%)</div>
            
            <div className="flex gap-1 absolute top-1 right-1">
              {propertyCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-xs flex items-center px-1",
                    isLightTheme 
                      ? "text-blue-600 hover:text-blue-700" 
                      : "text-blue-400 hover:text-blue-300"
                  )}
                  onClick={() => navigate('properties')}
                >
                  <Home className="h-3 w-3 mr-1" />
                  {propertyCount}
                </Button>
              )}
              
              {vehicleCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "text-xs flex items-center px-1",
                    isLightTheme 
                      ? "text-green-600 hover:text-green-700" 
                      : "text-green-400 hover:text-green-300"
                  )}
                  onClick={() => navigate('all-assets')}
                >
                  <Car className="h-3 w-3 mr-1" />
                  {vehicleCount}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Asset Allocation</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Pie Chart */}
              <div className="md:w-1/2 h-[300px] flex items-center justify-center">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
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
              <div className="md:w-1/2 space-y-2">
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
          "mt-4 pt-3 border-t flex justify-end",
          isLightTheme ? "border-border" : "border-gray-800"
        )}>
          <Button 
            variant="link" 
            className={cn(
              "text-sm p-0",
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
        "rounded-lg p-3 border",
        isLightTheme 
          ? "bg-card border-border" 
          : "bg-[#121a2c]/80 border-gray-800"
      )}>
        <h2 className="text-xl font-semibold">Net Worth Summary</h2>
        <div className={cn(
          "p-4 text-center",
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
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="flex items-center">
        <Progress 
          value={percentage} 
          className="h-2" 
          style={{backgroundColor: `${color}20`}} 
        />
        <span className="ml-2 text-xs">{percentage}%</span>
      </div>
    </div>
  );
};
