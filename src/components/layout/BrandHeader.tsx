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

export default function BrandHeader() {
  return (
    <header className="bfo-header bfo-no-blur fixed top-0 left-0 right-0 z-[100]">
      <div className="mx-auto flex h-[var(--header-h)] items-center px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-auto hidden md:flex items-center gap-6">
          <a className="text-white hover:text-bfo-gold" href="/book">Book Demo</a>
          <a className="text-white hover:text-bfo-gold" href="/login">Log In</a>
        </nav>
      </div>
    </header>
  );
}