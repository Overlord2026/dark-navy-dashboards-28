import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Building2,
  FileCheck,
  Vault,
  Bot,
  Palette,
  ArrowRight,
  Crown
} from 'lucide-react';

interface EliteBenefitsStepProps {
  onNext: () => void;
}

export const EliteBenefitsStep: React.FC<EliteBenefitsStepProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: Users,
      title: 'Multi-Client Oversight',
      description: 'View and manage all client dashboards from one control panel'
    },
    {
      icon: Building2,
      title: 'Entity & Property Integration',
      description: 'Link entities, properties, and assets for a clear ownership picture'
    },
    {
      icon: FileCheck,
      title: 'Advanced Compliance',
      description: 'Automated filing calendars and alerts for every client'
    },
    {
      icon: Vault,
      title: 'Secure Document Vault',
      description: 'Encrypted storage for legal, tax, and investment records'
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Virtual assistant to coordinate meetings, reminders, and reports'
    },
    {
      icon: Palette,
      title: 'White-Label Experience',
      description: 'Brand the portal for your family office'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">Elite Family Office Executive</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Command Center</h1>
        <p className="text-lg text-muted-foreground">
          Discover the premium tools designed for multi-generational wealth management
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

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          Explore Tools
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};