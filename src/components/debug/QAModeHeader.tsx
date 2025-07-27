import React from 'react';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Crown, 
  User, 
  Shield,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';
import { getRoleDisplayName } from '@/utils/roleHierarchy';

export function QAModeHeader() {
  const { 
    emulatedRole, 
    setEmulatedRole, 
    getCurrentRole, 
    getCurrentClientTier, 
    isDevMode,
    setClientTier 
  } = useRoleContext();
  const { userProfile } = useUser();

  if (!isDevMode || !emulatedRole) return null;

  const actualRole = userProfile?.role || 'unknown';
  const actualTier = userProfile?.client_tier || 'basic';
  const currentRole = getCurrentRole();
  const currentTier = getCurrentClientTier();

  const resetToActual = () => {
    setEmulatedRole(null);
    setClientTier('basic');
  };

  return (
    <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white border-b border-orange-600/50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-semibold">QA MODE ACTIVE</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Actual:</span>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {getRoleDisplayName(actualRole)}
                  {actualRole.includes('client') && ` (${actualTier})`}
                </Badge>
              </div>
              
              <div className="text-white/60">→</div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Emulating:</span>
                <Badge variant="default" className="bg-white text-orange-600 border-white">
                  {getRoleDisplayName(currentRole)}
                  {currentRole.includes('client') && (
                    <span className="ml-1">
                      ({currentTier})
                      {currentTier === 'premium' && <Crown className="h-3 w-3 ml-1 inline" />}
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={resetToActual}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 border border-white/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exit QA Mode</span>
              <X className="h-4 w-4 sm:hidden" />
            </Button>
          </div>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden mt-2 pt-2 border-t border-white/20">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span>Actual: {getRoleDisplayName(actualRole)} ({actualTier})</span>
            </div>
            <div className="flex justify-between">
              <span>Emulating: {getRoleDisplayName(currentRole)} ({currentTier})</span>
              {currentTier === 'premium' && <Crown className="h-3 w-3" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}