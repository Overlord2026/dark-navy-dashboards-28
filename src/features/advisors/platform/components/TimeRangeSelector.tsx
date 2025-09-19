/**
 * Time Range Selector Component - Professional time period selection
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  className?: string;
}

const timeRanges = [
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last30', label: 'Last 30 Days' },
  { key: 'last90', label: 'Last 90 Days' },
  { key: 'ytd', label: 'Year to Date' },
  { key: 'last12', label: 'Last 12 Months' },
  { key: 'custom', label: 'Custom Range', icon: Calendar }
];

export function TimeRangeSelector({ 
  selectedRange, 
  onRangeChange, 
  className 
}: TimeRangeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("bfo-card", className)}
    >
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {timeRanges.map((range) => (
          <Button
            key={range.key}
            variant={selectedRange === range.key ? "default" : "outline"}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all",
              selectedRange === range.key
                ? "bfo-btn-gold"
                : "bfo-btn-outline"
            )}
            onClick={() => onRangeChange(range.key)}
          >
            {range.icon && <range.icon className="w-4 h-4" />}
            <span className="hidden sm:inline">{range.label}</span>
            <span className="sm:hidden">{range.label.replace('Last ', '').replace(' Days', 'd').replace(' Months', 'm')}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}