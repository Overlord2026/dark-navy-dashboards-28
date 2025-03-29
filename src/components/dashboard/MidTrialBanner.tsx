
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, BarChart2, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import { Badge } from '@/components/ui/badge';

interface MidTrialBannerProps {
  onDismiss: () => void;
}

export function MidTrialBanner({ onDismiss }: MidTrialBannerProps) {
  const navigate = useNavigate();
  const { daysRemainingInTrial } = useSubscription();
  
  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-primary/20 rounded-lg p-6 mb-6 animate-fade-in border border-primary/30">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">You're halfway through your free trial!</h2>
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">
            {daysRemainingInTrial} days left
          </Badge>
        </div>
        
        <p className="text-muted-foreground">
          Have you explored our advanced features? Make the most of your trial period.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-blue-500/10 p-2 rounded-full">
              <Calculator className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Tax Planning</h3>
              <p className="text-xs text-muted-foreground mt-1">Get insights on tax optimization strategies</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/tax-budgets')}
              >
                Explore <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-green-500/10 p-2 rounded-full">
              <BarChart2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Social Security</h3>
              <p className="text-xs text-muted-foreground mt-1">Plan for your retirement benefits</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs px-0 h-6 mt-1" 
                onClick={() => navigate('/social-security')}
              >
                Explore <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/80 p-4 rounded-md border border-border/40 flex items-start space-x-3">
            <div className="bg-amber-500/10 p-2 rounded-full">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Financial Plans</h3>
              <p className="text-xs text-muted-foreground mt-1">Simulate different retirement scenarios</p>
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
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            We're here to help you make the most of your trial!
          </p>
          <Button size="sm" onClick={onDismiss} variant="outline">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
