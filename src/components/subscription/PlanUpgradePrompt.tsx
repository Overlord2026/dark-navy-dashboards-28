
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PlanUpgradePromptProps {
  requiredPlans: ('premium' | 'elite')[];
  featureName?: string;
}

export function PlanUpgradePrompt({ requiredPlans, featureName }: PlanUpgradePromptProps) {
  const navigate = useNavigate();
  
  const planText = requiredPlans.length === 1 
    ? requiredPlans[0].charAt(0).toUpperCase() + requiredPlans[0].slice(1)
    : requiredPlans.map(plan => plan.charAt(0).toUpperCase() + plan.slice(1)).join(' or ');
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-lg text-center space-y-4">
      <div className="bg-primary/10 p-3 rounded-full">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold">
        {featureName ? `${featureName} Feature` : 'Premium Feature'}
      </h3>
      
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        {planText} Plan Required
      </Badge>
      
      <p className="text-muted-foreground max-w-md">
        This feature is available on our {planText} plan. Upgrade now for full access to advanced analytics and personalized insights!
      </p>
      
      <Button 
        onClick={() => navigate('/subscription')}
        className="mt-2"
      >
        Upgrade Now <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
