
import React, { ReactNode } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Lock, Clock } from 'lucide-react';
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
  
  const isTwoWeeksOrLess = daysRemainingInTrial !== null && daysRemainingInTrial <= 14;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-lg text-center space-y-4">
      <div className={`${isTwoWeeksOrLess ? 'bg-amber-500/10' : 'bg-primary/10'} p-3 rounded-full`}>
        {isTwoWeeksOrLess ? (
          <Clock className="h-8 w-8 text-amber-500" />
        ) : (
          <Lock className="h-8 w-8 text-primary" />
        )}
      </div>
      <h3 className="text-xl font-semibold">Premium Feature</h3>
      
      {isInFreeTrial ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`${isTwoWeeksOrLess ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
              {isTwoWeeksOrLess ? 'Trial Ending Soon' : 'Trial Active'}
            </Badge>
            {daysRemainingInTrial !== null && (
              <Badge variant="outline" className={`${isTwoWeeksOrLess ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {daysRemainingInTrial} days left
              </Badge>
            )}
          </div>
          {isTwoWeeksOrLess ? (
            <p className="text-muted-foreground max-w-md">
              Your 90-day trial is ending soon! Upgrade now to keep accessing all premium features 
              and avoid losing your settings and personalized data.
            </p>
          ) : (
            <p className="text-muted-foreground max-w-md">
              This Elite feature is not included in your 90-day trial. Your trial gives you access to Basic and Premium features, 
              but Elite features require a subscription upgrade.
            </p>
          )}
        </>
      ) : (
        <p className="text-muted-foreground max-w-md">
          This feature requires a higher subscription tier to access.
        </p>
      )}
      
      <Button 
        onClick={() => navigate('/subscription')}
        className={`mt-4 ${isTwoWeeksOrLess ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
      >
        {isInFreeTrial ? (
          isTwoWeeksOrLess ? 'Keep Premium Access' : 'Upgrade to Elite Tier'
        ) : 'Upgrade Subscription'}
      </Button>
    </div>
  );
}
