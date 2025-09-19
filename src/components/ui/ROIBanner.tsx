import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ROIBannerProps {
  title: string;
  amount: number;
  timeframe: string;
  description?: string;
  variant?: 'default' | 'highlight' | 'success';
  icon?: React.ReactNode;
}

export function ROIBanner({ 
  title, 
  amount, 
  timeframe, 
  description, 
  variant = 'default',
  icon 
}: ROIBannerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bfo-card border-bfo-gold/20 shadow-lg';
      case 'success':
        return 'bfo-card border-bfo-emerald/20 shadow-lg';
      default:
        return 'bfo-card';
    }
  };

  const getAmountColor = () => {
    switch (variant) {
      case 'highlight':
        return 'text-bfo-gold';
      case 'success':
        return 'text-bfo-emerald';
      default:
        return 'text-white';
    }
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`p-6 ${getVariantStyles()}`}>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bfo-icon-container"
          >
            {icon || <DollarSign className="h-6 w-6" />}
          </motion.div>

          <div className="flex-1">
            <motion.h3 
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {title}
            </motion.h3>
            
            <motion.div 
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <span className={`text-2xl font-bold ${getAmountColor()}`}>
                {formatAmount(amount)}
              </span>
              <span className="text-white/70 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {timeframe}
              </span>
            </motion.div>

            {description && (
              <motion.p 
                className="text-sm text-white/60 mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {description}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <TrendingUp className={`h-8 w-8 ${
              variant === 'highlight' ? 'text-bfo-gold' :
              variant === 'success' ? 'text-bfo-emerald' : 'text-white/70'
            }`} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}