import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Sparkles, Users, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompletionStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const handleLaunchDashboard = () => {
    onComplete({
      completion: {
        completedAt: new Date().toISOString(),
        launchedToDashboard: true
      }
    });
  };

  const getPersonalizedMessage = () => {
    const hasAccounts = data?.assetLinking && !data.assetLinking.skipped;
    const hasGoals = data?.familyGoals && data.familyGoals.selectedGoals?.length > 0;
    const hasCall = data?.welcomeCall?.choice === 'book-call';

    let message = "You're all set to explore your new command center! ";
    
    if (hasAccounts && hasGoals) {
      message += "With your accounts connected and goals defined, you're ready to track your complete financial picture.";
    } else if (hasAccounts) {
      message += "Your connected accounts will help you see the complete picture of your wealth.";
    } else if (hasGoals) {
      message += "Your defined goals will guide our recommendations and insights.";
    } else {
      message += "You can add accounts and set goals anytime from your dashboard.";
    }

    if (hasCall) {
      message += " We'll see you soon on your welcome call!";
    }

    return message;
  };

  const quickActions = [
    {
      icon: TrendingUp,
      title: "View Net Worth",
      description: "See your complete financial picture",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Shield,
      title: "Secure Vault",
      description: "Upload important documents",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Browse trusted professionals",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-bold text-foreground">Welcome to Your Family Office!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {getPersonalizedMessage()}
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Actions to Get Started
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Features Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground text-lg mb-4">Remember: You're Always in Control</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Complete Privacy</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">Your data is encrypted and never shared without permission</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">No Sales Pressure</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">Explore features and upgrade only when it makes sense</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Fiduciary Standard</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">All recommendations are in your best interest</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Always Improving</span>
                </div>
                <p className="text-muted-foreground text-xs ml-6">Regular updates and new features based on your feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Launch Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center pt-6"
      >
        <Button
          onClick={handleLaunchDashboard}
          className="btn-primary-gold text-lg px-8 py-6 flex items-center gap-3 mx-auto"
          size="lg"
        >
          Launch Your Dashboard
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <p className="text-sm text-muted-foreground mt-3">
          Ready to take control of your financial future?
        </p>
      </motion.div>
    </motion.div>
  );
};