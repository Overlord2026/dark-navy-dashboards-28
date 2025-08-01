import React from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CHART_COLORS, CHART_STYLES } from '@/utils/chartTheme';

interface EnhancedChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title?: string;
  xKey: string;
  yKey: string;
  color?: string;
  animated?: boolean;
  showGradient?: boolean;
  height?: number;
}

export function EnhancedCalculatorChart({ 
  data, 
  type, 
  title, 
  xKey, 
  yKey, 
  color = CHART_COLORS.primary,
  animated = true,
  showGradient = true,
  height = 300 
}: EnhancedChartProps) {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  const chartProps = {
    data: data,
    margin: {
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    },
  };

  const animationProps = animated ? {
    animationBegin: 0,
    animationDuration: CHART_STYLES.animations.duration,
    isAnimationActive: true
  } : {
    isAnimationActive: false
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...chartProps}>
            <defs>
              {showGradient && (
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              )}
            </defs>
            <CartesianGrid 
              strokeDasharray={CHART_STYLES.grid.strokeDasharray} 
              stroke={CHART_STYLES.grid.stroke}
              opacity={CHART_STYLES.grid.opacity || 1}
            />
            <XAxis 
              dataKey={xKey} 
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
            />
            <YAxis 
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: CHART_STYLES.tooltip.backgroundColor,
                border: CHART_STYLES.tooltip.border,
                borderRadius: CHART_STYLES.tooltip.borderRadius,
                boxShadow: CHART_STYLES.tooltip.boxShadow,
                fontSize: CHART_STYLES.tooltip.fontSize,
                fontFamily: CHART_STYLES.tooltip.fontFamily
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, yKey]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke={color} 
              fillOpacity={1}
              fill={showGradient ? `url(#${gradientId})` : color}
              strokeWidth={3}
              {...animationProps}
            />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray={CHART_STYLES.grid.strokeDasharray} 
              stroke={CHART_STYLES.grid.stroke}
            />
            <XAxis 
              dataKey={xKey}
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
            />
            <YAxis 
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: CHART_STYLES.tooltip.backgroundColor,
                border: CHART_STYLES.tooltip.border,
                borderRadius: CHART_STYLES.tooltip.borderRadius,
                boxShadow: CHART_STYLES.tooltip.boxShadow,
                fontSize: CHART_STYLES.tooltip.fontSize,
                fontFamily: CHART_STYLES.tooltip.fontFamily
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, yKey]}
            />
            <Bar 
              dataKey={yKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
              {...animationProps}
            />
            </BarChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray={CHART_STYLES.grid.strokeDasharray} 
              stroke={CHART_STYLES.grid.stroke}
            />
            <XAxis 
              dataKey={xKey}
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
            />
            <YAxis 
              fontSize={CHART_STYLES.axis.fontSize}
              fontFamily={CHART_STYLES.axis.fontFamily}
              fill={CHART_STYLES.axis.fill}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: CHART_STYLES.tooltip.backgroundColor,
                border: CHART_STYLES.tooltip.border,
                borderRadius: CHART_STYLES.tooltip.borderRadius,
                boxShadow: CHART_STYLES.tooltip.boxShadow,
                fontSize: CHART_STYLES.tooltip.fontSize,
                fontFamily: CHART_STYLES.tooltip.fontFamily
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, yKey]}
            />
            <Line 
              type="monotone" 
              dataKey={yKey} 
              stroke={color} 
              strokeWidth={3}
              dot={{ r: 6, fill: color }}
              activeDot={{ r: 8, stroke: color, strokeWidth: 2, fill: '#fff' }}
              {...animationProps}
            />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden" style={{ boxShadow: CHART_STYLES.effects?.chartShadow }}>
        {title && (
          <div className="p-4 pb-0">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        )}
        <CardContent className="pt-6">
          {renderChart()}
        </CardContent>
      </Card>
    </motion.div>
  );
}