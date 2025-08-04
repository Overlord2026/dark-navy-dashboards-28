import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  ArrowRight,
  BookOpen,
  HeadphonesIcon,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface AdvisorOnboardingBannerProps {
  onDismiss: () => void;
  onImportPlans: () => void;
}

export function AdvisorOnboardingBanner({ onDismiss, onImportPlans }: AdvisorOnboardingBannerProps) {
  const handleScheduleOnboarding = () => {
    toast.success('Onboarding call scheduled! Check your email for calendar invite.');
    window.open('https://calendly.com/plan-migration-onboarding', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 border-2">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Already using another retirement tool?
                  </h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New Feature
                  </Badge>
                </div>
                <p className="text-blue-700 mb-4 max-w-2xl">
                  Instantly migrate your existing plans to unlock the full power of our platform—analytics, 
                  scenarios, compliance, and more. Import from MoneyGuidePro, eMoney, RightCapital, or any CSV/PDF.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={onImportPlans}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Plans Now
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleScheduleOnboarding}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <HeadphonesIcon className="h-4 w-4 mr-2" />
                    Schedule White-Glove Onboarding
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => toast.info('Opening migration training...')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Training Guide
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="text-blue-400 hover:text-blue-600 hover:bg-blue-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}