import React, { useState } from 'react';
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
      className="fixed inset-0 flex flex-col min-h-screen"
      style={{ backgroundColor }}
    >
      {/* Watermark Logo - Bottom Right */}
      <div className="fixed bottom-8 right-8 opacity-15 pointer-events-none">
        <Logo variant="tree" className="h-16 w-auto grayscale" />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-md mx-auto"
        >
          {/* Gold Tree Logo */}
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

          {/* Main Headline - White Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight mb-4"
          >
            {withTrademarks("Boutique Family Office")}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-inter text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: '#C9C8C5' }}
          >
            Your Wealth. Your Advisors. Your Control.
          </motion.p>

          {/* Gold Button - Enter/Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
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

          {/* Animated Spinner - Gold Tree or Ring */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <div className="animate-spin">
                <Logo variant="tree" className="h-8 w-8 opacity-60 filter brightness-0 invert" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer - Copyright */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="pb-6 text-center"
      >
        <p className="font-inter text-sm opacity-60 text-white">
          Copyright © 2025 {withTrademarks("Boutique Family Office")}
        </p>
      </motion.footer>
    </div>
  );
};