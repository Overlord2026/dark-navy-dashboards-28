import React from 'react';
import { BRAND } from '@/theme/brand';

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-black text-white gold-border gold-shadow"
      role="banner"
      style={{ borderTopColor: BRAND.gold, borderBottomColor: BRAND.gold }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        {/* Left: Logo group */}
        <div className="flex items-center gap-3">
          {/* Keep the tree in gold; wordmark in white */}
          <img
            src="/assets/brand/bfo-tree-gold.svg"
            alt="BFO tree"
            className="h-6 w-auto"
          />
          <span className="font-semibold tracking-wide text-white">
            Boutique Family Office
          </span>
        </div>

        {/* Right: nav */}
        <nav className="flex items-center gap-6">
          <a className="text-white hover:text-[#D4AF37]" href="/discover">Discover</a>
          <a className="text-white hover:text-[#D4AF37]" href="/solutions">Solutions</a>
          <a className="text-white hover:text-[#D4AF37]" href="/personas/advisors">Advisors</a>
          <a
            className="rounded-md border border-[#D4AF37] px-3 py-1 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
            href="/book"
          >
            Book Demo
          </a>
        </nav>
      </div>
    </header>
  );
}

export { Header };
export default Header;
