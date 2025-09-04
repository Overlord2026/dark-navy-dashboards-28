import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Apple, Mail, Chrome, Briefcase, Calculator, Scale, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { playLindaWelcome, testLindaVoice } from '@/utils/lindaVoice';
import { Logo } from '@/components/ui/Logo';

interface FamilyOnboardingWelcomeProps {
  onAuthChoice: (provider: string) => void;
}

export const FamilyOnboardingWelcome: React.FC<FamilyOnboardingWelcomeProps> = ({ onAuthChoice }) => {
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    // Play Linda's welcome message after a short delay
    if ('speechSynthesis' in window && !hasPlayedWelcome) {
      const timer = setTimeout(() => {
        playLindaWelcome()
          .then(() => setHasPlayedWelcome(true))
          .catch(error => {
            console.error('Linda voice error:', error);
            setHasPlayedWelcome(true);
          });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcome]);

  // Test Linda's voice on component mount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        testLindaVoice();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: '#001F3F' }}>
      <div className="w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 sm:space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="text-center">
              <span 
                className="text-xl sm:text-2xl font-bold tracking-wide"
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
            className="text-center space-y-3 sm:space-y-4"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Hi, I'm Linda<br />
              <span style={{ color: '#D4AF37' }}>Welcome to your family's boutique home</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed px-4">
              <span className="font-semibold text-white">Ready to explore?</span><br />
              Your secure family hub awaits
            </p>

          {/* Meet Your Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-medium text-white">Meet Your Team</h3>
            
            <div className="flex justify-center items-center space-x-4 sm:space-x-6">
              {[
                { icon: Briefcase, label: 'Advisor', delay: 0.1 },
                { icon: Calculator, label: 'Accountant', delay: 0.2 },
                { icon: Scale, label: 'Attorney', delay: 0.3 }
              ].map((member, index) => {
                const IconComponent = member.icon;
                return (
                  <motion.div
                    key={member.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.0 + member.delay }}
                    className="text-center"
                  >
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 mx-auto transition-all duration-300 hover:scale-110"
                      style={{ 
                        backgroundColor: '#D4AF37',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      <IconComponent className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-blue-200 font-medium">{member.label}</span>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center text-blue-100 text-xs sm:text-sm font-medium px-4"
            >
              All working together in your secure space
            </motion.p>
          </motion.div>

          {/* Health & Wealth Blueprint Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-medium text-white">Health & Wealth Blueprint</h3>
            
            <div className="flex justify-center items-center space-x-6 sm:space-x-8">
              {[
                { icon: Heart, label: 'Health Tracking', delay: 0.1 },
                { icon: TrendingUp, label: 'Wealth Planning', delay: 0.2 }
              ].map((element, index) => {
                const IconComponent = element.icon;
                return (
                  <motion.div
                    key={element.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.8 + element.delay }}
                    className="text-center"
                  >
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 mx-auto transition-all duration-300 hover:scale-110"
                      style={{ 
                        backgroundColor: '#D4AF37',
                        boxShadow: '0 6px 25px rgba(212, 175, 55, 0.4)'
                      }}
                    >
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-blue-200 font-medium">{element.label}</span>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="text-center space-y-2 px-4"
            >
              <p className="text-white font-semibold text-sm sm:text-base">
                Live longer, live smarter
              </p>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Your hub for health tracking and wealth planning<br />
                <span className="font-medium">Invite your whole team to thrive</span>
              </p>
            </motion.div>
          </motion.div>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="space-y-3 sm:space-y-4 px-4"
          >
            {authProviders.map((provider, index) => {
              const IconComponent = provider.icon;
              return (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 2.6 + index * 0.1 }}
                >
                  <Button
                    onClick={() => onAuthChoice(provider.provider)}
                    className={`
                      w-full h-12 sm:h-14 flex items-center justify-center gap-3 
                      ${provider.bgColor} ${provider.textColor}
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-lg
                      hover:shadow-white/20
                      focus:ring-2 focus:ring-white/20 focus:ring-offset-2 
                      focus:ring-offset-[#001F3F]
                      font-medium text-sm sm:text-base
                      rounded-lg
                    `}
                    style={{
                      boxShadow: provider.name === 'Google' ? 
                        '0 0 20px rgba(255, 255, 255, 0.1)' : 
                        '0 0 20px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
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
            transition={{ duration: 0.6, delay: 3.0 }}
            className="text-xs sm:text-sm text-blue-200 leading-relaxed px-4"
          >
            We're here when you need us.<br />
            Trusted by families and professionals worldwide.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};