import React from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from './layout/TopNav';

export function Header() {
  return (
    <header className="bfo-header bfo-no-blur w-full" role="banner" aria-label="Main navigation">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link 
            to="/" 
            className="mr-6 flex items-center space-x-2"
            aria-label="Family Office Marketplace - Home"
          >
            <span className="hidden font-bold sm:inline-block text-bfo-gold">
              Family Office Marketplace
            </span>
          </Link>
          <TopNav />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu would go here */}
          </div>
          <nav className="flex items-center" aria-label="Secondary navigation">
            <Link
              to="/admin/hq"
              className="text-bfo-gold hover:text-bfo-white transition-colors px-3 py-2 text-sm font-medium"
              aria-label="Admin HQ Dashboard"
            >
              Admin HQ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}