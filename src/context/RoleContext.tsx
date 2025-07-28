import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';
import { getRoleDisplayName } from '@/utils/roleHierarchy';

// Only show QA/Dev tools to specific email addresses
const DEV_EMAILS = ['tonygomes88@gmail.com'];

// Role-specific navigation configuration
const ROLE_DASHBOARDS: Record<string, string> = {
  'client': '/client-dashboard',
  'client_premium': '/client-dashboard',
  'advisor': '/advisor-dashboard',
  'admin': '/admin-dashboard',
  'tenant_admin': '/admin-dashboard',
  'system_administrator': '/admin-dashboard',
  'accountant': '/accountant-dashboard',
  'consultant': '/consultant-dashboard',
  'attorney': '/attorney-dashboard',
  'developer': '/advisor-dashboard' // Default to advisor for dev access
};

interface RoleContextType {
  emulatedRole: string | null;
  setEmulatedRole: (role: string | null) => void;
  getCurrentRole: () => string;
  isDevMode: boolean;
  clientTier: 'basic' | 'premium';
  setClientTier: (tier: 'basic' | 'premium') => void;
  getCurrentClientTier: () => 'basic' | 'premium';
  getRoleDashboard: (role?: string) => string;
}

const RoleContext = createContext<RoleContextType>({ 
  emulatedRole: null, 
  setEmulatedRole: () => {}, 
  getCurrentRole: () => 'client',
  isDevMode: false,
  clientTier: 'basic',
  setClientTier: () => {},
  getCurrentClientTier: () => 'basic',
  getRoleDashboard: () => '/'
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [emulatedRole, setEmulatedRole] = useState<string | null>(null);
  const [clientTier, setClientTier] = useState<'basic' | 'premium'>('basic');
  const { userProfile } = useUser();
  
  const isDevMode = userProfile?.email ? DEV_EMAILS.includes(userProfile.email) : false;
  
  const getCurrentRole = () => {
    // REFACTORED: Always use actual userProfile.role - no session bypass
    return userProfile?.role || 'client';
  };

  const getCurrentClientTier = () => {
    // REFACTORED: Always use actual profile tier - no session bypass
    return userProfile?.client_tier as 'basic' | 'premium' || 'basic';
  };

  const getRoleDashboard = (role?: string) => {
    const targetRole = role || getCurrentRole();
    return ROLE_DASHBOARDS[targetRole] || '/client-dashboard';
  };

  return (
    <RoleContext.Provider value={{ 
      emulatedRole, 
      setEmulatedRole, 
      getCurrentRole, 
      isDevMode,
      clientTier,
      setClientTier,
      getCurrentClientTier,
      getRoleDashboard
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => useContext(RoleContext);

export const RoleSwitcher = () => {
  const { emulatedRole, setEmulatedRole, getCurrentRole, isDevMode, clientTier, setClientTier } = useRoleContext();
  const { userProfile } = useUser();

  if (!isDevMode || !userProfile) return null;

  const ALL_ROLES = [
    'client',
    'client_premium',
    'advisor', 
    'admin',
    'tenant_admin',
    'system_administrator',
    'developer',
    'consultant',
    'accountant',
    'attorney'
  ];

  const currentRole = getCurrentRole();
  const displayRole = currentRole === 'client' && userProfile?.client_tier === 'premium' ? 'client_premium' : currentRole;

  const resetToOwner = () => {
    setEmulatedRole(null);
    setClientTier('basic');
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Session Role:</span>
        <span className="font-medium text-primary">
          {displayRole === 'client_premium' ? 'Client Premium' : getRoleDisplayName(currentRole)}
        </span>
        
        {/* REFACTORED: Visual-only selector for debugging UI states */}
        <select
          value={displayRole === 'client_premium' ? 'client_premium' : userProfile.role}
          onChange={(e) => {
            // UI-only emulation for visual debugging
            if (e.target.value === 'client_premium') {
              setEmulatedRole('client');
              setClientTier('premium');
            } else if (e.target.value === 'client') {
              setEmulatedRole('client');
              setClientTier('basic');
            } else {
              setEmulatedRole(e.target.value === userProfile.role ? null : e.target.value);
              if (e.target.value !== 'client') {
                setClientTier('basic');
              }
            }
          }}
          className="ml-2 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
          disabled
          title="UI-only debugging - does not affect auth or RLS"
        >
          {ALL_ROLES.map((role) => (
            <option key={role} value={role}>
              {role === 'client_premium' ? 'Client Premium' : getRoleDisplayName(role)}
            </option>
          ))}
        </select>
        
        <span className="text-xs text-muted-foreground ml-2">
          (UI Debug Only)
        </span>
      </div>
      
      <div className="flex items-center gap-2 border-l pl-4">
        <span className="text-muted-foreground">Session Tier:</span>
        <span className="font-medium">
          {userProfile?.client_tier || 'basic'}
        </span>
      </div>
    </div>
  );
};