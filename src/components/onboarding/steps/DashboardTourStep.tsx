import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, BarChart3, Shield, Users, ShoppingBag, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientPortalDashboard } from '@/components/client/ClientPortalDashboard';

interface DashboardTourStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const DashboardTourStep: React.FC<DashboardTourStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const features = [
    {
      icon: BarChart3,
      title: "Net Worth Dashboard",
      description: "View all your assets, accounts, and investments in real-time",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Shield,
      title: "Secure Digital Vault",
      description: "Store and organize important documents with bank-level security",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      title: "Family Management",
      description: "Manage family members, track goals, and plan for generations",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: ShoppingBag,
      title: "Expert Marketplace",
      description: "Connect with vetted advisors, attorneys, and professionals",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      icon: FileText,
      title: "Goal Tracking",
      description: "Set and monitor progress on retirement, estate, and tax goals",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      icon: TrendingUp,
      title: "Investment Opportunities",
      description: "Access exclusive deals and curated investment options",
      color: "text-rose-600",
      bgColor: "bg-rose-100"
    }
  ];

  const handleContinue = () => {
    onComplete({
      dashboardTour: {
        completed: true,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Step {currentStep} of {totalSteps}</span>
        <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Client Portal Demo */}
      <ClientPortalDashboard />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={handleContinue}
          className="flex items-center gap-2 btn-primary-gold"
        >
          Start Exploring
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};