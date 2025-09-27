import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const familyPlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Basic financial overview',
      'Goal tracking (up to 3 goals)',
      'Document storage (10 files)',
      'Educational resources access',
      'Community support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Premium',
    monthlyPrice: 15,
    annualPrice: 144,
    features: [
      'Unlimited goal tracking',
      'Advanced portfolio analytics',
      'Priority support',
      'Document storage (200 files)',
      'Tax planning tools'
    ],
    cta: 'Start Premium Trial',
    popular: true
  },
  {
    name: 'Pro',
    monthlyPrice: 39,
    annualPrice: 372,
    features: [
      'All Premium features',
      'Advanced estate planning',
      'Multi-account aggregation',
      'Unlimited document storage',
      'Dedicated account manager'
    ],
    cta: 'Go Pro',
    popular: false
  }
];

export function FamilyPlans() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Family Plans</h2>
          <p className="text-muted-foreground mb-8">Choose the perfect plan for your family's financial journey</p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {familyPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                plan.popular
                  ? 'ring-2 ring-foreground scale-105'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-foreground text-background px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.monthlyPrice === 0 ? '' : isAnnual ? '/year' : '/month'}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FamilyPlans;