import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const advisorPlans = [
  {
    name: 'Basic',
    price: 99,
    features: [
      'Client management dashboard',
      'Portfolio tracking for up to 25 clients',
      'Basic reporting and analytics',
      'Email support',
      'Compliance tracking tools'
    ],
    cta: 'Start Basic Plan',
    popular: false
  },
  {
    name: 'Premium',
    price: 249,
    features: [
      'Everything in Basic',
      'Unlimited client management',
      'Advanced portfolio analytics',
      'Custom branded reports',
      'Priority phone support',
      'API integrations',
      'Advanced compliance suite'
    ],
    cta: 'Go Premium',
    popular: true
  }
];

export function AdvisorSolo() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Advisor Solo Plans</h2>
          <p className="text-muted-foreground">Professional tools for independent financial advisors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {advisorPlans.map((plan) => (
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
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
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

              <CardFooter className="space-y-3">
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
                <Button variant="ghost" className="w-full text-sm">
                  Schedule Consultation
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdvisorSolo;