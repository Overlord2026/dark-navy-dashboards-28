import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { advisorSubscriptionTiers } from '@/data/advisorSubscriptionTiers';
import { track } from '@/lib/analytics';

export default function AdvisorsPricingPage() {
  useEffect(() => {
    // Track plan view
    track('plan.viewed', {
      persona: 'professionals',
      segment: 'advisors',
      page_type: 'pricing_comparison'
    });
  }, []);

  const handleGetStarted = (tierId: string) => {
    track('plan.upgrade_click', {
      persona: 'professionals',
      segment: 'advisors',
      plan: tierId,
      is_trial: tierId === 'standard',
      source: 'pricing_page'
    });

    if (tierId === 'standard') {
      // Start 7-day trial for advisors
      track('trial.start', {
        persona: 'professionals',
        segment: 'advisors',
        plan: 'standard',
        trial_duration_days: 7
      });
      console.log('Starting 7-day Standard trial for advisors');
    }
    
    console.log('Get started with advisor tier:', tierId);
    // TODO: Integrate with purchase flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Advisor Marketplace Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional tools and marketplace presence for financial advisors
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Trusted by 2,500+ advisors nationwide</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {advisorSubscriptionTiers.map((tier, index) => {
            const isPopular = tier.id === 'standard';
            const isPremium = tier.id === 'premium';
            
            return (
              <Card
                key={tier.id}
                className={`relative ${
                  isPopular 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' 
                    : 'border-border'
                } ${isPremium ? 'bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isPremium && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-accent text-accent-foreground">
                      Enterprise
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {tier.price === 0 ? 'Free' : `$${tier.price}`}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{tier.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature.id} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-30">
                            <div className="w-full h-full border border-muted-foreground rounded" />
                          </div>
                        )}
                        <span className={`text-sm ${!feature.included ? 'text-muted-foreground line-through' : ''}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : tier.price === 0 ? "outline" : "secondary"}
                    size="lg"
                    onClick={() => handleGetStarted(tier.id)}
                  >
                    {tier.price === 0 && 'Get Started Free'}
                    {tier.id === 'standard' && 'Start 7-Day Trial'}
                    {tier.id === 'premium' && 'Contact Sales'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                    {tier.price === 0 && 'No credit card required'}
                    {tier.id === 'standard' && '7-day trial, then $99/month'}
                    {tier.id === 'premium' && 'Custom enterprise features available'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="text-center p-6">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Grow Your Practice</h3>
            <p className="text-sm text-muted-foreground">
              Get qualified leads and increase your AUM with our marketplace visibility
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Client Management</h3>
            <p className="text-sm text-muted-foreground">
              Advanced CRM and white-labeled portal for seamless client experience
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compliance Ready</h3>
            <p className="text-sm text-muted-foreground">
              Built-in compliance tools and audit trails for regulatory peace of mind
            </p>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What's included in the free tier?</h3>
              <p className="text-sm text-muted-foreground">
                Basic marketplace listing, limited lead generation, and standard client management tools.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can change your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do you offer custom enterprise plans?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, our Premium tier includes custom features for large practices and RIAs.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibent mb-2">What support is included?</h3>
              <p className="text-sm text-muted-foreground">
                All plans include email support. Premium plans get priority support and a dedicated rep.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}