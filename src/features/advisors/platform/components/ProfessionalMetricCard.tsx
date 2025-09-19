/**
 * Professional Metric Card Component
 * Matches the enterprise-grade design from Advisor Platform screenshots
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfessionalMetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
}

export function ProfessionalMetricCard({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon: Icon,
  className,
}: ProfessionalMetricCardProps) {
  return (
    <div className={cn("bfo-metric-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="bfo-icon-container">
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              changeType === 'positive' ? "text-bfo-emerald" : "text-red-400"
            )}
          >
            <span className="text-xs">
              {changeType === 'positive' ? '↗' : '↘'}
            </span>
            {change}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-white/60 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );
}