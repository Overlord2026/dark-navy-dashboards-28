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
          {/* Gold Tree Logo with Enhanced Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotateY: 0,
              filter: ["brightness(0) invert(1)", "brightness(0) invert(1) drop-shadow(0 0 20px #FFD700)"]
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              filter: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            className="mb-8"
          >
            <Logo 
              variant="hero" 
              className="h-20 w-auto md:h-32 filter brightness-0 invert"
              useTenantLogo={false}
            />
          </motion.div>

          {/* Main Headline - Experience the Difference */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight mb-4 uppercase tracking-widest"
          >
            Experience the {withTrademarks("Boutique Family Office")} Difference
          </motion.h1>

          {/* New Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-inter text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: '#C9C8C5' }}
          >
            All Your Wealth. All Your Advisors. All Under One Roof.
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
              className="btn-primary-gold px-8 py-4 rounded-lg font-inter font-bold text-navy text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3 min-w-[160px] justify-center shadow-lg"
              style={{ 
                background: '#FFD700', 
                boxShadow: '0 2px 20px rgba(20, 33, 61, 0.08), 0 0 30px rgba(255, 215, 0, 0.3)' 
              }}
              aria-label="Main action to enter Family Office platform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-navy" />
                  Loading...
                </>
              ) : (
                'Get Started'
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