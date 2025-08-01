import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface LeadsFunnelChartProps {
  dateRange: DateRange | undefined;
}

export function LeadsFunnelChart({ dateRange }: LeadsFunnelChartProps) {
  // TODO: Fetch real data based on dateRange
  const funnelData = [
    { stage: 'New Lead', count: 124, percentage: 100 },
    { stage: 'Contacted', count: 98, percentage: 79 },
    { stage: 'Appt Set', count: 37, percentage: 30 },
    { stage: 'Showed', count: 29, percentage: 23 },
    { stage: 'Closed', count: 7, percentage: 6 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Funnel Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} leads (${funnelData.find(d => d.count === value)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}