import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Crown,
  ArrowRight,
  Home
} from 'lucide-react';

interface RealtorBenefitsStepProps {
  onNext: () => void;
}

export const RealtorBenefitsStep: React.FC<RealtorBenefitsStepProps> = ({ onNext }) => {
  const benefits = [
    {
      icon: Building2,
      title: 'Manage All Properties in One Place',
      description: 'Residential, commercial, rentals, and land — track details, documents, and valuations'
    },
    {
      icon: Users,
      title: 'Client Portal Access',
      description: 'Give clients secure, branded portals to view their listings, documents, and updates'
    },
    {
      icon: TrendingUp,
      title: 'Integrated Marketing Engine',
      description: 'Launch and track campaigns directly from your dashboard'
    },
    {
      icon: Calendar,
      title: 'Automated Reminders & Compliance',
      description: 'Never miss a filing, inspection, or renewal'
    },
    {
      icon: Crown,
      title: 'Premium Tools for Growth',
      description: 'Upgrade for lead-to-sale automation, analytics, and unlimited client seats'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Home className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">Realtor & Property Manager</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Digital Command Center</h1>
        <p className="text-lg text-muted-foreground">
          Discover how to manage properties, grow your business, and deliver exceptional client experiences
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
              Built specifically for real estate professionals
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Secure, compliant document management
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Seamless client collaboration tools
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Scalable from solo agent to large team
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
          Let's Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};