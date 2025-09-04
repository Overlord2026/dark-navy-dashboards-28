import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Chrome, VolumeX, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { playLindaWelcome } from '@/utils/lindaVoice';
import { TopBanner } from '@/components/layout/TopBanner';
import { SecondaryNav } from '@/components/layout/SecondaryNav';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export const FamilyOnboardingWelcome: React.FC<FamilyOnboardingWelcomeProps> = ({ onAuthChoice }) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLindaDisabled, setIsLindaDisabled] = useState(() => {
    // Check localStorage for persistent setting
    return localStorage.getItem('lindaDisabled') === 'true';
  });

  useEffect(() => {
    // Play Linda's welcome message after a short delay, unless disabled or muted
    if ('speechSynthesis' in window && !hasPlayedWelcome && !isMuted && !isLindaDisabled) {
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
  }, [hasPlayedWelcome, isMuted, isLindaDisabled]);

  const handleMuteToggle = () => {
    setIsMuted(true);
    // Stop any currently playing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleLindaToggle = () => {
    const newDisabledState = !isLindaDisabled;
    setIsLindaDisabled(newDisabledState);
    // Persist setting to localStorage
    localStorage.setItem('lindaDisabled', newDisabledState.toString());
    
    if (newDisabledState) {
      // Stop any currently playing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsMuted(true);
    }
  };

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
    <>
      {/* Secondary Nav only on onboarding page */}
      <SecondaryNav />
      <div className="h-screen w-full" style={{ backgroundColor: '#001F3F' }}>
        {/* Main Content */}
        <div className="h-full flex flex-col items-center justify-start" style={{ paddingTop: '4rem' }}>
          <div className="w-full max-w-none mx-auto px-4" style={{ width: '90vw' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              {/* BFO Logo - Centered */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <img
                  src="/lovable-uploads/e63fd043-b0e8-4d12-b332-23ecbe473345.png"
                  alt="Boutique Family Office Logo"
                  className="w-72 h-80 md:w-96 md:h-[420px] lg:w-[480px] lg:h-[528px]"
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </motion.div>

              {/* Linda Disable Toggle - Above her greeting */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center mb-6"
              >
                <button
                  onClick={handleLindaToggle}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/20"
                  aria-label="Toggle Linda voice assistant"
                >
                  {isLindaDisabled ? (
                    <ToggleLeft className="h-5 w-5 text-white/60" />
                  ) : (
                    <ToggleRight className="h-5 w-5 text-gold-base" />
                  )}
                  <span className="text-sm text-white/90 font-medium">
                    {isLindaDisabled ? 'Enable Linda' : 'Disable Linda'}
                  </span>
                </button>
              </motion.div>

              {/* Welcome Message with Mute Control */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center space-y-3 mb-8"
              >
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Hi, I'm Linda
                  </h1>
                  {!isMuted && !isLindaDisabled && (
                    <button
                      onClick={handleMuteToggle}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                      aria-label="Mute Linda's voice"
                      title="Mute voice"
                    >
                      <VolumeX className="h-4 w-4 text-white/60 hover:text-white/80" />
                    </button>
                  )}
                </div>
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                  Welcome to Your Boutique Family Office
                </p>
              </motion.div>

              {/* Auth Buttons in Clean Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-3 max-w-md mx-auto"
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
                          w-full h-12 flex items-center justify-center gap-3 
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
                className="text-sm text-blue-200 leading-relaxed text-center mt-6"
              >
                Trusted by families worldwide.<br />
                Your secure space starts here.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyOnboardingWelcome;