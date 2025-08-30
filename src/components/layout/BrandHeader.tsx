import React from 'react';

export default function BrandHeader() {
  return (
    <header className="bfo-header bfo-no-blur fixed top-0 left-0 right-0 z-[100]">
      <div className="mx-auto flex h-[var(--header-h)] items-center px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Boutique Family Office">
          {/* Use local file (preferred) */}
          <img
            src="/brand/bfo_logo_gold.svg"
            onError={(e) => (e.currentTarget.src = '/brand/bfo_logo_gold.png')}
            alt="Boutique Family Office"
            className="h-7 w-auto"
          />
        </a>

        <nav className="ml-auto hidden md:flex items-center gap-6">
          <a className="text-white hover:text-bfo-gold" href="/book">Book Demo</a>
          <a className="text-white hover:text-bfo-gold" href="/login">Log In</a>
        </nav>
      </div>
    </header>
  );
}