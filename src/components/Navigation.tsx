import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSwitcher } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';

export function Navigation() {
  const { userProfile } = useUser();
  
  return (
    <nav className="sticky top-0 z-50 bfo-header bfo-no-blur" role="banner">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/brand/bfo_logo_gold.svg"
              onError={(e) => (e.currentTarget.src = '/brand/bfo_logo_gold.png')}
              alt="Boutique Family Office"
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/goals" className="text-sm font-medium text-bfo-gold hover:text-white transition-colors">
              Goals
            </Link>
            <Link to="/receipts" className="text-sm font-medium text-bfo-gold hover:text-white transition-colors">
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