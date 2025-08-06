import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Users, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRoleContext } from '@/context/RoleContext';
import { abTesting } from '@/lib/abTesting';
import { usePersona } from '@/hooks/usePersona';

export const WelcomeBanner = () => {
  const { user } = useAuth();
  const { getCurrentClientTier } = useRoleContext();
  const { personaConfig } = usePersona();
  const tier = getCurrentClientTier();

  const getDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'Valued Client';
  };

  // Get persona-specific welcome message, then apply A/B test
  const baseGreeting = personaConfig.welcomeMessage.replace('{name}', getDisplayName());
  
  // A/B Test for welcome banner text (only if not persona-specific)
  const welcomeVariant = abTesting.getVariant('welcome_banner_text', user?.id || 'anonymous');
  const greeting = welcomeVariant?.config.greeting.replace('{name}', getDisplayName()) || baseGreeting;

  const getBadgeContent = () => {
    if (personaConfig.badgeText) {
      const IconComponent = personaConfig.id === 'family_office_admin' ? Settings : 
                           personaConfig.id === 'hnw_client' ? Crown : Shield;
      return (
        <>
          <IconComponent className="h-4 w-4 mr-1" />
          {personaConfig.badgeText}
        </>
      );
    }

    // Fallback to tier-based badge
    return tier === 'premium' ? (
      <>
        <Crown className="h-4 w-4 mr-1" />
        Premium Client
      </>
    ) : (
      <>
        <Shield className="h-4 w-4 mr-1" />
        Basic Client
      </>
    );
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Your Family Office Dashboard is live. Secure. Private. Powered by BFO's Fiduciary Duty Principles™.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={personaConfig.badgeVariant || (tier === 'premium' ? 'default' : 'secondary')}
              className="text-sm px-3 py-1"
            >
              {getBadgeContent()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};