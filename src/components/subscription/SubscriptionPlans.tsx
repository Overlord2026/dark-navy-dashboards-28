
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useCheckout } from '@/hooks/useCheckout';
import { SubscriptionTierCard } from './SubscriptionTierCard';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SubscriptionPlans() {
  const { subscriptionPlan, isLoading, syncWithStripe } = useSubscriptionAccess();
  const { createCheckoutSession, isLoading: checkoutLoading } = useCheckout();
  
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowUpgradeDialog(true);
  };

  const handleConfirmUpgrade = () => {
    if (selectedTier) {
      // Map tier to price ID (these would be your actual Stripe price IDs)
      const priceMap = {
        'basic': 'price_basic_monthly', // Replace with actual price ID
        'premium': 'price_premium_monthly', // Replace with actual price ID
        'elite': 'price_elite_monthly' // Replace with actual price ID
      };
      
      const priceId = priceMap[selectedTier as keyof typeof priceMap];
      if (priceId) {
        createCheckoutSession(priceId);
      }
      setShowUpgradeDialog(false);
      setSelectedTier('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select the plan that best suits your financial goals and needs
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Plan</CardTitle>
            <CardDescription>
              Your active subscription tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm font-medium">
                {subscriptionPlan?.subscription_tier?.charAt(0).toUpperCase() + 
                 subscriptionPlan?.subscription_tier?.slice(1) || 'Free'}
              </Badge>
              {subscriptionPlan?.subscription_status === 'active' && (
                <Badge variant="outline" className="text-xs text-green-600">
                  Active
                </Badge>
              )}
            </div>
            {subscriptionPlan?.subscription_end_date && (
              <p className="text-sm text-muted-foreground mt-2">
                Next billing: {new Date(subscriptionPlan.subscription_end_date).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={syncWithStripe}
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Syncing...' : 'Refresh Status'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => (
          <SubscriptionTierCard 
            key={tier.id} 
            tier={tier} 
            onSelectTier={handleSelectTier} 
          />
        ))}
      </div>

      {/* Confirm Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Upgrade</DialogTitle>
            <DialogDescription>
              {selectedTier === 'elite' 
                ? "Our team will contact you shortly to discuss Elite tier options and pricing." 
                : `You'll be redirected to Stripe to complete your ${selectedTier} subscription.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmUpgrade}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Loading...' : selectedTier === 'elite' ? 'Request Contact' : 'Continue to Checkout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
