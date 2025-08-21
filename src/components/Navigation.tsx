import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSwitcher } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';

export function Navigation() {
  const { userProfile } = useUser();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Family Office Platform
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/goals" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Goals
            </Link>
            <Link to="/receipts" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Receipts
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          {/* Dev tools disabled for production security */}
        </div>
      </div>
    </nav>
  );
}