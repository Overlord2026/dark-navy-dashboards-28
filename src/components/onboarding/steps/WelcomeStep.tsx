import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Shield, Zap, Users } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface WelcomeStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext?: () => void;
  whiteLabelConfig?: any;
  referralInfo?: any;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  data,
  onComplete,
  onNext,
  whiteLabelConfig,
  referralInfo
}) => {
  const handleStartOnboarding = () => {
    const welcomeData = {
      welcome: {
        brandSettings: whiteLabelConfig,
        referralInfo,
        startedAt: new Date().toISOString(),
      }
    };
    
    onComplete(welcomeData);
  };

  const companyName = whiteLabelConfig?.companyName || 'Our Firm';
  const welcomeMessage = whiteLabelConfig?.welcomeMessage || 
    `Welcome to ${companyName}! We're excited to help you begin your wealth management journey.`;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        {whiteLabelConfig?.logoUrl && (
          <div className="flex justify-center mb-6">
            <img 
              src={whiteLabelConfig.logoUrl} 
              alt={`${companyName} Logo`}
              className="h-16 w-auto"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-display font-bold text-foreground">
          Welcome to Your Boutique Family Office™ Portal
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover a New Standard in Wealth & Well-being
        </p>
        
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Bank-Level Security & Encryption
          </Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="premium-card text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-lg">Quick & Easy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Complete your onboarding in just 15-20 minutes with our streamlined process.
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <Shield className="h-8 w-8 text-emerald" />
            </div>
            <CardTitle className="text-lg">Secure & Private</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your information is protected with bank-level security and encryption.
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-lg">Expert Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our team is here to help you every step of the way.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Overview */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-center">Here's what you can look forward to as you get started:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Complete Financial Picture</h4>
                <p className="text-muted-foreground">Securely view and manage all your accounts, investments, and important documents in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Total Privacy & Control</h4>
                <p className="text-muted-foreground">You choose what to share and when. No personal details are required until you decide to take action or become a client.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Trusted Advisors On-Demand</h4>
                <p className="text-muted-foreground">Connect instantly with vetted advisors, accountants, attorneys, and other professionals—always guided by our Fiduciary Duty Principles™.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Exclusive Opportunities & Services</h4>
                <p className="text-muted-foreground">Unlock curated investments, lending, insurance, healthcare, and concierge-level offerings—tailored for your needs.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Family Office Marketplace</h4>
                <p className="text-muted-foreground">Access premium solutions for your family, business, and legacy—all in one secure platform.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Ongoing Learning & Insights</h4>
                <p className="text-muted-foreground">Explore educational resources, proactive tax planning, and wellness tools to optimize your wealth and health journey.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="premium-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Getting Started is Simple:</h3>
            <p className="text-muted-foreground">Just set up your secure portal with your name and email. Everything else is up to you!</p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Ready to take control?</h3>
          <p className="text-muted-foreground">Press "Continue" to begin exploring. No commitment or sensitive info required to start!</p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleStartOnboarding}
            size="lg"
            className="btn-primary-gold text-lg px-8 py-3"
          >
            Continue
          </Button>
        </div>
        
        <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            SSL Encrypted
          </span>
          <span>•</span>
          <span>No Sensitive Info Required</span>
          <span>•</span>
          <span>FINRA Regulated</span>
        </div>
      </div>
    </div>
  );
};