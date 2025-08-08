import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Crown, 
  Star, 
  ArrowRight, 
  Users, 
  FileText,
  TrendingUp,
  Bot,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AttorneyGetStartedStep: React.FC = () => {
  const basicFeatures = [
    'Up to 10 clients',
    'Basic case management tools',
    'Basic CLE tracking',
    'Marketplace access',
    'Communications hub'
  ];

  const premiumFeatures = [
    'Unlimited clients & storage',
    'Advanced CLE tracking with state rules',
    'Estate planning integration',
    'AI document drafting assistance',
    'Lead-to-Sales Marketing Engine',
    'Advanced compliance calendar',
    'Analytics & reporting',
    'Premium concierge support'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">
          Choose Your Practice Plan
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Start with our free tier or unlock the full potential of your legal practice with Premium. 
          You can upgrade anytime as your needs grow.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="h-full border-green-200">
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-4 bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                Free
              </Badge>
              <CardTitle className="text-2xl">Basic Plan</CardTitle>
              <div className="text-3xl font-bold text-green-600">$0</div>
              <p className="text-sm text-muted-foreground">Perfect for getting started</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Start Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                No credit card required • Upgrade anytime
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="h-full border-primary ring-2 ring-primary/20 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-primary to-primary/80 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Premium
              </Badge>
              <CardTitle className="text-2xl">Premium Plan</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold">$79</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="flex items-center justify-center text-sm">
                <Gift className="w-4 h-4 mr-2 text-primary" />
                <span className="text-primary font-medium">30-day free trial</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Schedule Demo
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • No setup fees
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};