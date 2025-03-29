
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { Badge } from '@/components/ui/badge';

interface TrialEndingSoonBannerProps {
  onDismiss: () => void;
}

export function TrialEndingSoonBanner({ onDismiss }: TrialEndingSoonBannerProps) {
  const navigate = useNavigate();
  const { daysRemainingInTrial } = useSubscription();
  
  return (
    <div className="bg-gradient-to-r from-amber-600/20 to-red-400/20 rounded-lg p-6 mb-6 animate-fade-in border border-amber-500/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Your free trial ends soon!</h2>
          </div>
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">
            {daysRemainingInTrial} days left
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          Don't lose access to advanced features like deeper portfolio analysis and custom financial planning.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 bg-background/80 p-4 rounded-md border border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Keep Your Premium Access</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the right plan for your financial journey
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/subscription')}
            className="w-full sm:w-auto"
          >
            View Plans <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            You can review all available options on our subscription page.
          </p>
          <Button size="sm" onClick={onDismiss} variant="outline">
            Remind me later
          </Button>
        </div>
      </div>
    </div>
  );
}
