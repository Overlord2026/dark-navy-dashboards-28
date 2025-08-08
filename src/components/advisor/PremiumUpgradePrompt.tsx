import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  X,
  Target,
  Shield,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

interface PremiumUpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export const PremiumUpgradePrompt: React.FC<PremiumUpgradePromptProps> = ({
  isOpen,
  onClose,
  feature
}) => {
  const basicFeatures = [
    'Basic CRM & Client Management',
    'Secure Messaging & File Sharing',
    'Basic Investment Access',
    'Standard Support',
    'Basic Marketplace Listing'
  ];

  const premiumFeatures = [
    'AI-Powered Marketing Engine',
    'Advanced CRM & Segmentation',
    'Compliance & CE Tracking',
    'Advanced Analytics & Reports',
    'White-Label Client Portal',
    'Private Market Alpha Access',
    'Priority Support & Dedicated Rep',
    'Campaign Automation',
    'Custom Branding Options',
    'Advanced Integration Tools'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-base">
            Unlock the full power of {feature} and grow your practice faster
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          {/* Basic Plan */}
          <Card className="border-2 border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Basic Plan</CardTitle>
              <CardDescription>What you have now</CardDescription>
              <div className="text-3xl font-bold">Free</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
              
              <div className="pt-3 space-y-2 border-t">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Marketing Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Compliance Tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Premium Plan</CardTitle>
              </div>
              <CardDescription>Everything you need to scale</CardDescription>
              <div className="text-3xl font-bold">$199<span className="text-base font-normal">/month</span></div>
              <Badge className="w-fit mx-auto">Most Popular</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Lead Generation</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered campaigns that convert 340% better
            </p>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Compliance Made Easy</h3>
            <p className="text-sm text-muted-foreground">
              Automated tracking saves 10+ hours per month
            </p>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Growth Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Data-driven insights to grow 24% faster
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col md:flex-row gap-3 pt-6 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Continue with Basic
          </Button>
          <Button className="flex-1 gap-2" size="lg">
            <Crown className="h-4 w-4" />
            Start 14-Day Free Trial
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          No credit card required • Cancel anytime • Full access to all Premium features
        </p>
      </DialogContent>
    </Dialog>
  );
};