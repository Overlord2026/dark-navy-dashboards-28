import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { familyCards, tierPricing } from '@/data/familiesPricingTiers';
import { Plan } from '@/lib/featureAccess';
import { analytics } from '@/lib/analytics';
import { toast } from '@/lib/toast';

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') as Plan | null;
  const featureParam = searchParams.get('feature');
  
  const basicRef = useRef<HTMLDivElement>(null);
  const premiumRef = useRef<HTMLDivElement>(null);
  const eliteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track page view
    analytics.trackEvent("pricing.viewed", { plan: planParam, feature: featureParam });
    
    // Auto-scroll to matching plan
    if (planParam) {
      const targetRef = planParam === 'basic' ? basicRef : planParam === 'premium' ? premiumRef : eliteRef;
      if (targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [planParam, featureParam]);

  const handleCTA = (tier: Plan) => {
    analytics.trackEvent("pricing.cta.clicked", { plan: tier });
    
    switch (tier) {
      case 'basic':
        toast.info("Starting Basic. Tools unlocked per Basic plan.");
        break;
      case 'premium':
        toast.ok("Trial started (stub).");
        break;
      case 'elite':
        toast.info("Concierge will reach out (stub).");
        break;
    }
  };

  const plans = [
    { 
      tier: 'basic' as Plan, 
      ref: basicRef, 
      data: tierPricing.basic,
      recommended: false 
    },
    { 
      tier: 'premium' as Plan, 
      ref: premiumRef, 
      data: tierPricing.premium,
      recommended: true 
    },
    { 
      tier: 'elite' as Plan, 
      ref: eliteRef, 
      data: tierPricing.elite,
      recommended: false 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive family office tools tailored to your needs
          </p>
          {planParam && featureParam && (
            <Badge variant="outline" className="mb-4">
              Upgrade to access: {featureParam}
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map(({ tier, ref, data, recommended }) => (
            <Card
              key={tier}
              ref={ref}
              className={`relative ${
                recommended 
                  ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                  : 'border-border'
              }`}
            >
              {recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{data.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {typeof data.price === 'number' ? `$${data.price}` : data.price}
                  </span>
                  {typeof data.price === 'number' && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">{data.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {data.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={recommended ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleCTA(tier)}
                >
                  {tier === 'basic' && 'Get Started'}
                  {tier === 'premium' && 'Start Trial'}
                  {tier === 'elite' && 'Contact Sales'}
                </Button>

                {/* Feature Count */}
                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  {familyCards.filter(card => card.requiredTier === tier).length} exclusive features
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground">
            All plans include 24/7 support and regular updates
          </p>
        </div>
      </div>
    </div>
  );
}