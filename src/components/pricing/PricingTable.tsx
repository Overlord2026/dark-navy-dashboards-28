import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '@/config/tiers';

export function PricingTable() {
  const navigate = useNavigate();

  const handlePlanSelect = (plan: string) => {
    navigate(`/pricing/checkout?plan=${plan}`);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Essential tools to get started',
      features: [
        'Basic portfolio tracking',
        'Educational resources',
        'Community access',
        'Basic reporting',
        'Mobile app access',
        `Document vault: ${TIERS.FREE.vaultQuota.files} files, ${TIERS.FREE.vaultQuota.mb}MB`,
        'No account aggregation'
      ],
      buttonText: 'Get Started',
      popular: false,
      variableCost: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99',
      period: '/month',
      description: 'Advanced features for serious investors',
      features: [
        'Everything in Free',
        'Advanced analytics',
        'Tax optimization tools',
        'Portfolio modeling',
        'Priority support',
        'API access',
        'Custom reports',
        `Account aggregation (up to ${TIERS.PREMIUM.aggLimit} accounts)`,
        `Document vault: ${TIERS.PREMIUM.vaultQuota.files} files, ${TIERS.PREMIUM.vaultQuota.mb}MB`
      ],
      buttonText: 'Choose Premium',
      popular: true,
      variableCost: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$299',
      period: '/month',
      description: 'Full family office experience',
      features: [
        'Everything in Premium',
        'Dedicated advisor access',
        'White-label options',
        'Family office services',
        'Custom integrations',
        '24/7 concierge support',
        `Account aggregation (up to ${TIERS.PRO.aggLimit} accounts)`,
        `Document vault: ${TIERS.PRO.vaultQuota.files} files, ${TIERS.PRO.vaultQuota.mb/1024}GB`
      ],
      buttonText: 'Choose Pro',
      popular: false,
      variableCost: true
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your family office needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border transition-all hover:shadow-lg ${
                plan.popular 
                  ? 'border-brand-gold ring-2 ring-brand-gold/20' 
                  : 'border-border hover:border-brand-gold/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-gold text-brand-black px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-brand-gold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.id === 'free'
                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                      : 'bg-brand-gold hover:bg-brand-gold/90 text-brand-black'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.buttonText}
                </Button>

                {plan.variableCost && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    *Usage-based features may incur additional costs
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include SSL security, regular backups, and mobile access
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom solution? <button className="text-brand-gold hover:underline">Contact our sales team</button>
          </p>
        </div>
      </div>
    </section>
  );
}