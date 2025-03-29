
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { Badge } from '@/components/ui/badge';

interface TrialExtensionBannerProps {
  onDismiss: () => void;
  extensionDays?: number;
}

export function TrialExtensionBanner({ onDismiss, extensionDays = 14 }: TrialExtensionBannerProps) {
  const navigate = useNavigate();
  const { daysRemainingInTrial } = useSubscription();
  
  return (
    <div className="bg-gradient-to-r from-green-600/20 to-blue-500/20 rounded-lg p-6 mb-6 animate-fade-in border border-green-500/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">
              Trial Extended: {extensionDays} Days Added!
            </h2>
          </div>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
            {daysRemainingInTrial} days left
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          Great job connecting your accounts and setting your financial goals! 
          We've extended your free trial by {extensionDays} days so you can dive deeper 
          into our premium features. Keep going!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-background/80 p-4 rounded-md border border-border/40">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500/10 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Try Premium Analytics</h3>
              <p className="text-xs text-muted-foreground mt-1">Unlock deeper insights into your financial habits</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/financial-plans')}
              >
                Explore <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-green-500/10 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Retirement Planning</h3>
              <p className="text-xs text-muted-foreground mt-1">See how your current savings impact retirement</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/social-security')}
              >
                Try Now <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            Explore more premium features while your trial lasts!
          </p>
          <Button size="sm" onClick={onDismiss} variant="outline">
            Thanks!
          </Button>
        </div>
      </div>
    </div>
  );
}
