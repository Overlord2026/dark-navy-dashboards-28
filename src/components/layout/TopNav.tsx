import React from 'react';

export default function TopNav() {
  const item = (href: string, label: string) => (
    <a href={href} className="px-3 py-1.5 text-bfo-gold hover:underline underline-offset-4">
      {label}
    </a>
  );

  return (
    <div className="sticky top-[56px] z-40 bg-bfo-black text-bfo-gold border-y border-bfo-gold bfo-no-blur">
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