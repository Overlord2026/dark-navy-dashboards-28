import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trophy, BarChart3, Shield, Users, Zap, Crown } from 'lucide-react';

interface SportsAgentUpgradeStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SportsAgentUpgradeStep: React.FC<SportsAgentUpgradeStepProps> = ({ 
  onNext, 
  onPrevious 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  const basicFeatures = [
    "3 Athlete Profiles",
    "10 Contract Uploads",
    "Secure Messaging with Athletes",
    "Athlete Education Hub Access",
    "Simple Deadline Reminders",
    "Basic Document Storage"
  ];

  const premiumFeatures = [
    "Unlimited Athletes",
    "Unlimited Contracts & NIL Deals",
    "NIL Deal Tracker & Analytics",
    "Sponsorship ROI Tools", 
    "Advanced Compliance Calendar",
    "Athlete Health & Wellness Portal",
    "Post-Career Transition Planning",
    "Multi-Athlete Team Analytics",
    "Custom Athlete Dashboards",
    "Priority Support & Training"
  ];

  const premiumOnlyFeatures = [
    {
      icon: Trophy,
      title: "NIL Deal Tracker & Analytics",
      description: "Track all Name, Image & Likeness deals with revenue analytics"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Multi-athlete performance, revenue, and ROI tracking"
    },
    {
      icon: Shield,
      title: "Advanced Compliance Tools",
      description: "Automated compliance calendar with state-by-state requirements"
    },
    {
      icon: Users,
      title: "Athlete Health & Wellness Portal",
      description: "Comprehensive health tracking and wellness resources"
    }
  ];

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Choose Your Sports Agent Plan
        </h2>
        <p className="text-xl text-muted-foreground">
          Start free, upgrade anytime to unlock advanced features
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Basic Plan */}
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPlan === 'basic' 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedPlan('basic')}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Basic Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </div>
              <Badge variant="secondary">Free</Badge>
            </div>
            <div className="text-3xl font-bold text-primary">
              $0<span className="text-lg font-normal text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full mt-6 ${selectedPlan === 'basic' ? '' : 'opacity-60'}`}
              variant={selectedPlan === 'basic' ? 'default' : 'outline'}
            >
              {selectedPlan === 'basic' ? 'Selected' : 'Select Basic'}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card 
          className={`cursor-pointer transition-all relative ${
            selectedPlan === 'premium' 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelectedPlan('premium')}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-primary text-white px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>Full-featured sports agency platform</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Best Value
              </Badge>
            </div>
            <div className="text-3xl font-bold text-primary">
              $149<span className="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              7-day free trial • Cancel anytime
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full mt-6 ${selectedPlan === 'premium' ? '' : 'opacity-60'}`}
              variant={selectedPlan === 'premium' ? 'default' : 'outline'}
            >
              {selectedPlan === 'premium' ? 'Selected' : 'Start 7-Day Trial'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Showcase */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Premium Features Preview
          </CardTitle>
          <CardDescription>
            Unlock these advanced tools with Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {premiumOnlyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          className="px-8"
        >
          {selectedPlan === 'premium' ? 'Start Premium Trial' : 'Continue with Basic'}
        </Button>
      </div>
    </div>
  );
};