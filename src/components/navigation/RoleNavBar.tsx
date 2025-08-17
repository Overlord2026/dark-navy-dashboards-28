import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Families', href: '/families', description: 'Family wealth management solutions' },
  { label: 'Professionals', href: '/pros', description: 'Professional services and tools' },
  { label: 'Resources', href: '/resources', description: 'Educational resources and guides' },
  { label: 'Solutions', href: '/solutions', description: 'Technology and platform solutions' },
  { label: 'Education', href: '/education', description: 'Learning center and courses' },
];

export const RoleNavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <nav 
      className="sticky top-12 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex h-14 items-center justify-center">
          <ul className="flex items-center gap-8" role="menubar">
            {navItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  to={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <span 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex h-14 items-center justify-between">
          <span className="text-sm font-medium text-foreground">Navigation</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsOpen(!isOpen))}
            className="p-2"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border animate-fade-in"
            role="menu"
            aria-orientation="vertical"
          >
            <ul className="space-y-2" role="none">
              {navItems.map((item) => (
                <li key={item.href} role="none">
                  <Link
                    to={item.href}
                    className={`flex flex-col px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-accent'
                    }`}
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    onKeyDown={(e) => handleKeyDown(e, () => setIsOpen(false))}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};