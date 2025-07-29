
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useRoleContext, RoleSwitcher } from '@/context/RoleContext';
import { getRoleDisplayName } from '@/utils/roleHierarchy';
import { AdminPortalLink } from '@/components/navigation/AdminPortalLink';
import { ClientTierToggle } from '@/components/dev/ClientTierToggle';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { ImpersonationLog } from '@/components/debug/ImpersonationLog';
import { Button } from '@/components/ui/button';
import { LogOut, User, Home } from 'lucide-react';

export function Header() {
  const { userProfile, logout } = useUser();
  const { getRoleDashboard } = useRoleContext();
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  
  // Dev tools disabled for production security
  const currentRole = userProfile?.role || 'client';
  const currentTier = userProfile?.client_tier || 'basic';
  const dashboardPath = getRoleDashboard();
  
  // QA mode disabled for production security
  const isInQAMode = false;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* QA Mode Banner */}
      {isInQAMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
          🔧 QA MODE: Emulating {getRoleDisplayName(currentRole)} {currentRole === 'client' && currentTier === 'premium' ? 'Premium' : ''}
        </div>
      )}
      
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">Family Office</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {userProfile && (
            <>
              {/* Dashboard link based on current role */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-foreground hover:text-foreground/80"
              >
                <Link to={dashboardPath}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              {/* Dev tools disabled for production security */}
              
              <AdminPortalLink />
              
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span>{userProfile.name || userProfile.email}</span>
                <span className="text-muted-foreground">
                  ({getRoleDisplayName(currentRole)}{currentRole === 'client' && currentTier === 'premium' ? ' Premium' : ''})
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Debug Panel - only visible to dev users */}
      <DebugPanel 
        isOpen={debugPanelOpen}
        onToggle={() => setDebugPanelOpen(!debugPanelOpen)}
      />
      
      {/* Impersonation Log - only visible to dev users */}
      <ImpersonationLog />
    </header>
  );
}
