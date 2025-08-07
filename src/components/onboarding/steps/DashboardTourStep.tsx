import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, BarChart3, Shield, Users, ShoppingBag, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Welcome to Your Command Center</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Here's what you can explore right away—no commitment required. Add what you want, when you want.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 mt-8">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-foreground">The Best Part?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <p className="font-medium">Complete Privacy</p>
                <p className="text-muted-foreground">Your data stays yours</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="w-6 h-6 text-accent" />
                <p className="font-medium">No Sales Pressure</p>
                <p className="text-muted-foreground">Explore at your pace</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <p className="font-medium">Add Value When Ready</p>
                <p className="text-muted-foreground">Upgrade only if it helps</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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