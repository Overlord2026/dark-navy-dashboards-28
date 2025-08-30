import React from 'react';

export function SimpleHeader() {
  return (
    <header className="bfo-header bfo-no-blur fixed top-0 left-0 right-0 z-[100]">
      <div className="mx-auto flex h-[var(--header-h)] items-center px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Boutique Family Office">
          <img
            src="/brand/bfo_logo_gold.svg"
            onError={(e) => (e.currentTarget.src = '/brand/bfo_logo_gold.png')}
            alt="Boutique Family Office"
            className="h-7 w-auto"
          />
        </a>
        <nav className="ml-auto flex items-center gap-4">
          <a className="text-white hover:text-bfo-gold" href="/discover">Catalog</a>
          <a className="text-white hover:text-bfo-gold" href="/solutions">Solutions</a>
          <a className="text-white hover:text-bfo-gold" href="/book">Book demo</a>
        </nav>
      </div>
    </header>
  );
}

export default SimpleHeader;