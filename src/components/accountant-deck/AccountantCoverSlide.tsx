import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccountantCoverSlideProps {
  presentationMode?: boolean;
}

export const AccountantCoverSlide: React.FC<AccountantCoverSlideProps> = ({
  presentationMode
}) => {
  const features = [
    { name: 'Empower', icon: Users, color: 'text-blue-500' },
    { name: 'Clients', icon: Building2, color: 'text-green-500' },
    { name: 'Grow', icon: TrendingUp, color: 'text-purple-500' },
    { name: 'Practice', icon: Calculator, color: 'text-orange-500' },
  ];

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-green-50 via-background to-blue-50 p-8 md:p-16">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] bg-[length:24px_24px]" />
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
              <Badge className="mb-4 bg-green-100 text-green-800" variant="secondary">
                Boutique Family Office™ Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transforming{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Accounting
                </span>{' '}
                Practices
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-muted-foreground mt-4 font-medium">
                Empower Clients. Grow Your Practice.
              </h2>
              
              <p className="text-lg text-muted-foreground mt-4">
                With the Boutique Family Office Platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed">
                Move beyond traditional compliance work to become your clients' most trusted advisor. 
                Our integrated platform helps you offer holistic financial planning, tax optimization, 
                and wealth management services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Transformation
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Feature Icons */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.name === 'Empower' && 'Transform client relationships'}
                    {feature.name === 'Clients' && 'Deliver comprehensive value'}
                    {feature.name === 'Grow' && 'Expand service offerings'}
                    {feature.name === 'Practice' && 'Increase revenue streams'}
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
                stroke="url(#accountantGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <defs>
                <linearGradient id="accountantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom Value Proposition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-xl font-medium text-green-800">
              From Tax Preparer to Trusted Advisor
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Comprehensive wealth planning, tax optimization, and client growth tools
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};