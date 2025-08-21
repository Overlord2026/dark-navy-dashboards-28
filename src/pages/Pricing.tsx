import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { getAllPlans, setPlan, getPlan } from '@/features/entitlements/plan';
import { toast } from 'sonner';

export default function PricingPage() {
  const plans = getAllPlans();
  const currentPlan = getPlan();

  const handleSelectPlan = (planKey: string) => {
    setPlan(planKey as any);
    toast.success(`Switched to ${plans[planKey as keyof typeof plans].name} plan!`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your NIL Plan</h1>
        <p className="text-muted-foreground">Unlock advanced features for your NIL activities</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <Card key={key} className={`relative ${key === 'premium' ? 'border-primary' : ''}`}>
            {key === 'premium' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {currentPlan === key && (
                  <Badge variant="secondary">Current</Badge>
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Limits:</p>
                {Object.entries(plan.limits).map(([resource, limit]) => (
                  <p key={resource}>• {resource}: {limit === 999 ? 'Unlimited' : limit}</p>
                ))}
              </div>

              <Button 
                onClick={() => handleSelectPlan(key)}
                disabled={currentPlan === key}
                className="w-full"
                variant={key === 'premium' ? 'default' : 'outline'}
              >
                {currentPlan === key ? 'Current Plan' : `Select ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}