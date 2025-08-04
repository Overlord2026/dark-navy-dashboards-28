import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface WelcomeBannerProps {
  currentStep: number;
}

export const WelcomeBanner = ({ currentStep }: WelcomeBannerProps) => {
  const totalSteps = 7;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-primary via-primary-glow to-accent p-8 rounded-2xl text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold">BFO Mass Onboarding & Book Migration Center</h1>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
            Beta
          </Badge>
        </div>
        
        <p className="text-xl text-white/90 mb-6">
          🎉 Welcome to the BFO Family Office Platform – Seamless Onboarding Starts Here!
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/80">
            <span>Onboarding Progress</span>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </div>
      </div>
    </motion.div>
  );
};