import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface AdvancedROIFunnelChartProps {
  dateRange: DateRange | undefined;
}

export function AdvancedROIFunnelChart({ dateRange }: AdvancedROIFunnelChartProps) {
  // Advanced funnel with 5 stages as requested
  const funnelData = [
    { stage: 'Leads', count: 250, percentage: 100, conversion: 100, dropOff: 0 },
    { stage: '1st Appt', count: 85, percentage: 34, conversion: 34, dropOff: 66 },
    { stage: '2nd Appt', count: 42, percentage: 17, conversion: 49.4, dropOff: 50.6 },
    { stage: '3rd Appt', count: 28, percentage: 11, conversion: 66.7, dropOff: 33.3 },
    { stage: 'Closed', count: 18, percentage: 7, conversion: 64.3, dropOff: 35.7 },
  ];

  const getBarColor = (index: number) => {
    const colors = [
      CHART_COLORS.primary,
      CHART_COLORS.secondary,
      CHART_COLORS.accent,
      CHART_COLORS.positive,
      CHART_COLORS.portfolio[4],
    ];
    return colors[index] || CHART_COLORS.neutral;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Lead Conversion Funnel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track leads through each stage with conversion percentages
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="horizontal"
              margin={{
                top: 20,
                right: 100,
                left: 80,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.grid.stroke} />
              <XAxis 
                type="number" 
                style={CHART_STYLES.axis}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis 
                type="category" 
                dataKey="stage" 
                style={CHART_STYLES.axis}
                width={70}
              />
              <Tooltip 
                contentStyle={CHART_STYLES.tooltip}
                formatter={(value: number, name: string, props: any) => {
                  const { payload } = props;
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div className="font-medium">{payload.stage}</div>
                      <div>Count: {value}</div>
                      <div>% of Total: {payload.percentage}%</div>
                      <div>Stage Conversion: {payload.conversion}%</div>
                      {payload.dropOff > 0 && (
                        <div className="text-red-500">Drop-off: {payload.dropOff}%</div>
                      )}
                    </div>,
                    ''
                  ];
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Conversion Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {funnelData.slice(1).map((stage, index) => (
            <div key={stage.stage} className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-semibold" style={{ color: getBarColor(index + 1) }}>
                {stage.conversion}%
              </div>
              <div className="text-xs text-muted-foreground">
                {stage.stage} Conversion
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}