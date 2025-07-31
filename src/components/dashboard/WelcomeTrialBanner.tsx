
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, DollarSign, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { Badge } from '@/components/ui/badge';

export interface WelcomeTrialBannerProps {
  onDismiss: () => void;
}

export function WelcomeTrialBanner({ onDismiss }: WelcomeTrialBannerProps) {
  const navigate = useNavigate();
  const { daysRemainingInTrial } = useSubscription();
  
  return (
    <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg p-6 mb-6 animate-fade-in border border-primary/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Welcome to Boutique Family Office!</h2>
          <Badge className="bg-primary/20 text-primary border-primary/20">
            {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} trial
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          You have 90 days of complimentary access to experience our best features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Connect an Account</h3>
              <p className="text-xs text-muted-foreground mt-1">Link your financial accounts to get started</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/accounts')}
              >
                Connect <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Set Financial Goals</h3>
              <p className="text-xs text-muted-foreground mt-1">Create your first financial goal or milestone</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/financial-plans')}
              >
                Set Goals <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Explore Dashboard</h3>
              <p className="text-xs text-muted-foreground mt-1">Get a quick snapshot of your finances</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/')}
              >
                Explore <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-2">
          <p className="text-sm text-muted-foreground">
            Ready to begin?
          </p>
          <Button size="sm" onClick={onDismiss} variant="outline" className="w-full sm:w-auto whitespace-nowrap">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
