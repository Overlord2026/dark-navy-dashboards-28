import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Home, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoverSlideFamilyProps {
  presentationMode?: boolean;
}

export const CoverSlideFamily: React.FC<CoverSlideFamilyProps> = ({
  presentationMode
}) => {
  const familyValues = [
    { name: 'Protect', icon: Shield, color: 'text-blue-500' },
    { name: 'Grow', icon: Home, color: 'text-green-500' },
    { name: 'Enjoy', icon: Heart, color: 'text-red-500' },
    { name: 'Legacy', icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-blue-50 via-background to-purple-50 p-8 md:p-16">
      {/* Warm Family Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Message */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800" variant="secondary">
                Boutique Family Office™
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Family's{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CFO
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-muted-foreground mt-4 font-medium">
                Protect, Grow, and Enjoy Your Wealth for Life
              </h2>
              
              <p className="text-lg text-muted-foreground mt-4">
                Powered by the SWAG™ Retirement Roadmap & Scenario Modeling Tools
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed">
                Every major company has a CFO. Every family deserves one too — backed by the tools, 
                planning, and experts to protect your health, wealth, and legacy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Your Roadmap
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Family Values Visualization */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              {familyValues.map((value, index) => (
                <motion.div
                  key={value.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center ${value.color}`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {value.name === 'Protect' && 'Secure your foundation'}
                    {value.name === 'Grow' && 'Build lasting wealth'}
                    {value.name === 'Enjoy' && 'Live your best life'}
                    {value.name === 'Legacy' && 'Impact generations'}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Connecting Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 300"
              fill="none"
            >
              <motion.path
                d="M75 75 L225 75 L225 225 L75 225 Z"
                stroke="url(#familyGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <defs>
                <linearGradient id="familyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-xl font-medium text-blue-800">
              Wealth, Health, Legacy in One Portal
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete family financial management without the 1% fee trap
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};