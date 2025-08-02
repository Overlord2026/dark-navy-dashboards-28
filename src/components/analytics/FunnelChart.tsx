import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
}

export function FunnelChart({ data, title = "Lead Conversion Funnel" }: FunnelChartProps) {
  return (
    <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold font-playfair">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
              <XAxis 
                dataKey="stage" 
                stroke="hsl(var(--gold))"
                tick={{ fill: 'hsl(var(--gold))' }}
              />
              <YAxis stroke="hsl(var(--gold))" tick={{ fill: 'hsl(var(--gold))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--deep-blue))',
                  border: '1px solid hsl(var(--gold))',
                  borderRadius: '8px',
                  color: 'hsl(var(--gold))'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} (${props.payload.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}