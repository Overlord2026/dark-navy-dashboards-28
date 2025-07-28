import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, CreditCard, Calendar, Shield, Bot, Users, FileText } from "lucide-react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface BillPayOnboardingProps {
  onComplete: () => void;
}

export const BillPayOnboarding: React.FC<BillPayOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  
  const hasPremiumAccess = checkFeatureAccess('bill_pay_premium');
  
  const steps = [
    {
      title: "Welcome to Bill Pay",
      description: "Streamline your bill management with smart automation",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Basic Tier
                  <Badge variant="secondary">Free</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Manual bill entry & tracking
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Payment reminders
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic categorization
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Premium Tier
                  <Badge variant="outline">Upgrade</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Bank sync via Plaid
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Stripe-powered payments
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  AI bill analysis & negotiation
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Concierge support
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Security & Privacy",
      description: "Your financial data is protected with bank-level security",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">256-bit Encryption</h3>
                <p className="text-sm text-muted-foreground">Bank-level security</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">SOC 2 Compliant</h3>
                <p className="text-sm text-muted-foreground">Audited security controls</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">Privacy by design</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Your data is protected:</h4>
            <ul className="space-y-1 text-sm">
              <li>• All payment information is tokenized and encrypted</li>
              <li>• We never store your banking credentials</li>
              <li>• Full audit trail of all transactions</li>
              <li>• Granular permission controls for family/team access</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Setup Complete",
      description: "You're ready to start managing your bills!",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold">Ready to Go!</h3>
          <p className="text-muted-foreground">
            {hasPremiumAccess 
              ? "You have access to all premium features including automated payments and AI analysis."
              : "You can start with manual bill tracking and upgrade anytime for automated features."
            }
          </p>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Progress value={progress} className="mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <currentStepData.icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStepData.content}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};