import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Apple, Mail, Chrome, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { playWelcome } from '@/utils/voiceSettings'; // Disabled Linda functionality
import { TopBanner } from '@/components/layout/TopBanner';
import SecondaryNav from '@/components/layout/SecondaryNav';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export function FamilyOnboardingWelcome(props: FamilyOnboardingWelcomeProps) {
  const { onAuthChoice } = props;
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Play Linda's welcome message after a short delay, unless muted
    if ('speechSynthesis' in window && !hasPlayedWelcome && !isMuted) {
      const timer = setTimeout(() => {
        playWelcome("Linda", "welcome");
        setHasPlayedWelcome(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcome, isMuted]);

  const handleMuteToggle = () => {
    setIsMuted(true);
    // Stop any currently playing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
      <TopBanner />
      <SecondaryNav />
      <div className="min-h-screen w-full overflow-y-auto brand-bg">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-start" style={{ paddingTop: '192px', minHeight: 'calc(100vh - 160px)' }}>
          <div className="w-full max-w-none mx-auto px-4" style={{ width: '90vw' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
              style={{ marginTop: '1.5rem' }}
            >
            {/* BFO Logo with White-Gold Letters - Centered */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
              style={{ marginBottom: '1rem' }}
            >
              <img
                src="/lovable-uploads/e63fd043-b0e8-4d12-b332-23ecbe473345.png"
                alt="Boutique Family Office Logo"
                className="object-contain h-[35vh] md:h-[40vh]"
              />
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
              {!isMuted && (
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
                    onClick={() => provider.disabled ? null : onAuthChoice(provider.provider)}
                    disabled={provider.disabled}
                    className={`
                      w-full h-12 flex items-center justify-center gap-3 
                      ${provider.disabled ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' : `${provider.bgColor} ${provider.textColor}`}
                      transition-all duration-300 ease-in-out
                      ${provider.disabled ? '' : 'hover:scale-105 hover:shadow-lg'}
                      focus:ring-2 focus:ring-white/20 focus:ring-offset-2 
                      focus:ring-offset-[#001F3F]
                      font-medium text-base
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
                    <IconComponent className="h-5 w-5" />
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