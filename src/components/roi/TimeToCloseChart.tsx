import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface TimeToCloseChartProps {
  dateRange: DateRange | undefined;
}

export function TimeToCloseChart({ dateRange }: TimeToCloseChartProps) {
  // Mock data for time to close distribution
  const timeToCloseData = [
    { range: '0-30 days', count: 12, percentage: 34.3 },
    { range: '31-60 days', count: 8, percentage: 22.9 },
    { range: '61-90 days', count: 6, percentage: 17.1 },
    { range: '91-120 days', count: 4, percentage: 11.4 },
    { range: '120+ days', count: 5, percentage: 14.3 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time to Close Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeToCloseData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.grid.stroke} />
              <XAxis 
                dataKey="range" 
                style={CHART_STYLES.axis}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis style={CHART_STYLES.axis} />
              <Tooltip 
                contentStyle={CHART_STYLES.tooltip}
                formatter={(value: number, name: string) => [
                  `${value} leads (${timeToCloseData.find(d => d.count === value)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar 
                dataKey="count" 
                fill={CHART_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}