import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Crown, 
  Star, 
  ArrowRight, 
  Users, 
  Calculator,
  TrendingUp,
  Bot,
  Gift,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AccountantGetStartedStep: React.FC = () => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const basicFeatures = [
    'Up to 10 clients',
    'Basic tax planning tools',
    'Basic entity tracking (3 entities)',
    'Manual CE tracking',
    'Marketplace access',
    'Basic communications'
  ];

  const premiumFeatures = [
    'Unlimited clients & storage',
    'Advanced tax planning suite',
    'AI Filing Helper & Copilot',
    'Lead-to-Sales Marketing Engine',
    'Entity visualization & ownership tracking',
    'Advanced analytics & reporting',
    'Premium concierge support',
    'Marketplace publisher access'
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
          Start with our free tier or unlock the full potential of your practice with Premium. 
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
              
              <GoldButton className="w-full">
                Start Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </GoldButton>
              
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
                <div className="text-3xl font-bold">$49</div>
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
                <GoldButton 
                  className="w-full"
                  onClick={() => setShowPremiumModal(true)}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GoldButton>
                
                <GoldOutlineButton className="w-full">
                  Schedule Demo
                </GoldOutlineButton>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • No setup fees
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Join 1,200+ CPAs Growing Their Practices
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Increase in client satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Improvement in efficiency</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3x</div>
                <p className="text-sm text-muted-foreground">ROI on marketing campaigns</p>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're just starting or ready to scale, our platform grows with your practice. 
              Join thousands of successful CPAs who've transformed their client experience.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Benefits Modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Crown className="w-6 h-6 mr-2 text-primary" />
              Premium Plan Benefits
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Unlimited Clients</span>
                </div>
                <div className="flex items-center">
                  <Calculator className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Advanced Tax Tools</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Marketing Engine</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Priority Support</span>
                </div>
                <div className="flex items-center">
                  <Gift className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">30-Day Free Trial</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-semibold mb-2">What you get with Premium:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scale to unlimited clients without restrictions</li>
                <li>• Generate more leads with automated marketing campaigns</li>
                <li>• Save hours with AI-powered filing and meeting summaries</li>
                <li>• Impress clients with advanced tax planning scenarios</li>
                <li>• Track entity relationships with visual family trees</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <GoldButton className="flex-1">
                Start 30-Day Free Trial
              </GoldButton>
              <GoldOutlineButton className="flex-1">
                Learn More
              </GoldOutlineButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};