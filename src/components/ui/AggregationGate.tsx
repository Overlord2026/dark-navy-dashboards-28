import React from 'react';
import { useCurrentTier } from '@/hooks/useCurrentTier';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AggregationGateProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function AggregationGate({ children, fallbackMessage }: AggregationGateProps) {
  const { tierConfig } = useCurrentTier();
  const navigate = useNavigate();

  if (!tierConfig.allowAggregation) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Account Aggregation Required</h3>
          <p className="text-muted-foreground mb-4">
            {fallbackMessage || 'Connect your bank accounts to access this feature. Upgrade to Premium or Pro to enable account aggregation.'}
          </p>
          <Button 
            onClick={() => navigate('/pricing')}
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}