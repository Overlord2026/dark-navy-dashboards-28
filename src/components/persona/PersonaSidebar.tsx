import React from 'react';
import { NavLink } from 'react-router-dom';

export const personaNav = [
  { label: 'Overview', href: '.' },
  { label: 'Services', href: 'services' },
  { label: 'Tools', href: 'tools' },
  { label: 'Learn & CE', href: 'learning' },
  { label: 'Receipts', href: 'receipts' },
  { label: 'Automations & Compliance', href: 'automations' },
  { label: 'Voice Assistant', href: 'voice' },
];

export function PersonaSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="space-y-2" role="navigation" aria-label="Persona navigation">
        {personaNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === '.'}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-bfo-gold text-bfo-black font-medium'
                  : 'hover:text-bfo-gold hover:bg-bfo-gold/10'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}