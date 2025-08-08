import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Shield, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoverSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const CoverSlide: React.FC<CoverSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const phases = [
    { name: 'Income Now', icon: Shield, color: 'text-emerald-500', years: '1-2' },
    { name: 'Income Later', icon: TrendingUp, color: 'text-blue-500', years: '3-12' },
    { name: 'Growth', icon: Target, color: 'text-purple-500', years: '12+' },
    { name: 'Legacy', icon: Gift, color: 'text-amber-500', years: 'Ongoing' },
  ];

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Title & Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4" variant="secondary">
                Strategic Wealth Alpha GPS™
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SWAG™
                </span>{' '}
                Retirement Roadmap
              </h1>
              
              <p className="text-xl text-muted-foreground mt-4">
                Guiding Clients to Retire Once… and Stay Retired™
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-lg leading-relaxed">
                In today's complex financial world, clients want clarity, security, and control. 
                The SWAG™ Retirement Roadmap, powered by our GPS™ Planning Engine, gives you 
                the ability to deliver all three — with precision scenario modeling, stress testing, 
                and a customized plan your clients can access anytime.
              </p>
              
              {liveDemoMode && (
                <Button size="lg" className="mt-6">
                  Launch Live Demo Portal
                </Button>
              )}
            </motion.div>
          </div>

          {/* Right Column - Dynamic Path Graphic */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Dynamic Path */}
              <div className="relative">
                <svg
                  className="w-full h-80"
                  viewBox="0 0 400 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Curved Path */}
                  <motion.path
                    d="M50 280 Q 100 200, 150 220 T 250 180 T 350 120"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Phase Milestones */}
                {phases.map((phase, index) => {
                  const positions = [
                    { x: 50, y: 280 },
                    { x: 150, y: 220 },
                    { x: 250, y: 180 },
                    { x: 350, y: 120 },
                  ];
                  
                  return (
                    <motion.div
                      key={phase.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(positions[index].x / 400) * 100}%`,
                        top: `${(positions[index].y / 320) * 100}%`,
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full bg-background border-2 border-current ${phase.color} shadow-lg`}>
                          <phase.icon className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm">{phase.name}</div>
                          <div className="text-xs text-muted-foreground">Years {phase.years}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-semibold text-muted-foreground">
            Powered by GPS™ Planning Engine
          </p>
        </motion.div>
      </div>
    </div>
  );
};