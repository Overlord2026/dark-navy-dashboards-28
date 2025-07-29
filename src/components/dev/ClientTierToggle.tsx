import React from 'react';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';

export const ClientTierToggle = () => {
  const { isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  // Dev component disabled for production security
  return null;

  // REFACTORED: Show actual session tier only
  const currentTier = userProfile?.client_tier || 'basic';

  return (
    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1">
      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
        Session Tier:
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold">
          {currentTier === 'basic' ? 'Basic' : 'Premium'}
        </span>
        {currentTier === 'premium' && <Crown className="h-3 w-3 text-yellow-500" />}
      </div>
      <Badge variant="outline" className="text-xs">
        Read-Only
      </Badge>
    </div>
  );
};