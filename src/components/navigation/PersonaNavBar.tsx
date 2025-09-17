import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePersonaContext } from '@/context/persona-context';

const familyNavItems = [
  { label: 'Families', href: '/families' },
  { label: 'Professionals', href: '/pros' }, 
  { label: 'Solutions', href: '/solutions' },
  { label: 'Education', href: '/learn' },
  { label: 'Pricing', href: '/pricing' }
];

// Removed NIL conditional nav items - focusing on advisor/family workflows

export const PersonaNavBar: React.FC = () => {
  const location = useLocation();
  const { personaRoot } = usePersonaContext();

  const navItems = familyNavItems;

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <nav className="flex items-center h-12 space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors relative py-3",
                "hover:text-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm",
                location.pathname === item.href 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};