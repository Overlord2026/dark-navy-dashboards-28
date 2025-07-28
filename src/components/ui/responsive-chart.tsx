import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveChartProps {
  children: React.ReactElement;
  height?: number | string;
  minHeight?: number;
  className?: string;
}

export function ResponsiveChart({ 
  children, 
  height = 400, 
  minHeight = 200, 
  className = "" 
}: ResponsiveChartProps) {
  const { isMobile, isTablet } = useResponsive();
  
  const chartHeight = isMobile ? Math.max(minHeight, 250) : 
                     isTablet ? Math.max(minHeight, 300) : 
                     height;

  return (
    <div className={`w-full ${className}`} style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function MobileResponsiveTable({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div className="min-w-[600px]">
          {children}
        </div>
      </div>
    );
  }
  
  return <div className={className}>{children}</div>;
}