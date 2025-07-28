import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Building, Users, TrendingUp, Shield, FileText, MapPin } from "lucide-react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

interface PropertyOnboardingProps {
  onComplete: () => void;
}

export const PropertyOnboarding: React.FC<PropertyOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { subscriptionPlan, checkFeatureAccess } = useSubscriptionAccess();
  
  const hasPremiumAccess = checkFeatureAccess('premium_property_features');
  
  const steps = [
    {
      title: "Welcome to Property Management",
      description: "Organize, track, and optimize your real estate portfolio",
      icon: Building,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Features
                  <Badge variant="secondary">Free</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Up to 3 properties
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Manual entry & basic tracking
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Document uploads
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic reminders
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Premium Features
                  <Badge variant="outline">Upgrade</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Unlimited properties
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Rental analytics & cash flow
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Agent & manager invites
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Advanced analytics dashboard
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Marketplace connections
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Smart Property Tools",
      description: "Automate management with intelligent features",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Document Vault</h3>
                <p className="text-sm text-muted-foreground">Secure storage with sharing controls</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Value Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor equity and market values</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Team Access</h3>
                <p className="text-sm text-muted-foreground">Collaborate with agents & managers</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Smart Reminders Include:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Lease renewal notifications</li>
              <li>• Insurance policy expirations</li>
              <li>• Property tax due dates</li>
              <li>• Maintenance schedule alerts</li>
              <li>• Market valuation updates</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Get Started",
      description: "Your property portfolio awaits!",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold">Ready to Manage!</h3>
          <p className="text-muted-foreground">
            {hasPremiumAccess 
              ? "You have access to all premium property management features including unlimited properties and advanced analytics."
              : "Start with up to 3 properties and upgrade anytime for unlimited access and advanced features."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center">
              <Building className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Add Properties</span>
            </div>
            <div className="flex flex-col items-center">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Upload Documents</span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Track Performance</span>
            </div>
          </div>
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
          {currentStep === steps.length - 1 ? "Enter Dashboard" : "Next"}
        </Button>
      </div>
    </div>
  );
};