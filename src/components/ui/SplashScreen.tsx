import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { withTrademarks } from '@/utils/trademark';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onEnter?: () => void;
  showConfetti?: boolean;
  theme?: 'dark' | 'blue';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onEnter, 
  showConfetti = false,
  theme = 'dark'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = () => {
    setIsLoading(true);
    // Simulate brief loading before calling onEnter
    setTimeout(() => {
      onEnter?.();
    }, 800);
  };

  const backgroundColor = theme === 'dark' ? '#000000' : '#14213D';

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center min-h-screen px-8 py-12 md:py-16"
      style={{ backgroundColor }}
    >
      {/* Watermark Logo - Bottom Right */}
      <div className="fixed bottom-8 right-8 opacity-15 pointer-events-none">
        <Logo variant="tree" className="h-16 w-auto grayscale" />
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md mx-auto"
      >
        {/* Main Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Logo 
            variant="hero" 
            className="h-20 w-auto md:h-32 filter brightness-0 invert"
            useTenantLogo={false}
          />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight mb-4"
        >
          {withTrademarks("Boutique Family Office")}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-inter text-lg md:text-xl mb-8 leading-relaxed"
          style={{ color: '#C9C8C5' }}
        >
          Your Wealth. Your Advisors. Your Control.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-5"
        >
          <button
            onClick={handleEnter}
            disabled={isLoading}
            className="btn-primary-gold px-8 py-4 rounded-lg font-inter font-semibold text-navy text-lg hover:scale-105 transition-transform duration-200 flex items-center gap-3 min-w-[140px] justify-center"
            aria-label="Main action to enter Family Office platform"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-navy" />
                Loading...
              </>
            ) : (
              'Enter'
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Loading Spinner Alternative */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-spin">
            <Logo variant="tree" className="h-8 w-8 opacity-60" />
          </div>
        </motion.div>
      )}
    </div>
  );
};