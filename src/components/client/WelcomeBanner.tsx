import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRoleContext } from '@/context/RoleContext';

export const WelcomeBanner = () => {
  const { user } = useAuth();
  const { getCurrentClientTier } = useRoleContext();
  const tier = getCurrentClientTier();

  const getDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'Valued Client';
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {getDisplayName()}!
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Your Family Office Dashboard is live. Secure. Private. Powered by BFO's Fiduciary Duty Principles™.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={tier === 'premium' ? 'default' : 'secondary'}
              className="text-sm px-3 py-1"
            >
              {tier === 'premium' ? (
                <>
                  <Crown className="h-4 w-4 mr-1" />
                  Premium Client
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-1" />
                  Basic Client
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};