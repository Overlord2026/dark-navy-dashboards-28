import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check,
  X,
  Crown,
  Star,
  ArrowRight
} from 'lucide-react';

interface ElitePricingStepProps {
  onNext: () => void;
}

export const ElitePricingStep: React.FC<ElitePricingStepProps> = ({ onNext }) => {
  const pricingTiers = [
    {
      name: 'Basic',
      icon: Star,
      price: '$299',
      period: '/month',
      description: 'Essential tools for smaller family offices',
      features: [
        { name: 'Manage up to 3 client families', included: true },
        { name: 'Basic compliance reminders', included: true },
        { name: 'Basic vault storage (up to 5GB)', included: true },
        { name: 'Document sharing with clients', included: true },
        { name: 'Unlimited client family dashboards', included: false },
        { name: 'Advanced compliance automation', included: false },
        { name: 'AI Concierge with task automation', included: false },
        { name: 'White-label branding', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority VIP support', included: false }
      ],
      cta: 'Start Basic Plan'
    },
    {
      name: 'Premium',
      icon: Crown,
      price: '$899',
      period: '/month',
      description: 'Complete platform for elite family offices',
      popular: true,
      features: [
        { name: 'Manage up to 3 client families', included: true },
        { name: 'Basic compliance reminders', included: true },
        { name: 'Basic vault storage (up to 5GB)', included: true },
        { name: 'Document sharing with clients', included: true },
        { name: 'Unlimited client family dashboards', included: true },
        { name: 'Full Business & Entity Management module', included: true },
        { name: 'Advanced compliance automation', included: true },
        { name: 'AI Concierge with task automation', included: true },
        { name: 'White-label branding', included: true },
        { name: 'Advanced analytics & portfolio scoring', included: true },
        { name: 'Priority VIP support', included: true }
      ],
      cta: 'Start Premium Plan'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Select the tier that matches your family office's needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {pricingTiers.map((tier, index) => (
          <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg' : 'border-muted'}`}>
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  tier.popular 
                    ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <tier.icon className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="text-3xl font-bold mt-4">
                {tier.price}<span className="text-base font-normal text-muted-foreground">{tier.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                className={`w-full mt-6 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' 
                    : ''
                }`}
                variant={tier.popular ? 'default' : 'outline'}
              >
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          All plans include 14-day free trial • Cancel anytime • Enterprise options available
        </p>
        <Button 
          onClick={onNext}
          size="lg"
          variant="outline"
        >
          Continue Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};