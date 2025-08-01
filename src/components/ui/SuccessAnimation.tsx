import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Celebration } from '@/components/ConfettiAnimation';

interface SuccessAnimationProps {
  type: 'optimization' | 'calculation' | 'document' | 'achievement';
  message: string;
  amount?: number;
  duration?: number;
  onComplete?: () => void;
}

export function SuccessAnimation({ 
  type, 
  message, 
  amount, 
  duration = 3000,
  onComplete 
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    // Trigger confetti for major optimizations
    if (type === 'optimization' && amount && amount > 10000) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    // Auto-hide animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, amount, duration, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="h-8 w-8 text-green-500" />;
      case 'calculation':
        return <DollarSign className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <CheckCircle className="h-8 w-8 text-emerald-500" />;
      default:
        return <CheckCircle className="h-8 w-8 text-primary" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'optimization':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'calculation':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      case 'document':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200';
      default:
        return 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Celebration trigger={showConfetti} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-4 right-4 z-50 p-6 rounded-xl border-2 shadow-lg max-w-sm ${getBackgroundColor()}`}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {getIcon()}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="font-semibold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {type === 'optimization' ? 'Optimization Found!' : 
               type === 'calculation' ? 'Calculation Complete!' :
               type === 'document' ? 'Document Processed!' : 'Success!'}
            </motion.h4>
            
            <motion.p 
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {message}
            </motion.p>
            
            {amount && (
              <motion.div 
                className="mt-2 px-3 py-1 bg-white/80 rounded-lg inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span className="font-bold text-green-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(amount)} saved
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}