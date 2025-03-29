
import React, { useState } from 'react';
import { SubscriptionTierCard } from './SubscriptionTierCard';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { SubscriptionTierType } from '@/types/subscription';
import { useSubscription } from '@/context/SubscriptionContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SubscriptionPlans() {
  const { upgradeTier, isInFreeTrial, daysRemainingInTrial, startFreeTrial } = useSubscription();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmTrialDialogOpen, setConfirmTrialDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierType | null>(null);

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId as SubscriptionTierType);
    setConfirmDialogOpen(true);
  };

  const handleConfirmUpgrade = () => {
    if (selectedTier) {
      upgradeTier(selectedTier);
      setConfirmDialogOpen(false);
    }
  };

  const handleStartFreeTrial = () => {
    startFreeTrial();
    setConfirmTrialDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select the plan that best suits your financial goals and needs
        </p>
        
        {!isInFreeTrial && (
          <div className="mt-4">
            <Button 
              onClick={() => setConfirmTrialDialogOpen(true)}
              variant="outline"
              className="mx-auto"
            >
              Start 90-Day Free Trial <Badge className="ml-2 bg-primary">Premium Features</Badge>
            </Button>
          </div>
        )}
        
        {isInFreeTrial && daysRemainingInTrial !== null && (
          <div className="mt-4 p-2 bg-primary/10 rounded-md inline-block">
            <Badge variant="outline" className="text-primary border-primary">
              Trial Active: {daysRemainingInTrial} days remaining
            </Badge>
          </div>
        )}
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
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Change</DialogTitle>
            <DialogDescription>
              {selectedTier === 'elite' 
                ? "Our team will contact you shortly to discuss Elite tier options and pricing." 
                : `Are you sure you want to upgrade to the ${selectedTier?.charAt(0).toUpperCase()}${selectedTier?.slice(1)} tier?`}
            </DialogDescription>
          </DialogHeader>
          {isInFreeTrial && (
            <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 my-2">
              Note: Upgrading now will end your free trial period.
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmUpgrade}>
              {selectedTier === 'elite' ? 'Request Contact' : 'Confirm Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Free Trial Dialog */}
      <Dialog open={confirmTrialDialogOpen} onOpenChange={setConfirmTrialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Your 90-Day Free Trial</DialogTitle>
            <DialogDescription>
              Experience premium features for 90 days at no cost. You'll have access to all Basic and Premium features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-4">
            <h4 className="font-medium">During your trial, you'll get:</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Full access to all Basic features</li>
              <li>Complete access to Premium features</li>
              <li>No credit card required</li>
              <li>Cancel anytime</li>
            </ul>
            <p className="text-sm text-muted-foreground pt-2">
              We'll notify you before your trial ends, and you can choose to upgrade or return to the Basic plan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTrialDialogOpen(false)}>Not Now</Button>
            <Button onClick={handleStartFreeTrial}>
              Start Free Trial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
