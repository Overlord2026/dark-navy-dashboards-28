/**
 * ROI Charts Component - Professional charts for Advisor Platform
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ROIChartsProps {
  data?: Array<{
    channel: string;
    roi: number;
    spend: number;
    color: string;
  }>;
}

// Default chart data matching the screenshots
const defaultChartData = [
  {
    channel: 'LinkedIn',
    roi: 18.2,
    spend: 6500,
    color: '#0077B5'
  },
  {
    channel: 'Facebook',
    roi: 17.8,
    spend: 5200,
    color: '#1877F2'
  },
  {
    channel: 'Referrals',
    roi: 16.2,
    spend: 3800,
    color: '#FF6B35'
  },
  {
    channel: 'Google',
    roi: 15.4,
    spend: 4200,
    color: '#4CAF50'
  },
  {
    channel: 'Seminars',
    roi: 19.8,
    spend: 5800,
    color: '#9C27B0'
  },
  {
    channel: 'Email',
    roi: 14.6,
    spend: 2100,
    color: '#FF9800'
  }
];

export function ROICharts({ data = defaultChartData }: ROIChartsProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-bfo-navy-dark p-3 rounded-lg border border-bfo-gold/20 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-bfo-gold">
            ROI: {data.roi.toFixed(1)}%
          </p>
          <p className="text-white/70 text-sm">
            Spend: ${data.spend.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={props.payload.color} />;
  };

  return (
    <div className="space-y-6">
      {/* ROI by Channel Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bfo-card"
      >
        <h3 className="text-white text-xl font-semibold mb-6">ROI by Channel</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false}
              />
              <XAxis 
                dataKey="channel" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                label={{ 
                  value: 'Return on Investment', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="roi" 
                radius={[4, 4, 0, 0]}
                shape={(props: any) => <CustomBar {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}