import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { useUserSubscription, type PlanKey } from '@/hooks/useUserSubscription';
import PricingBadge from '@/components/pricing/PricingBadge';
import { TIERS } from '@/config/tiers';
import { CheckoutService } from '@/lib/checkout';
import { useToast } from '@/hooks/use-toast';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

// Inline helper to determine plan type
function getPlanType(planKey: string): 'family' | 'advisor' | 'unknown' {
  if (['free', 'premium', 'pro'].includes(planKey)) return 'family';
  if (['advisor_basic', 'advisor_premium'].includes(planKey)) return 'advisor';
  return 'unknown';
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { currentPlanKey, isAuthenticated, isLoading, canUpgradeTo, isCurrentPlan } = useUserSubscription();
  
  // Get target plan from URL
  const targetPlanParam = searchParams.get('plan');
  
  // Validate plan key manually
  const allValidPlans = [...TIERS.families.order, ...TIERS.advisor.order];
  const targetPlanKey = (allValidPlans.includes(targetPlanParam as any) ? targetPlanParam : null) as PlanKey | null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No target plan selected
  if (!targetPlanKey) {
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

  // Authentication required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to continue with checkout.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Same plan check
  if (isCurrentPlan(targetPlanKey)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center flex items-center gap-2 justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Already Subscribed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You're already subscribed to the <PricingBadge planKey={targetPlanKey} /> plan.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Other Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid upgrade path
  if (!canUpgradeTo(targetPlanKey)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Invalid Upgrade</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You cannot upgrade from <PricingBadge planKey={currentPlanKey!} /> to <PricingBadge planKey={targetPlanKey} />.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Available Upgrades
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const planType = getPlanType(targetPlanKey);
     
  const handleProceedToPayment = async () => {
    try {
      const checkoutUrl = await CheckoutService.createCheckoutSession(targetPlanKey);
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
              <PricingBadge planKey={targetPlanKey} />
            </div>
            {currentPlanKey && (
              <div className="text-sm text-muted-foreground">
                Upgrading from <PricingBadge planKey={currentPlanKey} /> to <PricingBadge planKey={targetPlanKey} />
              </div>
            )}
            <p className="text-muted-foreground">
              Review your selected plan and proceed to payment
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="space-y-4">
              {/* Billing Information */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">
                      <PricingBadge planKey={targetPlanKey} />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {planType === 'family' ? 'Family Office' : 'Advisor'} subscription
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {targetPlanKey === 'free' ? 'Free' : 'Paid Plan'}
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
                disabled={targetPlanKey === 'free'}
              >
                {targetPlanKey === 'free' ? 'Sign Up Free' : 'Proceed to Payment'}
              </Button>
              
              {targetPlanKey === 'free' && (
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