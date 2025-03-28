
import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  ResponsiveContainer, 
  CartesianGrid,
  Tooltip
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProjectionPreviewChartProps {
  expectedReturn: number;
  inflation: number;
  riskTolerance: string;
  monthlyNetSavings: number;
}

export function ProjectionPreviewChart({
  expectedReturn,
  inflation,
  riskTolerance,
  monthlyNetSavings
}: ProjectionPreviewChartProps) {
  // Generate projection data for 30 years
  const projectionData = useMemo(() => {
    const years = 30;
    const data = [];
    
    // Apply risk modifier based on selected tolerance
    const riskModifier = 
      riskTolerance === "Conservative" ? 0.7 :
      riskTolerance === "Moderate" ? 1.0 :
      riskTolerance === "Aggressive" ? 1.3 : 1.0;
    
    // Adjust expected return based on risk tolerance
    const adjustedReturn = expectedReturn * riskModifier;
    
    // Adjust for inflation to get real return
    const realReturn = (adjustedReturn - inflation) / 100;
    
    // Calculate annual savings
    const annualSavings = monthlyNetSavings * 12;
    
    let cumulativeValue = 0; // Starting value
    
    for (let year = 0; year <= years; year++) {
      // Simple growth formula: current value + (current value * real return) + annual savings
      if (year > 0) {
        cumulativeValue = cumulativeValue * (1 + realReturn) + annualSavings;
      }
      
      // Add projected value
      data.push({
        year,
        projectedValue: Math.max(0, Math.round(cumulativeValue)),
        
        // Add two other scenarios for comparison
        optimisticValue: Math.max(0, Math.round(cumulativeValue * 1.2)),
        pessimisticValue: Math.max(0, Math.round(cumulativeValue * 0.8))
      });
    }
    
    return data;
  }, [expectedReturn, inflation, riskTolerance, monthlyNetSavings]);
  
  // Format the tooltip values as currency
  const formatTooltip = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Determine chart color based on risk tolerance
  const getChartColor = () => {
    return riskTolerance === "Conservative" ? "#4CAF50" : 
           riskTolerance === "Aggressive" ? "#f97316" : 
           "#9b87f5";
  };
  
  return (
    <ChartContainer
      config={{
        projected: { label: "Projected", color: getChartColor() },
        optimistic: { label: "Optimistic", color: "#4CAF50" },
        pessimistic: { label: "Pessimistic", color: "#888888" }
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={projectionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 10 }}
            tickCount={5}
            stroke="rgba(255,255,255,0.3)"
          />
          <YAxis 
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            tick={{ fontSize: 10 }}
            width={45}
            stroke="rgba(255,255,255,0.3)"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg shadow-lg p-2 bg-background border border-border">
                    <p className="text-xs">{`Year ${payload[0].payload.year}`}</p>
                    <p className="text-xs font-medium text-[${getChartColor()}]">
                      {`Projected: ${formatTooltip(payload[0].value as number)}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="projectedValue" 
            name="projected"
            stroke={getChartColor()} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
