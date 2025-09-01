import React from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '@/components/layout/TopNav';
import RunNILDemo from '@/components/demos/RunNILDemo';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3">
    <img
      src="/brand/bfo-logo-gold.svg"
      alt="Boutique Family Office"
      width={140}
      height={28}
      className="h-7 w-auto"
    />
  </Link>
);

function BrandHeader() {
  return (
    <header className="sticky top-0 z-50 bfo-header bfo-no-blur">
      <div className="mx-auto flex h-[56px] items-center gap-3 px-4">
        <Logo />

        <nav className="ml-auto hidden md:flex items-center gap-6">
          <TopNav />
          <div className="border-l border-bfo-gold/30 pl-6 ml-6 flex items-center gap-6">
            <RunNILDemo />
            <Link to="/marketplace" className="text-white hover:text-bfo-gold transition-colors">Marketplace</Link>
            <Link to="/admin/hq" className="text-bfo-gold hover:underline">HQ</Link>
            <a className="text-white hover:text-bfo-gold transition-colors" href="/book">Book Demo</a>
            <a className="text-white hover:text-bfo-gold transition-colors" href="/login">Log In</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default BrandHeader;
export { BrandHeader };