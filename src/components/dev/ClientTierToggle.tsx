import React from 'react';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User } from 'lucide-react';

export const ClientTierToggle = () => {
  const { getCurrentRole, getCurrentClientTier, setClientTier, isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  // Only show for dev user
  const isDevUser = userProfile?.email === 'tonygomes88@gmail.com';
  const currentRole = getCurrentRole();
  const isClientRole = currentRole === 'client' || currentRole === 'client_premium';
  
  if (!isDevUser || !isDevMode || !isClientRole) {
    return null;
  }

  const currentTier = getCurrentClientTier();

  return (
    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-1">
      <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
        Client Tier:
      </span>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={currentTier === 'basic' ? 'default' : 'ghost'}
          className="h-6 px-2 text-xs"
          onClick={() => setClientTier('basic')}
        >
          <User className="h-3 w-3 mr-1" />
          Basic
        </Button>
        <Button
          size="sm"
          variant={currentTier === 'premium' ? 'default' : 'ghost'}
          className="h-6 px-2 text-xs"
          onClick={() => setClientTier('premium')}
        >
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Button>
      </div>
      <Badge variant="outline" className="text-xs">
        QA Mode
      </Badge>
    </div>
  );
};