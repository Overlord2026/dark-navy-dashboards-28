import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';

interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

interface CumulativeRevenueChartProps {
  dateRange: DateRange | undefined;
}

export function CumulativeRevenueChart({ dateRange }: CumulativeRevenueChartProps) {
  // Mock cumulative spend vs revenue data over time
  const cumulativeData = [
    { month: 'Jan', spend: 2000, revenue: 5000, profit: 3000 },
    { month: 'Feb', spend: 4200, revenue: 12000, profit: 7800 },
    { month: 'Mar', spend: 6800, revenue: 18500, profit: 11700 },
    { month: 'Apr', spend: 9500, revenue: 28000, profit: 18500 },
    { month: 'May', spend: 12200, revenue: 35500, profit: 23300 },
    { month: 'Jun', spend: 15000, revenue: 45000, profit: 30000 },
    { month: 'Jul', spend: 17800, revenue: 54500, profit: 36700 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Spend vs Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={cumulativeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.grid.stroke} />
              <XAxis dataKey="month" style={CHART_STYLES.axis} />
              <YAxis 
                style={CHART_STYLES.axis}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={CHART_STYLES.tooltip}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`, 
                  name === 'spend' ? 'Total Spend' : name === 'revenue' ? 'Total Revenue' : 'Total Profit'
                ]}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke={CHART_COLORS.negative}
                fill={CHART_COLORS.negative}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.positive}
                fill={CHART_COLORS.positive}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}