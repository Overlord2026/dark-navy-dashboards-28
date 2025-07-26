import React, { createContext, useContext, useState } from 'react';
import { useUser } from './UserContext';
import { getRoleDisplayName } from '@/utils/roleHierarchy';

const DEV_EMAILS = ['tonygomes88@gmail.com'];

interface RoleContextType {
  emulatedRole: string | null;
  setEmulatedRole: (role: string | null) => void;
  getCurrentRole: () => string;
  isDevMode: boolean;
}

const RoleContext = createContext<RoleContextType>({ 
  emulatedRole: null, 
  setEmulatedRole: () => {}, 
  getCurrentRole: () => 'client',
  isDevMode: false
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [emulatedRole, setEmulatedRole] = useState<string | null>(null);
  const { userProfile } = useUser();
  
  const isDevMode = userProfile?.email ? DEV_EMAILS.includes(userProfile.email) : false;
  
  const getCurrentRole = () => {
    if (emulatedRole && isDevMode) {
      return emulatedRole;
    }
    return userProfile?.role || 'client';
  };

  return (
    <RoleContext.Provider value={{ emulatedRole, setEmulatedRole, getCurrentRole, isDevMode }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => useContext(RoleContext);

export const RoleSwitcher = () => {
  const { emulatedRole, setEmulatedRole, getCurrentRole, isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  if (!isDevMode || !userProfile) return null;

  const ALL_ROLES = [
    'client',
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

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Viewing as:</span>
      <span className="font-medium text-primary">{getRoleDisplayName(currentRole)}</span>
      <select
        value={emulatedRole || userProfile.role}
        onChange={(e) => setEmulatedRole(e.target.value === userProfile.role ? null : e.target.value)}
        className="ml-2 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
      >
        {ALL_ROLES.map((role) => (
          <option key={role} value={role}>
            {getRoleDisplayName(role)}
          </option>
        ))}
      </select>
    </div>
  );
};