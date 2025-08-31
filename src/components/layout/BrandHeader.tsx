import React from 'react';
import { Link } from 'react-router-dom';

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
    <header className="sticky top-0 z-50 bfo-no-blur bg-bfo-black border-b border-bfo-gold">
      <div className="mx-auto flex h-[56px] items-center gap-3 px-4">
        <Logo />

        <nav className="ml-auto hidden md:flex items-center gap-6">
          <a className="text-white hover:text-bfo-gold" href="/book">Book Demo</a>
          <a className="text-white hover:text-bfo-gold" href="/login">Log In</a>
        </nav>
      </div>
    </header>
  );
}

export default BrandHeader;
export { BrandHeader };