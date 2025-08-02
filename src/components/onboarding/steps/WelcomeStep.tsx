import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Shield, Zap, Users } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface WelcomeStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  brandSettings?: {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
    welcomeMessage?: string;
  };
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  data,
  onComplete,
  onNext,
  brandSettings
}) => {
  const handleStartOnboarding = () => {
    const welcomeData = {
      welcome: {
        brandSettings,
        startedAt: new Date().toISOString(),
      }
    };
    
    onComplete(welcomeData);
  };

  const companyName = brandSettings?.companyName || 'Our Firm';
  const welcomeMessage = brandSettings?.welcomeMessage || 
    `Welcome to ${companyName}! We're excited to help you begin your wealth management journey.`;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        {brandSettings?.logo && (
          <div className="flex justify-center mb-6">
            <img 
              src={brandSettings.logo} 
              alt={`${companyName} Logo`}
              className="h-16 w-auto"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-display font-bold text-foreground">
          Welcome to {companyName}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {welcomeMessage}
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

      {/* Process Overview */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Personal Information</h4>
                <p className="text-muted-foreground">Tell us about yourself and your household members.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Choose Your Custodian</h4>
                <p className="text-muted-foreground">Select where you'd like to custody your assets (Schwab, Fidelity, etc.).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Upload Documents</h4>
                <p className="text-muted-foreground">Securely upload statements and identification documents.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Digital Applications</h4>
                <p className="text-muted-foreground">Complete and sign your account applications electronically.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald text-emerald-foreground rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Welcome Call</h4>
                <p className="text-muted-foreground">Schedule your first meeting with your advisor.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <Button 
          onClick={handleStartOnboarding}
          size="lg"
          className="btn-primary-gold text-lg px-8 py-3"
        >
          Start Your Onboarding Journey
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Need help? Our AI assistant Linda is here to guide you through every step.
        </p>
        
        <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            15-20 minutes
          </span>
          <span>•</span>
          <span>FINRA Regulated</span>
        </div>
      </div>
    </div>
  );
};