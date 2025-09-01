import React from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from './layout/TopNav';

export function Header() {
  return (
    <header className="bfo-header sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-[#D4AF37]">Family Office Marketplace</span>
          </Link>
          <TopNav />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu would go here */}
          </div>
          <nav className="flex items-center">
            <Link
              to="/admin/hq"
              className="text-[#D4AF37] hover:text-[#C49B2C] transition-colors px-3 py-2 text-sm font-medium"
            >
              Admin HQ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}