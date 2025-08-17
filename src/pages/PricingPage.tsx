import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Shield, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import familiesEntitlements from '@/config/familiesEntitlements';

type PlanId = 'basic' | 'premium' | 'elite';

interface PlanCard {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: React.ComponentType<any>;
  gradient: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
  popular?: boolean;
}

const planCards: PlanCard[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Essential family financial tools',
    features: familiesEntitlements.plans.basic.features,
    icon: Star,
    gradient: 'from-blue-500 to-cyan-500',
    buttonVariant: 'outline'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    description: 'Advanced family office features',
    features: familiesEntitlements.plans.premium.features,
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    buttonVariant: 'default',
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 299,
    description: 'Full family office experience',
    features: familiesEntitlements.plans.elite.features,
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-500',
    buttonVariant: 'secondary'
  }
];

const featureLabels: Record<string, string> = {
  education_access: 'Education Library Access',
  account_link: 'Account Linking',
  doc_upload_basic: 'Basic Document Upload',
  doc_upload_pro: 'Professional Document Management',
  goals_basic: 'Basic Goal Setting',
  goals_pro: 'Advanced Goal Tracking',
  invite_pros: 'Invite Financial Professionals',
  swag_lite: 'SWAG™ Lite Analysis',
  monte_carlo_lite: 'Monte Carlo Lite',
  vault_advanced: 'Advanced Secure Vault',
  rmd_planner: 'RMD Planning Tools',
  reports: 'Advanced Reports',
  reports_pro: 'Professional Reports Suite',
  estate_advanced: 'Advanced Estate Planning',
  tax_advanced: 'Advanced Tax Optimization',
  esign_basic: 'Basic E-Signature',
  esign_pro: 'Professional E-Signature Suite',
  properties: 'Property Management',
  advisor_collab: 'Advisor Collaboration',
  governance: 'Family Governance Tools',
  multi_entity: 'Multi-Entity Management',
  concierge: 'Dedicated Concierge Service'
};

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const planRefs = useRef<Record<PlanId, HTMLDivElement | null>>({
    basic: null,
    premium: null,
    elite: null
  });

  const sourceFeature = searchParams.get('feature');
  const targetPlan = searchParams.get('plan') as PlanId;

  useEffect(() => {
    analytics.trackEvent('pricing.viewed', {
      source_feature: sourceFeature,
      target_plan: targetPlan
    });

    // Auto-scroll to target plan if specified
    if (targetPlan && planRefs.current[targetPlan]) {
      setTimeout(() => {
        planRefs.current[targetPlan]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [sourceFeature, targetPlan]);

  const handlePlanCTA = (planId: PlanId) => {
    analytics.trackEvent('pricing.cta.clicked', {
      plan: planId,
      source_feature: sourceFeature
    });

    switch (planId) {
      case 'basic':
        toast({
          title: "🚀 Welcome to Basic!",
          description: "Your free trial has started. Check your email for setup instructions."
        });
        break;
      case 'premium':
        toast({
          title: "✨ Premium Trial Started!",
          description: "Enjoy 14 days of advanced family office features."
        });
        break;
      case 'elite':
        toast({
          title: "👑 Elite Consultation Scheduled",
          description: "Our concierge team will contact you within 24 hours."
        });
        break;
    }
  };

  const findPlanWithFeature = (feature: string): PlanId => {
    for (const [planId, plan] of Object.entries(familiesEntitlements.plans)) {
      if (plan.features.includes(feature)) {
        return planId as PlanId;
      }
    }
    return 'premium'; // Default fallback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Family Office Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock powerful tools to manage your family's wealth, education, and legacy
          </p>
          {sourceFeature && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                Upgrading for: {featureLabels[sourceFeature] || sourceFeature}
              </Badge>
            </div>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planCards.map((plan) => {
            const Icon = plan.icon;
            const isHighlighted = targetPlan === plan.id;
            
            return (
              <Card
                key={plan.id}
                ref={(el) => { planRefs.current[plan.id] = el; }}
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  isHighlighted ? 'ring-2 ring-primary shadow-lg scale-105' : ''
                } ${plan.popular ? 'border-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-foreground">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">
                          {featureLabels[feature] || feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    size="lg"
                    className="w-full"
                    onClick={() => handlePlanCTA(plan.id)}
                  >
                    {plan.id === 'basic' && 'Start Free Trial'}
                    {plan.id === 'premium' && 'Try Premium'}
                    {plan.id === 'elite' && 'Talk to Concierge'}
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center text-xs text-muted-foreground">
                    {plan.id === 'basic' && '14-day free trial • No credit card required'}
                    {plan.id === 'premium' && '14-day free trial • Cancel anytime'}
                    {plan.id === 'elite' && 'White-glove onboarding included'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Questions? We're here to help.
          </h3>
          <p className="text-muted-foreground mb-6">
            Our family office experts are available to guide you to the perfect plan.
          </p>
          <Button variant="outline" size="lg">
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}