import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Apple, Mail, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { playWelcome, isVoiceSupported } from '@/utils/voiceWelcome';
import { Logo } from '@/components/ui/Logo';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export const FamilyOnboardingWelcome: React.FC<FamilyOnboardingWelcomeProps> = ({ onAuthChoice }) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    // Play Linda's welcome message after a short delay
    if (isVoiceSupported() && !hasPlayedWelcome) {
      const timer = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(
          "Hi, I'm Linda from Your Boutique Family Office. Let's get you started in 60 seconds - your secure family hub awaits."
        );
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Select a warm, professional voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Female') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        setHasPlayedWelcome(true);
      }, 1000);

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
      icon: Chrome, // Using Chrome as placeholder for Microsoft
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
      bgColor: 'bg-primary hover:bg-primary/90',
      textColor: 'text-primary-foreground'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#001F3F' }}>
      <div className="w-full max-w-md px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="h-12 w-auto text-center">
              <span 
                className="text-2xl font-bold tracking-wide"
                style={{ color: '#D4AF37' }}
              >
                BOUTIQUE FAMILY OFFICE
              </span>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl font-bold text-white">
              Hi, I'm Linda from Your<br />
              <span style={{ color: '#D4AF37' }}>Boutique Family Office</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Let's begin your journey — sign up in just<br />
              <span className="font-semibold text-white">60 seconds</span>
            </p>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            {authProviders.map((provider, index) => {
              const IconComponent = provider.icon;
              return (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <Button
                    onClick={() => onAuthChoice(provider.provider)}
                    className={`
                      w-full h-12 flex items-center justify-center gap-3 
                      ${provider.bgColor} ${provider.textColor}
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-lg
                      hover:shadow-white/20
                      focus:ring-2 focus:ring-white/20 focus:ring-offset-2 
                      focus:ring-offset-[#001F3F]
                      font-medium text-base
                    `}
                    style={{
                      boxShadow: provider.name === 'Google' ? 
                        '0 0 20px rgba(255, 255, 255, 0.1)' : 
                        '0 0 20px rgba(212, 175, 55, 0.2)'
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
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-sm text-blue-200 leading-relaxed"
          >
            Your data is encrypted and secure.<br />
            Trusted by families worldwide.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};