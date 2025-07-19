
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { AdminPortalLink } from '@/components/navigation/AdminPortalLink';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { userProfile, logout } = useUser();

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
              <AdminPortalLink />
              {/* Temporary DEV link - remove in production */}
              {userProfile?.role !== 'client' && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin-portal">Admin Portal</Link>
                </Button>
              )}
              {/* Preview-only admin link for testing */}
              {process.env.NODE_ENV !== 'production' && userProfile?.role !== 'client' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin-portal">🧪 Admin</Link>
                </Button>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span>{userProfile.name || userProfile.email}</span>
                <span className="text-muted-foreground">({userProfile.role})</span>
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
