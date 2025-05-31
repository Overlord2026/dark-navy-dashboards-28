
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface AssetData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface AssetAllocationChartProps {
  realEstate: number;
  vehicles: number;
  investments: number;
  cash: number;
  retirement: number;
  collectibles: number;
  digital: number;
  other: number;
  totalValue: number;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  realEstate,
  vehicles,
  investments,
  cash,
  retirement,
  collectibles,
  digital,
  other,
  totalValue,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const calculatePercentage = (value: number) => {
    return totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;
  };

  const pieChartData: AssetData[] = [
    realEstate > 0 && { name: "Real Estate", value: realEstate, percentage: calculatePercentage(realEstate), color: "#3b82f6" },
    vehicles > 0 && { name: "Vehicles & Boats", value: vehicles, percentage: calculatePercentage(vehicles), color: "#22c55e" },
    retirement > 0 && { name: "Retirement Accounts", value: retirement, percentage: calculatePercentage(retirement), color: "#a855f7" },
    investments > 0 && { name: "Investments", value: investments, percentage: calculatePercentage(investments), color: "#6366f1" },
    cash > 0 && { name: "Cash & Equivalents", value: cash, percentage: calculatePercentage(cash), color: "#f59e0b" },
    collectibles > 0 && { name: "Collectibles & Art", value: collectibles, percentage: calculatePercentage(collectibles), color: "#ec4899" },
    digital > 0 && { name: "Digital Assets", value: digital, percentage: calculatePercentage(digital), color: "#06b6d4" },
    other > 0 && { name: "Other", value: other, percentage: calculatePercentage(other), color: "#6b7280" }
  ].filter(Boolean) as AssetData[];

  return (
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
            <div key={index} className="py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: asset.color }}
                  />
                  {asset.name}
                </span>
                <span className="text-base font-medium">{formatCurrency(asset.value)}</span>
              </div>
              <div className="flex items-center">
                <div 
                  className="h-2 bg-gray-200 rounded-full flex-1"
                  style={{backgroundColor: `${asset.color}20`}}
                >
                  <div 
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: asset.color,
                      width: `${asset.percentage}%`
                    }}
                  />
                </div>
                <span className="ml-3 text-sm">{asset.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
