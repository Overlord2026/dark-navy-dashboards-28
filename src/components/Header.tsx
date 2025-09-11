import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './nav/HeaderNav';
import PersonaSwitcher from './nav/PersonaSwitcher';

export function Header() {
  return (
    <>
      <HeaderNav />
      {/* Secondary header for admin/secondary navigation */}
      <div className="w-full bg-muted/30 border-b">
        <div className="container flex h-12 max-w-screen-2xl items-center justify-end">
          <nav className="flex items-center" aria-label="Secondary navigation">
            <Link
              to="/admin/hq"
              className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 text-sm font-medium"
              aria-label="Admin HQ Dashboard"
            >
              Admin HQ
            </Link>
          </nav>
        </div>
      </div>
      <PersonaSwitcher />
    </>
  );
}