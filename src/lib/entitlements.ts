import React, { ComponentType } from 'react';
import { useEntitlements } from '@/context/EntitlementsContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

// Helper function to check entitlements
export function hasEntitlement(key: string, entitlements: ReturnType<typeof useEntitlements>): boolean {
  return entitlements.features[key] || false;
}

// HOC for wrapping components with entitlement checks
export function withEntitlement<P extends object>(
  Component: ComponentType<P>,
  featureKey: string,
  fallback?: ComponentType<P>
) {
  return function EntitledComponent(props: P) {
    const entitlements = useEntitlements();
    
    if (!entitlements.features[featureKey]) {
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
  featureKey: string;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function Gate({ children, featureKey, fallback, showUpgrade = true }: GateProps) {
  const entitlements = useEntitlements();
  
  if (!entitlements.features[featureKey]) {
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
  featureKey: string;
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
export function useFeatureEntitlement(featureKey: string) {
  const entitlements = useEntitlements();
  
  return {
    hasAccess: entitlements.features[featureKey] || false,
    quota: null,
    remainingQuota: null,
    plan: 'basic'
  };
}

// Quota checker utility
export function useQuotaCheck(featureKey: string) {
  const entitlements = useEntitlements();
  
  return {
    hasQuota: true,
    remaining: 'unlimited',
    total: 'unlimited',
    canUse: entitlements.features[featureKey] || false
  };
}