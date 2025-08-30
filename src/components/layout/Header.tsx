import React from 'react';
import { GoldOutlineLinkButton } from '@/components/ui/brandButtons';
import { BRAND } from '@/theme/brand';

function Header() {
  return (
    <header
      className="sticky top-0 z-50 bfo-header bfo-no-blur w-full"
      role="banner"
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
          <a className="text-white hover:text-bfo-gold" href="/discover">Discover</a>
          <a className="text-white hover:text-bfo-gold" href="/solutions">Solutions</a>
          <a className="text-white hover:text-bfo-gold" href="/personas/advisors">Advisors</a>
          <GoldOutlineLinkButton href="/book">
            Book Demo
          </GoldOutlineLinkButton>
        </nav>
      </div>
    </header>
  );
}

export { Header };
export default Header;
