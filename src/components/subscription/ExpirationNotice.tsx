
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
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
  
  return (
    <div className="bg-gradient-to-r from-amber-600/20 to-red-400/20 rounded-lg p-6 mb-6 animate-fade-in border border-amber-500/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Your free trial ends in 5 days!</h2>
          </div>
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">
            {daysRemainingInTrial} days left
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          Here's a quick snapshot of our plans:
        </p>
        
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
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <p className="text-muted-foreground">
            Click below to continue enjoying your personalized financial insights.
          </p>
          <div className="flex gap-3">
            <Button size="sm" onClick={onDismiss} variant="outline">
              Remind me later
            </Button>
            <Button 
              onClick={() => navigate('/subscription')}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              View Plans <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
