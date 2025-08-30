import React from 'react';

export default function TopNav() {
  const item = (href: string, label: string) => (
    <a href={href} className="px-3 py-1.5 text-bfo-gold hover:underline underline-offset-4">
      {label}
    </a>
  );

  return (
    <div className="bfo-subheader bfo-no-blur fixed top-[calc(var(--header-h))] left-0 right-0 z-[90]">
      <div className="mx-auto h-10 px-4 sm:px-6 lg:px-8 flex items-center">
        <nav className="flex items-center gap-2">
          {item('/nil', 'NIL')}
          {item('/search', 'Search')}
          {item('/goals', 'Goals')}
          {item('/discover', 'Catalog')}
          {item('/personas', 'Personas')}
          {item('/solutions', 'Solutions')}
        </nav>
      </div>
    </div>
  );
}