
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useRoleContext, RoleSwitcher } from '@/context/RoleContext';
import { AdminPortalLink } from '@/components/navigation/AdminPortalLink';
import { ClientTierToggle } from '@/components/dev/ClientTierToggle';
import { Button } from '@/components/ui/button';
import { LogOut, User, HomeIcon } from 'lucide-react';

export function Header() {
  const { userProfile, logout } = useUser();
  const { isDevMode, getCurrentRole, getCurrentClientTier, getRoleDashboard } = useRoleContext();
  
  // Only show dev tools for specific email
  const isDevUser = userProfile?.email === 'tonygomes88@gmail.com';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">Family Office</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {userProfile && (
            <>
              {/* Only show dev tools for specific developer email */}
              {isDevUser && <RoleSwitcher />}
              {isDevUser && <ClientTierToggle />}
              
              {/* Dashboard link based on current role */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-foreground hover:text-foreground/80"
              >
                <Link to={getRoleDashboard()}>
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              <AdminPortalLink />
              
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span>{userProfile.name || userProfile.email}</span>
                <span className="text-muted-foreground">
                  ({getCurrentRole()}{getCurrentRole() === 'client' ? ` ${getCurrentClientTier()}` : ''})
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
    </header>
  );
}
