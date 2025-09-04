import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, CreditCard, ArrowRight } from 'lucide-react';
import { playWelcome } from '@/utils/voiceAI';

interface PersonalizedDashboardTransitionProps {
  userName: string;
  onGoalSetup: () => void;
  onAccountLink: () => void;
}

export function PersonalizedDashboardTransition({ 
  userName, 
  onGoalSetup, 
  onAccountLink 
}: PersonalizedDashboardTransitionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Play personalized welcome
    const timer = setTimeout(() => {
      playWelcome(userName, 'Families');
      setShowContent(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [userName]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#001F3F' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.9 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl text-center space-y-8"
      >
        {/* Personalized Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="font-playfair font-bold text-white text-3xl md:text-4xl">
            Welcome, {userName}!
          </h1>
          <p className="text-xl text-white/90">
            Based on your info, here's your tailored path
          </p>
        </motion.div>

        {/* Action Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Set Your Goals Tile */}
          <Card 
            className="border-0 cursor-pointer transform hover:scale-105 transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
            }}
            onClick={onGoalSetup}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 31, 63, 0.1)' }}
              >
                <Star className="h-8 w-8 text-[#001F3F]" />
              </div>
              <h3 className="text-2xl font-bold text-[#001F3F]">
                Set Your Goals
              </h3>
              <p className="text-[#001F3F]/80 text-lg">
                Define your financial objectives and family aspirations
              </p>
              <Button 
                variant="outline"
                className="border-[#001F3F] text-[#001F3F] hover:bg-[#001F3F] hover:text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Link Accounts Tile */}
          <Card 
            className="border-0 cursor-pointer transform hover:scale-105 transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
              boxShadow: '0 10px 30px rgba(0, 31, 63, 0.3)'
            }}
            onClick={onAccountLink}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              >
                <CreditCard className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Link Accounts
              </h3>
              <p className="text-white/80 text-lg">
                Securely connect your financial accounts with Plaid
              </p>
              <Button 
                variant="outline"
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#001F3F]"
              >
                Connect Securely
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center items-center space-x-8 text-white/60 text-sm"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Bank-level Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>FDIC Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Private & Secure</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}