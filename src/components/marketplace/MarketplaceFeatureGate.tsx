import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Star, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { SubscriptionTierType } from '@/types/subscription';

interface MarketplaceFeatureGateProps {
  featureName: string;
  requiredTier: SubscriptionTierType;
  children?: React.ReactNode;
  description?: string;
  benefits?: string[];
  upgradePrompt?: string;
  className?: string;
}

export function MarketplaceFeatureGate({
  featureName,
  requiredTier,
  children,
  description,
  benefits = [],
  upgradePrompt,
  className = ""
}: MarketplaceFeatureGateProps) {
  const navigate = useNavigate();
  const { checkFeatureAccess, subscriptionPlan } = useSubscriptionAccess();
  
  const hasAccess = checkFeatureAccess(requiredTier);
  
  if (hasAccess) {
    return <>{children}</>;
  }

  const tierColors = {
    basic: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    premium: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    elite: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  };

  const tierIcons = {
    basic: Star,
    premium: Crown,
    elite: Zap
  };

  const TierIcon = tierIcons[requiredTier] || Lock;

  const defaultBenefits = {
    basic: [
      'Access to verified professionals',
      'Basic consultation booking',
      'Standard support'
    ],
    premium: [
      'Direct messaging with professionals',
      'Priority booking access',
      'Advanced filtering & ratings',
      'Document sharing capabilities',
      'Premium support'
    ],
    elite: [
      'Access to elite professionals',
      'Concierge service matching',
      'White-glove consultation setup',
      'Premium analytics & insights',
      'Dedicated account management'
    ]
  };

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits[requiredTier];

  return (
    <Card className={`border-2 border-dashed border-border/50 ${className}`}>
      <CardContent className="p-8 text-center space-y-6">
        {/* Feature Lock Icon */}
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${tierColors[requiredTier]}`}>
          <TierIcon className="w-8 h-8" />
        </div>

        {/* Feature Name */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{featureName}</h3>
          <Badge variant="outline" className={tierColors[requiredTier]}>
            {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Feature
          </Badge>
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        )}

        {/* Benefits List */}
        {displayBenefits.length > 0 && (
          <div className="max-w-sm mx-auto">
            <h4 className="font-medium mb-3">Unlock with {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              {displayBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upgrade Prompt */}
        {upgradePrompt && (
          <p className="text-sm text-muted-foreground italic">
            {upgradePrompt}
          </p>
        )}

        {/* Current Plan Info */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <div className="text-muted-foreground">
            Current Plan: <span className="font-medium capitalize text-foreground">
              {subscriptionPlan?.subscription_tier || 'Free'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="gap-2"
          onClick={() => navigate('/subscription')}
        >
          <Crown className="w-4 h-4" />
          Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Secondary Action */}
        <div className="text-xs text-muted-foreground">
          or{' '}
          <button 
            className="text-primary hover:underline"
            onClick={() => navigate('/subscription')}
          >
            compare all plans
          </button>
        </div>
      </CardContent>
    </Card>
  );
}