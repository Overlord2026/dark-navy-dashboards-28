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
        return 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg';
      case 'success':
        return 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getAmountColor = () => {
    switch (variant) {
      case 'highlight':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-gray-700';
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
      <Card className={`p-6 border-2 ${getVariantStyles()}`}>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={`p-3 rounded-full ${
              variant === 'highlight' ? 'bg-blue-100' :
              variant === 'success' ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            {icon || <DollarSign className={`h-6 w-6 ${
              variant === 'highlight' ? 'text-blue-600' :
              variant === 'success' ? 'text-green-600' : 'text-gray-600'
            }`} />}
          </motion.div>

          <div className="flex-1">
            <motion.h3 
              className="text-lg font-semibold text-foreground"
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
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {timeframe}
              </span>
            </motion.div>

            {description && (
              <motion.p 
                className="text-sm text-muted-foreground mt-2"
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
              variant === 'highlight' ? 'text-blue-500' :
              variant === 'success' ? 'text-green-500' : 'text-gray-500'
            }`} />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}