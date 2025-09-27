import { Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const legacyPlans = [
  {
    category: 'Family',
    plans: [
      {
        name: 'Free',
        price: 'Included',
        priceNote: 'Basic legacy tools',
        features: [
          'Will template generator',
          'Basic beneficiary tracking',
          'Document storage (estate docs)',
          'Educational resources'
        ]
      },
      {
        name: 'Premium',
        price: '+$9',
        priceNote: 'per month',
        features: [
          'Advanced will generator',
          'Trust planning tools',
          'Tax optimization strategies',
          'Family wealth dashboard',
          'Legacy goal tracking'
        ]
      },
      {
        name: 'Pro',
        price: '+$19',
        priceNote: 'per month',
        features: [
          'Comprehensive estate planning',
          'Multi-generational planning',
          'Tax-efficient strategies',
          'Trust administration tools',
          'Legacy preservation suite'
        ]
      }
    ]
  },
  {
    category: 'Advisor',
    plans: [
      {
        name: 'Basic',
        price: '+$29',
        priceNote: 'per month',
        features: [
          'Client estate planning tools',
          'Legacy proposal generator',
          'Basic trust templates',
          'Estate planning reports'
        ]
      },
      {
        name: 'Premium',
        price: 'Included',
        priceNote: 'No additional cost',
        features: [
          'Full SWAG™ suite',
          'Advanced estate strategies',
          'Multi-client legacy tracking',
          'Custom estate proposals',
          'Tax optimization tools'
        ],
        popular: true
      }
    ]
  },
  {
    category: 'RIA Teams',
    plans: [
      {
        name: 'Standard',
        price: '+$15',
        priceNote: 'per seat/month',
        features: [
          'Team estate planning tools',
          'Client legacy tracking',
          'Collaborative planning',
          'Estate reporting suite'
        ]
      },
      {
        name: '20+ Seats',
        price: 'Included',
        priceNote: 'No additional cost',
        features: [
          'Full enterprise SWAG™',
          'Advanced legacy analytics',
          'White-label estate tools',
          'Custom integration support',
          'Dedicated legacy specialist'
        ],
        popular: true
      }
    ]
  }
];

export function LegacyAddOn() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-foreground">SWAG™ Legacy Planning</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive estate and legacy planning tools that grow with your needs. 
            From basic wills to sophisticated multi-generational wealth strategies.
          </p>
        </div>

        <div className="space-y-12">
          {legacyPlans.map((category) => (
            <div key={category.category}>
              <h3 className="text-2xl font-bold text-center mb-8">{category.category} Add-ons</h3>
              
              <div className={`grid gap-6 max-w-6xl mx-auto ${
                category.plans.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
              }`}>
                {category.plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                      plan.popular
                        ? 'ring-2 ring-amber-500 scale-105 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40'
                        : 'border-border bg-background/80 backdrop-blur-sm'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Best Value
                        </span>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        <div className="text-sm text-muted-foreground mt-1">
                          {plan.priceNote}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              plan.popular ? 'text-amber-600' : 'text-primary'
                            }`} />
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
                        {plan.price.includes('Included') ? 'Already Included' : 'Add to Plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto rounded-2xl shadow-sm border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-8">
              <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">What Makes SWAG™ Special?</h3>
              <p className="text-muted-foreground mb-6">
                SWAG™ (Strategic Wealth & Asset Generation) combines cutting-edge AI with 
                decades of estate planning expertise to create personalized legacy strategies 
                that adapt to changing laws and family dynamics.
              </p>
              <Button variant="outline" className="border-amber-300 hover:bg-amber-50">
                Learn More About SWAG™
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default LegacyAddOn;