import React, { ComponentType } from 'react';
import { FeatureKey } from '@/types/pricing';
import { useEntitlements } from '@/context/EntitlementsContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { track } from '@/lib/analytics';

// Helper function to check entitlements
export function hasEntitlement(key: FeatureKey, entitlements: ReturnType<typeof useEntitlements>): boolean {
  return entitlements.has(key);
}

// HOC for wrapping components with entitlement checks
export function withEntitlement<P extends object>(
  Component: ComponentType<P>,
  featureKey: FeatureKey,
  fallback?: ComponentType<P>
) {
  return function EntitledComponent(props: P) {
    const entitlements = useEntitlements();
    
    if (!entitlements.has(featureKey)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return React.createElement(FallbackComponent, props);
      }
      
      return React.createElement(UpgradePrompt, { featureKey });
    }
    
    return React.createElement(Component, props);
  };
}

// Gate component for conditional rendering
interface GateProps {
  children: React.ReactNode;
  featureKey: FeatureKey;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function Gate({ children, featureKey, fallback, showUpgrade = true }: GateProps) {
  const entitlements = useEntitlements();
  
  if (!entitlements.has(featureKey)) {
    // Track gated view
    track('gated.view', {
      feature_key: featureKey,
      user_plan: entitlements.plan,
      user_persona: entitlements.persona || 'unknown',
      user_segment: entitlements.segment || 'unknown'
    });

    if (fallback) {
      return React.createElement(React.Fragment, null, fallback);
    }
    
    if (showUpgrade) {
      return React.createElement(UpgradePrompt, { featureKey });
    }
    
    return null;
  }
  
  return React.createElement(React.Fragment, null, children);
}

// Upgrade prompt component
interface UpgradePromptProps {
  featureKey: FeatureKey;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

function UpgradePrompt({ featureKey, size = 'sm', variant = 'outline' }: UpgradePromptProps) {
  const handleUpgrade = () => {
    // TODO: Open upgrade modal
    console.log('Open upgrade modal for feature:', featureKey);
  };
  
  return React.createElement('div', {
    className: "flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/30"
  }, [
    React.createElement(Lock, { 
      key: "icon",
      className: "h-4 w-4 text-muted-foreground" 
    }),
    React.createElement('span', {
      key: "text",
      className: "text-sm text-muted-foreground"
    }, "This feature requires an upgrade"),
    React.createElement(Button, {
      key: "button",
      size,
      variant,
      onClick: handleUpgrade,
      className: "ml-auto"
    }, "Upgrade")
  ]);
}

// Hook for feature-specific entitlement checks
export function useFeatureEntitlement(featureKey: FeatureKey) {
  const entitlements = useEntitlements();
  
  return {
    hasAccess: entitlements.has(featureKey),
    quota: entitlements.quota(featureKey),
    remainingQuota: entitlements.remainingQuota(featureKey),
    plan: entitlements.plan
  };
}

// Quota checker utility
export function useQuotaCheck(featureKey: FeatureKey) {
  const entitlements = useEntitlements();
  
  const remaining = entitlements.remainingQuota(featureKey);
  const hasQuota = remaining === 'unlimited' || (typeof remaining === 'number' && remaining > 0);
  
  return {
    hasQuota,
    remaining,
    total: entitlements.quota(featureKey),
    canUse: entitlements.has(featureKey) && hasQuota
  };
}