import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, ArrowRight, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CompletionStepProps {
  data: any;
  onComplete: (data: any) => void;
  currentStep: number;
  totalSteps: number;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  data,
  onComplete,
  currentStep,
  totalSteps
}) => {
  React.useEffect(() => {
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const quickActions = [
    {
      icon: Users,
      title: 'Browse Expert Marketplace',
      description: 'Discover vetted professionals',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Explore Learning Center',
      description: 'Access educational resources',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'View Dashboard',
      description: 'See your financial overview',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Calendar,
      title: 'Schedule a Call',
      description: 'Book time with our team',
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Progress Complete */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Step {currentStep} of {totalSteps}</span>
        <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-full transition-all duration-300" />
        </div>
        <CheckCircle className="w-4 h-4 text-green-500" />
      </div>

      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Family Office!</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You're all set up and ready to explore. Your financial journey starts here.
          </p>
        </motion.div>
      </div>

      {/* What's Available */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            You now have access to:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Complete financial dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Expert marketplace browsing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Educational resource library</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Family collaboration tools</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">What would you like to do first?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="cursor-pointer hover:border-primary/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade Notice */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">Upgrade to Premium Anytime</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Unlock exclusive opportunities, private market access, and dedicated advisor support.
              </p>
              <Badge variant="secondary" className="text-xs">
                No pressure • Upgrade when ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center pt-4"
      >
        <Button
          size="lg"
          onClick={() => onComplete(data)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-4 text-lg"
        >
          Enter Your Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};