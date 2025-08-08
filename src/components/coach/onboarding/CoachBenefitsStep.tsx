import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  BarChart3,
  Shield,
  Crown,
  Target,
  ArrowRight
} from 'lucide-react';

interface CoachBenefitsStepProps {
  onNext: () => void;
}

export const CoachBenefitsStep: React.FC<CoachBenefitsStepProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: Users,
      title: 'Client Management Simplified',
      description: 'All client profiles, documents, and communications in one place'
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      description: 'Custom KPIs, goal tracking, and automated progress reports'
    },
    {
      icon: Shield,
      title: 'Branded Client Portal',
      description: 'Offer a secure, professional platform for your clients'
    },
    {
      icon: Crown,
      title: 'Premium Growth Tools',
      description: 'AI-driven lead generation, marketing automation, and revenue tracking'
    },
    {
      icon: Target,
      title: 'Referral System',
      description: 'Grow your network with built-in referral rewards'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">Business Coach & Consultant</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Practice Management Platform</h1>
        <p className="text-lg text-muted-foreground">
          Discover the tools that will transform how you manage clients and grow your coaching business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3">Why Choose Our Platform?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Built specifically for coaches and consultants
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Secure, compliant client data management
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Automated progress tracking and reporting
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Professional-grade client portals
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Scalable from solo practice to team
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Built-in marketing and referral tools
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          Start Building Your Practice
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};