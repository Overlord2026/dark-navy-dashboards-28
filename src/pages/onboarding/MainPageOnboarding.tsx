import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Chrome, VolumeX, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { playWelcome } from '@/utils/voiceSettings'; // Disabled Linda functionality
import { SecondaryNav } from '@/components/layout/SecondaryNav';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export const FamilyOnboardingWelcome: React.FC<FamilyOnboardingWelcomeProps> = ({ onAuthChoice }) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLindaDisabled, setIsLindaDisabled] = useState(() => {
    // Check localStorage for persistent setting
    const stored = localStorage.getItem('lindaDisabled');
    console.log('🎙️ Linda disabled from localStorage:', stored);
    return stored === 'true';
  });

  // Enhanced speech stopping function
  const stopAllSpeech = () => {
    console.log('🔇 Stopping all speech...');
    if ('speechSynthesis' in window) {
      // Multiple approaches to ensure speech stops
      window.speechSynthesis.cancel();
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      
      // Additional safety: clear any pending utterances
      setTimeout(() => {
        window.speechSynthesis.cancel();
      }, 100);
    }
  };

  useEffect(() => {
    console.log('🎙️ Linda voice permanently disabled in dev environment');
    // Linda voice is permanently disabled - no autoplay or greetings
  }, [hasPlayedWelcome, isMuted, isLindaDisabled]);

  const handleMuteToggle = () => {
    console.log('🔇 Muting Linda voice...');
    setIsMuted(true);
    stopAllSpeech();
  };

  const handleLindaToggle = () => {
    const newDisabledState = !isLindaDisabled;
    console.log('🔄 Toggling Linda - new disabled state:', newDisabledState);
    
    // IMMEDIATELY stop speech first
    stopAllSpeech();
    
    setIsLindaDisabled(newDisabledState);
    localStorage.setItem('lindaDisabled', newDisabledState.toString());
    
    if (newDisabledState) {
      console.log('🚫 Disabling Linda - stopping all speech');
      setIsMuted(true);
      setHasPlayedWelcome(true); // Prevent future playback
    } else {
      console.log('✅ Enabling Linda');
      setIsMuted(false);
      setHasPlayedWelcome(false);
    }
  };

  const authProviders = [
    {
      name: 'Apple',
      icon: Apple,
      provider: 'apple',
      bgColor: 'bg-black hover:bg-gray-800',
      textColor: 'text-white',
      disabled: true // Disabled until API configured
    },
    {
      name: 'Microsoft',
      icon: Chrome,
      provider: 'microsoft',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      disabled: true // Disabled until API configured
    },
    {
      name: 'Google',
      icon: Chrome,
      provider: 'google',
      bgColor: 'bg-white hover:bg-gray-50 border border-gray-300',
      textColor: 'text-gray-900',
      disabled: false // Enabled with Supabase OAuth
    },
    {
      name: 'Email',
      icon: Mail,
      provider: 'email',
      bgColor: 'bg-gold-base hover:bg-gold-hi',
      textColor: 'text-ink',
      disabled: false // Enabled
    }
  ];

  return (
    <>
      {/* Secondary Nav only on onboarding page */}
      <SecondaryNav />
      <div className="min-h-screen w-full brand-bg">
        {/* Main Content - Mobile Responsive */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8" style={{ paddingTop: '184px' }}>
          <div className="w-full max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              {/* BFO Logo - Centered at 60% size */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <img
                  src="/lovable-uploads/e63fd043-b0e8-4d12-b332-23ecbe473345.png"
                  alt="Boutique Family Office Logo"
                  className="w-auto h-auto max-w-[60%] max-h-[60%] object-contain"
                  style={{
                    width: '60%',
                    height: 'auto'
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
                  {/* Debug indicator */}
                  <span className="text-xs text-white/60">
                    {isLindaDisabled ? '🔇' : '🔊'}
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
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
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
                <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
                  Welcome to Your Boutique Family Office
                </p>
              </motion.div>

              {/* Auth Buttons - Mobile Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-3"
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
                        onClick={() => provider.disabled ? null : onAuthChoice(provider.provider)}
                        disabled={provider.disabled}
                        className={`
                          w-full h-12 sm:h-14 flex items-center justify-center gap-3 
                          ${provider.disabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' : `${provider.bgColor} ${provider.textColor}`}
                          transition-all duration-300 ease-in-out
                          ${provider.disabled ? '' : 'hover:scale-105 hover:shadow-lg'}
                          focus:ring-2 focus:ring-white/20 focus:ring-offset-2 
                          focus:ring-offset-[#001F3F]
                          font-medium text-sm sm:text-base
                          rounded-lg border-none
                        `}
                        style={{
                          boxShadow: provider.disabled ? 'none' : (
                            provider.name === 'Email' ? 
                              '0 4px 20px rgba(212, 175, 55, 0.3)' : 
                              '0 2px 10px rgba(0, 0, 0, 0.2)'
                          )
                        }}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                        {provider.disabled ? `${provider.name} (Coming Soon)` : `Continue with ${provider.name}`}
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
                className="text-xs sm:text-sm text-blue-200 leading-relaxed text-center mt-6"
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