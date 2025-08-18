import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2 } from 'lucide-react';
import { FeatureKey, Plan, PLAN_FEATURES } from '@/types/pricing';
import { useEntitlements } from '@/context/EntitlementsContext';
import { useToast } from '@/hooks/use-toast';
import { PlanSuggestionChip } from '@/components/pricing/PlanSuggestionChip';
import { getPlanRecommendation } from '@/lib/PlanRules';
import { track } from '@/lib/analytics';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureKey?: FeatureKey;
}

const PLAN_DETAILS: Record<Plan, { name: string; price: string; description: string; color: string }> = {
  basic: {
    name: 'Basic',
    price: '$29/mo',
    description: 'Perfect for getting started',
    color: 'bg-blue-500'
  },
  premium: {
    name: 'Premium', 
    price: '$99/mo',
    description: 'Advanced features for growing businesses',
    color: 'bg-purple-500'
  },
  elite: {
    name: 'Elite',
    price: '$299/mo',
    description: 'Enterprise-grade capabilities',
    color: 'bg-gold-500'
  }
};

const FEATURE_NAMES: Record<FeatureKey, string> = {
  doc_vault: 'Document Vault',
  advanced_analytics: 'Advanced Analytics',
  unlimited_clients: 'Unlimited Clients',
  priority_support: 'Priority Support',
  custom_branding: 'Custom Branding',
  api_access: 'API Access',
  white_label: 'White Label',
  advanced_reporting: 'Advanced Reporting',
  multi_user: 'Multi-User Access',
  sso_integration: 'SSO Integration'
};

export function UpgradeModal({ isOpen, onClose, featureKey }: UpgradeModalProps) {
  const { plan: currentPlan, persona, segment } = useEntitlements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (targetPlan: Plan) => {
    setIsLoading(targetPlan);
    
    // Track upgrade click
    track('plan.upgrade_click', {
      persona: persona || 'unknown',
      segment: segment || 'unknown',
      plan: targetPlan,
      feature_context: featureKey || null,
      source: 'upgrade_modal'
    });

    try {
      // Call purchase API stub
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: targetPlan,
          persona,
          segment,
          featureKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      const result = await response.json();
      
      // Track successful purchase
      track('plan.purchase_success', {
        persona: persona || 'unknown',
        segment: segment || 'unknown',
        plan: targetPlan,
        transaction_id: result.transactionId,
        feature_context: featureKey || null
      });
      
      toast({
        title: "Upgrade Successful!",
        description: `You've been upgraded to ${PLAN_DETAILS[targetPlan].name}. Your new features are now available.`,
      });
      
      // Refresh entitlements after successful upgrade
      window.location.reload();
      onClose();
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "There was an issue processing your upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const plans: Plan[] = ['basic', 'premium', 'elite'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            {featureKey 
              ? `Unlock ${FEATURE_NAMES[featureKey]} and more advanced features`
              : 'Choose the plan that fits your needs'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Persona-aware suggestion */}
        {persona && segment && (
          <PlanSuggestionChip 
            persona={persona as any}
            segment={segment}
            className="mt-4"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan === currentPlan;
            const planDetails = PLAN_DETAILS[plan];
            const features = PLAN_FEATURES[plan];
            
            return (
              <div 
                key={plan}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  isCurrentPlan 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-4 bg-primary">
                    Current Plan
                  </Badge>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold">{planDetails.name}</h3>
                  <div className="text-2xl font-bold text-primary mt-2">
                    {planDetails.price}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {planDetails.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {features.map((feature) => {
                    const hasFeature = features.includes(feature);
                    const isTargetFeature = feature === featureKey;
                    
                    return (
                      <div 
                        key={feature}
                        className={`flex items-center gap-2 text-sm ${
                          isTargetFeature ? 'text-primary font-medium' : ''
                        }`}
                      >
                        {hasFeature ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        {FEATURE_NAMES[feature]}
                      </div>
                    );
                  })}
                </div>

                <Button 
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan || isLoading === plan}
                  onClick={() => handleUpgrade(plan)}
                >
                  {isLoading === plan ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    `Upgrade to ${planDetails.name}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}