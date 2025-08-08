import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check,
  X,
  Target,
  Star,
  ArrowRight
} from 'lucide-react';

interface CoachPricingStepProps {
  onNext: () => void;
}

export const CoachPricingStep: React.FC<CoachPricingStepProps> = ({ onNext }) => {
  const pricingTiers = [
    {
      name: 'Basic',
      icon: Star,
      price: '$39',
      period: '/month',
      description: 'Perfect for solo coaches starting out',
      features: [
        { name: 'Up to 10 clients', included: true },
        { name: 'Document vault & sharing', included: true },
        { name: 'Basic KPI tracking', included: true },
        { name: 'Communication hub', included: true },
        { name: 'Appointment scheduler', included: true },
        { name: 'Unlimited clients & KPI trackers', included: false },
        { name: 'AI Lead-to-Sales Engine', included: false },
        { name: 'Automated progress reports', included: false },
        { name: 'Branded portal customization', included: false },
        { name: 'Payment collection integration', included: false },
        { name: 'Advanced analytics & predictions', included: false }
      ],
      cta: 'Start Basic Plan'
    },
    {
      name: 'Premium',
      icon: Target,
      price: '$99',
      period: '/month',
      description: 'Complete platform for growing coaching businesses',
      popular: true,
      features: [
        { name: 'Up to 10 clients', included: true },
        { name: 'Document vault & sharing', included: true },
        { name: 'Basic KPI tracking', included: true },
        { name: 'Communication hub', included: true },
        { name: 'Appointment scheduler', included: true },
        { name: 'Unlimited clients & KPI trackers', included: true },
        { name: 'AI Lead-to-Sales Engine', included: true },
        { name: 'Automated progress reports', included: true },
        { name: 'Branded portal customization', included: true },
        { name: 'Payment collection integration', included: true },
        { name: 'Marketing campaign manager', included: true },
        { name: 'Referral leaderboard & wallet', included: true },
        { name: 'Advanced analytics & predictions', included: true }
      ],
      cta: 'Start Premium Plan'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Select Your Tier</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your coaching business needs
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
          14-day free trial • Cancel anytime • Enterprise options available
        </p>
        <Button 
          onClick={onNext}
          size="lg"
          variant="outline"
        >
          Continue to Client Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};