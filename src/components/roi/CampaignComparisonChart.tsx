import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';

interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

interface CampaignComparisonChartProps {
  dateRange: DateRange | undefined;
  viewType?: 'bar' | 'pie';
}

export function CampaignComparisonChart({ dateRange, viewType = 'bar' }: CampaignComparisonChartProps) {
  // Mock campaign performance data
  const campaignData = [
    { name: 'Facebook Q4', spend: 4000, revenue: 15000, leads: 45, roi: 275 },
    { name: 'Google Search', spend: 1800, revenue: 8500, leads: 28, roi: 372 },
    { name: 'LinkedIn Pro', spend: 2200, revenue: 12000, leads: 22, roi: 445 },
    { name: 'Email Campaign', spend: 500, revenue: 3200, leads: 18, roi: 540 },
  ];

  const pieData = campaignData.map(item => ({
    name: item.name,
    value: item.revenue,
    leads: item.leads,
  }));

  if (viewType === 'pie') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS.portfolio[index % CHART_COLORS.portfolio.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={CHART_STYLES.tooltip}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend style={CHART_STYLES.legend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={campaignData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLES.grid.stroke} />
              <XAxis 
                dataKey="name" 
                style={CHART_STYLES.axis}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis style={CHART_STYLES.axis} />
              <Tooltip 
                contentStyle={CHART_STYLES.tooltip}
                formatter={(value: number, name: string) => {
                  if (name === 'spend' || name === 'revenue') {
                    return [`$${value.toLocaleString()}`, name === 'spend' ? 'Spend' : 'Revenue'];
                  }
                  if (name === 'roi') {
                    return [`${value}%`, 'ROI'];
                  }
                  return [value, 'Leads'];
                }}
              />
              <Bar dataKey="spend" fill={CHART_COLORS.negative} name="spend" radius={[2, 2, 0, 0]} />
              <Bar dataKey="revenue" fill={CHART_COLORS.positive} name="revenue" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}