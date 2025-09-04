import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { playLindaWelcome } from '@/utils/lindaVoice';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export const FamilyOnboardingWelcome: React.FC<FamilyOnboardingWelcomeProps> = ({ onAuthChoice }) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    // Play Linda's welcome message after a short delay
    if ('speechSynthesis' in window && !hasPlayedWelcome) {
      const timer = setTimeout(() => {
        playLindaWelcome("Hi, I'm Linda. Welcome to Your Boutique Family Office.")
          .then(() => setHasPlayedWelcome(true))
          .catch(error => {
            console.error('Linda voice error:', error);
            setHasPlayedWelcome(true);
          });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcome]);

  const authProviders = [
    {
      name: 'Apple',
      icon: Apple,
      provider: 'apple',
      bgColor: 'bg-black hover:bg-gray-800',
      textColor: 'text-white'
    },
    {
      name: 'Microsoft',
      icon: Chrome,
      provider: 'microsoft',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      name: 'Google',
      icon: Chrome,
      provider: 'google',
      bgColor: 'bg-white hover:bg-gray-50 border border-gray-300',
      textColor: 'text-gray-900'
    },
    {
      name: 'Email',
      icon: Mail,
      provider: 'email',
      bgColor: 'bg-gold-base hover:bg-gold-hi',
      textColor: 'text-ink'
    }
  ];

  return (
    <div className="h-screen w-full" style={{ backgroundColor: '#001F3F' }}>
      {/* Fixed Top Banner with 4x8 Horizontal Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4" style={{ backgroundColor: '#001F3F' }}>
        <img
          src="/brand/bfo-horizontal-4x8.png"
          alt="Boutique Family Office"
          className="h-8 md:h-10 w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center pt-20">
        <div className="w-full max-w-md mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* BFO Logo with White-Gold Letters - Centered */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
              style={{ margin: '1.5rem 0' }}
            >
              <img
                src="/BFO-logo-black-gold.png"
                alt="Boutique Family Office Logo"
                className="w-48 h-52 md:w-56 md:h-64"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                  maxWidth: '192px',
                  maxHeight: '211px',
                  objectFit: 'contain'
                }}
              />
            </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Hi, I'm Linda
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Welcome to Your Boutique Family Office
            </p>
          </motion.div>

          {/* Auth Buttons in Clean Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            {authProviders.map((provider, index) => {
              const IconComponent = provider.icon;
              return (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                >
                  <Button
                    onClick={() => onAuthChoice(provider.provider)}
                    className={`
                      w-full h-14 flex items-center justify-center gap-3 
                      ${provider.bgColor} ${provider.textColor}
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-lg
                      focus:ring-2 focus:ring-white/20 focus:ring-offset-2 
                      focus:ring-offset-[#001F3F]
                      font-medium text-base
                      rounded-lg border-none
                    `}
                    style={{
                      boxShadow: provider.name === 'Email' ? 
                        '0 4px 20px rgba(212, 175, 55, 0.3)' : 
                        '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <IconComponent className="h-5 w-5" />
                    Continue with {provider.name}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Reassuring Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-sm text-blue-200 leading-relaxed"
          >
            Trusted by families worldwide.<br />
            Your secure space starts here.
          </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};