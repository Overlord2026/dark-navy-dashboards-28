import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
import { useCheckoutPlan } from '@/hooks/useCheckoutPlan';
import { PricingBadge } from '@/components/pricing/PricingBadge';
import { TIERS, getPlanType } from '@/config/tiers';
import { CheckoutService } from '@/lib/checkout';
import { useToast } from '@/hooks/use-toast';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { planKey, badge } = useCheckoutPlan();
  
  if (!planKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Invalid Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              No valid plan selected. Please choose a plan from our pricing page.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Pricing Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const planType = getPlanType(planKey);
  const features = planType === 'family' 
    ? TIERS.families.features[planKey as FamilyPlanKey] 
    : TIERS.advisor.features[planKey as AdvisorPlanKey];
    
  const handleProceedToPayment = async () => {
    try {
      const checkoutUrl = await CheckoutService.createCheckoutSession(planKey);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pricing')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Button>
        </div>
        
        {/* Plan Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
              <PricingBadge planKey={planKey} />
            </div>
            <p className="text-muted-foreground">
              Review your selected plan and proceed to payment
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Plan Features</h3>
                <div className="grid gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Billing Information */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{badge} Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      {planType === 'family' ? 'Family Office' : 'Advisor'} subscription
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {planKey === 'free' ? 'Free' : 'Paid Plan'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="pt-4">
              <Button 
                onClick={handleProceedToPayment} 
                className="w-full" 
                size="lg"
                disabled={planKey === 'free'}
              >
                {planKey === 'free' ? 'Sign Up Free' : 'Proceed to Payment'}
              </Button>
              
              {planKey === 'free' && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  No payment required for the free plan
                </p>
              )}
            </div>
            
            {/* Terms */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}