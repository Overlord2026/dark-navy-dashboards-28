
import React, { useState } from 'react';
import { SubscriptionTierCard } from './SubscriptionTierCard';
import { subscriptionTiers } from '@/data/subscriptionTiers';
import { SubscriptionTierType } from '@/types/subscription';
import { useSubscription } from '@/context/SubscriptionContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SubscriptionPlans() {
  const { upgradeTier } = useSubscription();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select the plan that best suits your financial goals and needs
        </p>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmUpgrade}>
              {selectedTier === 'elite' ? 'Request Contact' : 'Confirm Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
