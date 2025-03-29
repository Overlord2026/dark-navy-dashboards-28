
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { subscriptionTiers } from '@/data/subscriptionTiers';

interface ExpirationNoticeProps {
  onDismiss: () => void;
}

export function ExpirationNotice({ onDismiss }: ExpirationNoticeProps) {
  const navigate = useNavigate();
  const { daysRemainingInTrial } = useSubscription();
  
  const isExpiredToday = daysRemainingInTrial === 0;
  
  return (
    <div className={`bg-gradient-to-r ${isExpiredToday ? 'from-red-600/20 to-red-400/20 border-red-500/30' : 'from-amber-600/20 to-red-400/20 border-amber-500/30'} rounded-lg p-6 mb-6 animate-fade-in border`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpiredToday ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <Clock className="h-5 w-5 text-amber-500" />
            )}
            <h2 className="text-xl font-semibold">
              {isExpiredToday 
                ? "Your free trial expires today!" 
                : `Your free trial ends in ${daysRemainingInTrial} days!`}
            </h2>
          </div>
          <Badge className={`${isExpiredToday ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-amber-500/20 text-amber-500 border-amber-500/20'}`}>
            {isExpiredToday ? 'Expires today' : `${daysRemainingInTrial} days left`}
          </Badge>
        </div>
        
        {isExpiredToday ? (
          <p className="text-muted-foreground">
            Upgrade now to keep your financial data organized and continue enjoying advanced planning tools. 
            Otherwise, your access will be limited starting tomorrow.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Here's a quick snapshot of our plans:
          </p>
        )}
        
        {!isExpiredToday && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 bg-background/80 p-4 rounded-md border border-border/40">
            {subscriptionTiers.map((tier) => (
              <div key={tier.id} className="flex flex-col space-y-2">
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {typeof tier.price === 'number' ? `$${tier.price}/month` : tier.price}
                </p>
                <p className="text-sm">{tier.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          {isExpiredToday ? (
            <p className="text-muted-foreground text-red-600/90">
              Your premium access ends today. Upgrade now to avoid service interruption.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Click below to continue enjoying your personalized financial insights.
            </p>
          )}
          <div className="flex gap-3">
            {!isExpiredToday && (
              <Button size="sm" onClick={onDismiss} variant="outline">
                Remind me later
              </Button>
            )}
            <Button 
              onClick={() => navigate('/subscription')}
              className={`${isExpiredToday ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-white`}
            >
              {isExpiredToday ? 'Upgrade Now' : 'View Plans'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
