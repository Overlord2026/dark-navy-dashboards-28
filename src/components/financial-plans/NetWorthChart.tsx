
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { InfoCircleIcon } from "lucide-react";

// Sample data - this would typically come from an API
const sampleData = [
  { year: 2024, median: 100000, high: 120000, low: 80000 },
  { year: 2025, median: 110000, high: 140000, low: 85000 },
  { year: 2026, median: 125000, high: 160000, low: 95000 },
  { year: 2027, median: 140000, high: 180000, low: 105000 },
  { year: 2028, median: 160000, high: 210000, low: 120000 },
  { year: 2029, median: 185000, high: 240000, low: 140000 },
  { year: 2030, median: 215000, high: 280000, low: 165000 },
  { year: 2031, median: 250000, high: 320000, low: 190000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function NetWorthChart() {
  const [showHighLow, setShowHighLow] = useState(false);
  
  const chartConfig = {
    median: { 
      label: "Median", 
      color: "#33C3F0" 
    },
    high: { 
      label: "High", 
      color: "#4CAF50" 
    },
    low: { 
      label: "Low", 
      color: "#FF5252" 
    },
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#33C3F0]"></div>
          <span className="text-xs">Median</span>
          <InfoCircleIcon className="h-4 w-4 text-muted-foreground ml-1" />
        </div>
        
        {showHighLow && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5252]"></div>
              <span className="text-xs">Low</span>
            </div>
          </>
        )}
        
        <Button 
          variant="link" 
          size="sm" 
          className="text-xs text-muted-foreground ml-auto"
          onClick={() => setShowHighLow(!showHighLow)}
        >
          {showHighLow ? "Hide High and Low" : "Show High and Low"}
        </Button>
      </div>
      
      <div className="h-64 w-full">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sampleData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#33C3F0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF5252" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#142136" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#8E9196' }} 
                axisLine={{ stroke: '#142136' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`} 
                tick={{ fill: '#8E9196' }} 
                axisLine={{ stroke: '#142136' }}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <div className="text-sm font-medium mb-2">{label}</div>
                        {payload.map((entry) => (
                          <div key={entry.dataKey} className="flex justify-between gap-2">
                            <span className="text-[#8E9196]">{entry.name}:</span>
                            <span className="font-medium">{formatCurrency(entry.value as number)}</span>
                          </div>
                        ))}
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="median"
                name="Median"
                stroke="#33C3F0"
                fillOpacity={1}
                fill="url(#colorMedian)"
              />
              {showHighLow && (
                <>
                  <Area
                    type="monotone"
                    dataKey="high"
                    name="High"
                    stroke="#4CAF50"
                    fillOpacity={0.3}
                    fill="url(#colorHigh)"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    name="Low"
                    stroke="#FF5252"
                    fillOpacity={0.3}
                    fill="url(#colorLow)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="flex justify-end mt-2">
        <span className="text-muted-foreground text-xs">$--</span>
      </div>
    </div>
  );
}

// Import Button since it's used in the component
import { Button } from "@/components/ui/button";
