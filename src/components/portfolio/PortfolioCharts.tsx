import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

// Custom Tooltip Component with Accessibility
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
        style={CHART_STYLES.tooltip}
        role="tooltip"
        aria-live="polite"
      >
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            <span className="font-medium">{entry.name}:</span>{' '}
            {typeof entry.value === 'number' && entry.value < 1 && entry.value > -1 
              ? formatPercentage(entry.value)
              : entry.value > 1000 
                ? formatCurrency(entry.value)
                : entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Asset Allocation Pie Chart
interface AssetAllocationChartProps {
  data: Array<{
    name: string;
    value: number;
    amount: number;
  }>;
  title?: string;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data, title = "Asset Allocation" }) => {
  return (
    <div className="w-full h-64 mb-6">
      <h4 className="text-lg font-semibold mb-3 text-center" aria-label={title}>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            labelLine={false}
            aria-label="Asset allocation pie chart"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={CHART_COLORS.portfolio[index % CHART_COLORS.portfolio.length]}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            style={CHART_STYLES.legend}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Portfolio vs Benchmark Performance Chart
interface PerformanceChartProps {
  data: Array<{
    period: string;
    portfolio: number;
    sp500: number;
    agg?: number;
  }>;
  title?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title = "Performance vs Benchmarks" }) => {
  return (
    <div className="w-full h-80 mb-6">
      <h4 className="text-lg font-semibold mb-3" aria-label={title}>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...CHART_STYLES.grid} />
          <XAxis 
            dataKey="period" 
            style={CHART_STYLES.axis}
            aria-label="Time periods"
          />
          <YAxis 
            style={CHART_STYLES.axis}
            tickFormatter={(value) => formatPercentage(value / 100)}
            aria-label="Returns percentage"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
          />
          <Legend style={CHART_STYLES.legend} />
          <Bar 
            dataKey="portfolio" 
            name="Your Portfolio" 
            fill={CHART_COLORS.primary}
            radius={[2, 2, 0, 0]}
            aria-label="Portfolio performance"
          />
          <Bar 
            dataKey="sp500" 
            name="S&P 500" 
            fill={CHART_COLORS.benchmarks.sp500}
            radius={[2, 2, 0, 0]}
            aria-label="S&P 500 benchmark performance"
          />
          {data[0]?.agg && (
            <Bar 
              dataKey="agg" 
              name="AGG Bonds" 
              fill={CHART_COLORS.benchmarks.agg}
              radius={[2, 2, 0, 0]}
              aria-label="AGG bonds benchmark performance"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Risk vs Return Scatter Plot (using Line Chart)
interface RiskReturnChartProps {
  data: Array<{
    name: string;
    risk: number;
    return: number;
    size: number;
  }>;
  title?: string;
}

export const RiskReturnChart: React.FC<RiskReturnChartProps> = ({ data, title = "Risk vs Return Analysis" }) => {
  return (
    <div className="w-full h-80 mb-6">
      <h4 className="text-lg font-semibold mb-3" aria-label={title}>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid {...CHART_STYLES.grid} />
          <XAxis 
            dataKey="risk" 
            type="number"
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
            style={CHART_STYLES.axis}
            label={{ value: 'Risk (Beta)', position: 'insideBottom', offset: -10 }}
            aria-label="Risk beta values"
          />
          <YAxis 
            dataKey="return"
            style={CHART_STYLES.axis}
            tickFormatter={(value) => formatPercentage(value / 100)}
            label={{ value: 'Expected Return', angle: -90, position: 'insideLeft' }}
            aria-label="Expected return percentage"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: CHART_COLORS.primary, strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="return" 
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: CHART_COLORS.secondary }}
            aria-label="Risk return relationship"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sector Allocation Bar Chart
interface SectorChartProps {
  data: Array<{
    sector: string;
    allocation: number;
    performance: number;
  }>;
  title?: string;
}

export const SectorChart: React.FC<SectorChartProps> = ({ data, title = "Sector Allocation & Performance" }) => {
  return (
    <div className="w-full h-80 mb-6">
      <h4 className="text-lg font-semibold mb-3" aria-label={title}>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid {...CHART_STYLES.grid} />
          <XAxis 
            type="number"
            style={CHART_STYLES.axis}
            tickFormatter={(value) => `${value}%`}
            aria-label="Allocation percentage"
          />
          <YAxis 
            dataKey="sector" 
            type="category"
            style={CHART_STYLES.axis}
            width={80}
            aria-label="Sector names"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
          />
          <Legend style={CHART_STYLES.legend} />
          <Bar 
            dataKey="allocation" 
            name="Allocation %" 
            fill={CHART_COLORS.primary}
            radius={[0, 2, 2, 0]}
            aria-label="Sector allocation percentages"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Income Analysis Chart
interface IncomeChartProps {
  data: Array<{
    source: string;
    monthly: number;
    annual: number;
    yield: number;
  }>;
  title?: string;
}

export const IncomeChart: React.FC<IncomeChartProps> = ({ data, title = "Income Analysis" }) => {
  return (
    <div className="w-full h-80 mb-6">
      <h4 className="text-lg font-semibold mb-3" aria-label={title}>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...CHART_STYLES.grid} />
          <XAxis 
            dataKey="source" 
            style={CHART_STYLES.axis}
            aria-label="Income sources"
          />
          <YAxis 
            style={CHART_STYLES.axis}
            tickFormatter={(value) => formatCurrency(value)}
            aria-label="Income amount"
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(15, 118, 110, 0.1)' }}
          />
          <Legend style={CHART_STYLES.legend} />
          <Bar 
            dataKey="monthly" 
            name="Monthly Income" 
            fill={CHART_COLORS.accent}
            radius={[2, 2, 0, 0]}
            aria-label="Monthly income by source"
          />
          <Bar 
            dataKey="annual" 
            name="Annual Income" 
            fill={CHART_COLORS.secondary}
            radius={[2, 2, 0, 0]}
            aria-label="Annual income by source"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};