import { useState } from 'react';
import { Link } from "react-router-dom";
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import pricingContent from '@/content/pricing_content.json';

function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { families, badges, ctas } = pricingContent;

  return (
    <section className="py-16" id="families">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{families.headline}</h2>
          <p className="text-muted-foreground mb-8">{families.subhead}</p>
          
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
          {families.tiers.map((tier) => (
            <Card
              key={tier.key}
              className={`relative rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                tier.featured
                  ? 'ring-2 ring-foreground scale-105'
                  : 'border-border'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-foreground text-background px-4 py-1 rounded-full text-sm font-medium">
                    {badges[tier.key as keyof typeof badges]}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual && tier.price.yearly ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className="text-muted-foreground">
                    {tier.price.monthly === 0 ? '' : isAnnual ? '/year' : '/month'}
                  </span>
                  {isAnnual && tier.price.yearly_note && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {tier.price.yearly_note}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.blurb}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link
                  to={ctas[tier.key as keyof typeof ctas]}
                  className="w-full"
                >
                  <Button
                    className="w-full"
                    variant={tier.featured ? 'default' : 'outline'}
                  >
                    {tier.name === 'Free' ? 'Get Started Free' : `Choose ${tier.name}`}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingTable;
export { PricingTable };