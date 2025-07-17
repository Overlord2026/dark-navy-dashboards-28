import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';

interface PremiumFeatureGateProps {
  featureName: string;
  featureLabel: string;
  featureDescription?: string;
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

export function PremiumFeatureGate({ 
  featureName, 
  featureLabel, 
  featureDescription,
  children, 
  fallbackComponent 
}: PremiumFeatureGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTenant } = useTenant();

  useEffect(() => {
    const checkFeatureAccess = async () => {
      if (!currentTenant) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tenant_feature_flags')
          .select('enabled')
          .eq('tenant_id', currentTenant.id)
          .eq('feature_name', featureName)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking feature access:', error);
        }

        setHasAccess(data?.enabled || false);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureAccess();
  }, [featureName, currentTenant]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Premium Feature
            </CardTitle>
            <CardDescription>
              {featureLabel} requires a premium subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {featureLabel}
            </Badge>
            
            {featureDescription && (
              <p className="text-sm text-muted-foreground">
                {featureDescription}
              </p>
            )}
            
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" className="w-full">
                Request Access
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Contact your administrator to enable this feature for your organization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}