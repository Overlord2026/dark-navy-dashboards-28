
import React, { ReactNode } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface FeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ featureId, children, fallback }: FeatureGateProps) {
  const { 
    isFeatureAvailable, 
    isUpgradeRequired, 
    isInFreeTrial, 
    daysRemainingInTrial 
  } = useSubscription();
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
      
      {isInFreeTrial ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Trial Access
            </Badge>
            {daysRemainingInTrial !== null && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {daysRemainingInTrial} days left
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-md">
            This feature is only available in our Elite tier. While you can explore many Premium features during your trial, some Elite features remain exclusive.
          </p>
        </>
      ) : (
        <p className="text-muted-foreground max-w-md">
          This feature requires a higher subscription tier to access.
        </p>
      )}
      
      <Button 
        onClick={() => navigate('/subscription')}
        className="mt-4"
      >
        {isInFreeTrial ? 'Explore Elite Features' : 'Upgrade Subscription'}
      </Button>
    </div>
  );
}
