import { CashFlowData } from '../types';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CashFlowChartProps {
  data: CashFlowData[];
  onBarClick?: (data: any, period: string) => void;
}

export function CashFlowChart({ data, onBarClick }: CashFlowChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (onBarClick) {
      onBarClick(data, data.period);
    }
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-sm text-muted-foreground"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            className="text-sm text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Bar 
            dataKey="income" 
            fill="hsl(var(--success))" 
            name="Income"
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--destructive))" 
            name="Expenses"
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            name="Net Cash Flow"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}