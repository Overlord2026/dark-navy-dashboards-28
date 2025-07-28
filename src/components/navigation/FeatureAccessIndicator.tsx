import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Plus, Zap } from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { AddOnAccess, UsageCounters } from '@/types/subscription';

interface FeatureAccessIndicatorProps {
  feature?: keyof AddOnAccess;
  usageFeature?: keyof UsageCounters;
  requiredTier?: 'basic' | 'premium' | 'elite';
  className?: string;
}

export function FeatureAccessIndicator({ 
  feature, 
  usageFeature, 
  requiredTier,
  className = "" 
}: FeatureAccessIndicatorProps) {
  const { subscriptionPlan, checkFeatureAccess, checkUsageLimit } = useSubscriptionAccess();

  if (!subscriptionPlan) return null;

  // Check if user has required tier
  const hasTierAccess = requiredTier ? 
    (requiredTier === 'basic' && ['basic', 'premium', 'elite'].includes(subscriptionPlan.tier)) ||
    (requiredTier === 'premium' && ['premium', 'elite'].includes(subscriptionPlan.tier)) ||
    (requiredTier === 'elite' && subscriptionPlan.tier === 'elite')
    : true;

  // Check add-on access
  const hasFeatureAccess = feature ? checkFeatureAccess('premium') : true;

  // Check usage limits
  const usageStatus = usageFeature ? { hasAccess: true, remaining: 999, isAtLimit: false } : { hasAccess: true, remaining: -1, isAtLimit: false };

  // Determine badge type and content
  if (!hasTierAccess || !hasFeatureAccess) {
    return (
      <Badge variant="secondary" className={`text-xs ${className}`}>
        <Lock className="w-3 h-3 mr-1" />
        {feature ? 'Add-On' : requiredTier?.toUpperCase()}
      </Badge>
    );
  }

  if (usageStatus.isAtLimit) {
    return (
      <Badge variant="destructive" className={`text-xs ${className}`}>
        <Zap className="w-3 h-3 mr-1" />
        Limit Reached
      </Badge>
    );
  }

  if (usageStatus.remaining !== -1 && usageStatus.remaining <= 3) {
    return (
      <Badge variant="outline" className={`text-xs border-orange-300 text-orange-600 ${className}`}>
        <Zap className="w-3 h-3 mr-1" />
        {usageStatus.remaining} left
      </Badge>
    );
  }

  // Show premium badge for premium features
  if (requiredTier === 'premium' || requiredTier === 'elite') {
    return (
      <Badge variant="default" className={`text-xs bg-gradient-to-r from-yellow-500 to-orange-500 ${className}`}>
        <Crown className="w-3 h-3 mr-1" />
        {requiredTier === 'elite' ? 'ELITE' : 'PRO'}
      </Badge>
    );
  }

  return null;
}