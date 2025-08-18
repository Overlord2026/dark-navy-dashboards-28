import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';
import { tierPricing, familyCards } from '@/data/familiesPricingTiers';
import { Plan } from '@/types/pricing';
import { FeatureKey, PLAN_FEATURES, FEATURE_QUOTAS } from '@/types/pricing';
import { track } from '@/lib/analytics';

export default function FamiliesPricingPage() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') as Plan | null;
  const featureParam = searchParams.get('feature') as FeatureKey | null;
  
  const basicRef = useRef<HTMLDivElement>(null);
  const premiumRef = useRef<HTMLDivElement>(null);
  const eliteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track plan view
    track('plan.viewed', {
      persona: 'families',
      plan_type: planParam || 'all',
      feature_context: featureParam || null,
      page_type: 'pricing_comparison'
    });

    // Auto-scroll to matching plan
    if (planParam) {
      const targetRef = planParam === 'basic' ? basicRef : planParam === 'premium' ? premiumRef : eliteRef;
      if (targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [planParam, featureParam]);

  const handleGetStarted = (plan: Plan) => {
    track('plan.upgrade_click', {
      persona: 'families',
      plan: plan,
      is_trial: plan === 'premium',
      source: 'pricing_page'
    });

    if (plan === 'premium') {
      // Start 14-day trial
      track('trial.start', {
        persona: 'families',
        plan: 'premium',
        trial_duration_days: 14
      });
      console.log('Starting 14-day Premium trial for families');
    }
    
    console.log('Get started with plan:', plan);
    // TODO: Integrate with purchase flow
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

  // Create feature comparison table
  const allFeatures = Array.from(new Set(Object.values(PLAN_FEATURES).flat()));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Family Office Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive family wealth management tools for every stage
          </p>
          {planParam && featureParam && (
            <Badge variant="outline" className="mb-4">
              Upgrade to access: {featureParam.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map(({ tier, ref, data, recommended }) => {
            const features = PLAN_FEATURES[tier] || [];
            const quotas = FEATURE_QUOTAS[tier] || {};
            
            return (
              <Card
                key={tier}
                ref={ref}
                className={`relative ${
                  recommended 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' 
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
                      ${data.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
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
                    onClick={() => handleGetStarted(tier)}
                  >
                    {tier === 'basic' && 'Get Started'}
                    {tier === 'premium' && 'Start 14-Day Trial'}
                    {tier === 'elite' && 'Contact Sales'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Feature Count */}
                  <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                    {familyCards.filter(card => card.requiredTier === tier).length} exclusive features
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Basic</th>
                    <th className="text-center p-4 font-medium bg-primary/5">Premium</th>
                    <th className="text-center p-4 font-medium">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature) => {
                    const featureName = feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <tr key={feature} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{featureName}</td>
                        {plans.map(({ tier }) => {
                          const hasFeature = PLAN_FEATURES[tier]?.includes(feature);
                          const quota = FEATURE_QUOTAS[tier]?.[feature];
                          
                          return (
                            <td key={tier} className={`text-center p-4 ${tier === 'premium' ? 'bg-primary/5' : ''}`}>
                              {hasFeature ? (
                                <div className="flex flex-col items-center">
                                  <Check className="w-5 h-5 text-primary" />
                                  {quota && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                      {quota === 'unlimited' ? 'Unlimited' : `${quota} limit`}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Security & Trust */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium">Enterprise-grade security</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All plans include bank-level encryption, SOC 2 compliance, and 24/7 security monitoring
          </p>
        </div>
      </div>
    </div>
  );
}