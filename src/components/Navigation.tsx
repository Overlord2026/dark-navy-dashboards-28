import React from 'react';
import { RoleSwitcher } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';

export function Navigation() {
  const { userProfile } = useUser();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Family Office Platform
            </span>
          </a>
        </div>
        <div className="flex items-center">
          {/* Dev tools disabled for production security */}
        </div>
      </div>
    </nav>
  );
}