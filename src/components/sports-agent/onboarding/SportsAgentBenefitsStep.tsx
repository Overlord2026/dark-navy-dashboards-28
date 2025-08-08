import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, FileText, DollarSign, GraduationCap, Heart } from 'lucide-react';

interface SportsAgentBenefitsStepProps {
  onNext: () => void;
}

export const SportsAgentBenefitsStep: React.FC<SportsAgentBenefitsStepProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: Users,
      title: "Manage Athlete Portfolios",
      description: "Centralized hub for all your athletes' profiles, contracts, and performance data"
    },
    {
      icon: Trophy,
      title: "Track Contracts & NIL Deals",
      description: "Comprehensive tracking and management of all athlete agreements and endorsements"
    },
    {
      icon: FileText,
      title: "Secure Vault for Sensitive Documents",
      description: "Bank-level security for contracts, medical records, and confidential athlete information"
    },
    {
      icon: DollarSign,
      title: "Financial Wellness Dashboard",
      description: "Monitor athlete finances, investments, and help plan for post-career financial security"
    },
    {
      icon: GraduationCap,
      title: "Premium Athlete Education",
      description: "Access to courses on financial literacy, career planning, and personal development"
    },
    {
      icon: Heart,
      title: "Health & Wellness Tools",
      description: "Track athlete health metrics, injury prevention, and connect with healthcare providers"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Your Sports Agency Command Center
        </h2>
        <p className="text-xl text-muted-foreground">
          Discover how BFO transforms the way you manage athletes and grow your practice
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="h-full hover-scale">
            <CardHeader className="text-center">
              <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                {benefit.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg" 
          className="px-8 py-4 font-semibold"
        >
          Get Started - It's Free!
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required • Premium features available after setup
        </p>
      </div>
    </div>
  );
};