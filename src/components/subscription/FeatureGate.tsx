
import React, { ReactNode } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ featureId, children, fallback }: FeatureGateProps) {
  const { isFeatureAvailable, isUpgradeRequired } = useSubscription();
  const navigate = useNavigate();
  
  if (isFeatureAvailable(featureId)) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-lg text-center space-y-4">
      <div className="bg-primary/10 p-3 rounded-full">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">Premium Feature</h3>
      <p className="text-muted-foreground max-w-md">
        This feature requires a higher subscription tier to access.
      </p>
      <Button 
        onClick={() => navigate('/subscription')}
        className="mt-4"
      >
        Upgrade Subscription
      </Button>
    </div>
  );
}
