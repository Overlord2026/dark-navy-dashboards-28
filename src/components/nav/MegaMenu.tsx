import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { NAV, NavItem } from '@/config/nav';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

function NavLink({ item }: { item: NavItem }) {
  if (item.path) {
    return (
      <Link 
        to={item.path} 
        className="px-3 py-2 text-sm font-medium hover:text-bfo-gold transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <span className="px-3 py-2 text-sm font-medium whitespace-nowrap">
      {item.label}
    </span>
  );
}

function NavDropdown({ item }: { item: NavItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium hover:text-bfo-gold transition-colors inline-flex items-center whitespace-nowrap">
        {item.label}
        <ChevronDown className="ml-1 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="min-w-[220px] bg-background border border-border z-50"
      >
        {item.children?.map((child) => (
          <DropdownMenuItem key={child.label} asChild>
            <Link to={child.path} className="w-full">
              {child.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMoreMenu({ items }: { items: NavItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium hover:text-bfo-gold transition-colors inline-flex items-center lg:hidden">
        <Menu className="h-4 w-4 mr-1" />
        More
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border z-50">
        {items.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            {item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MegaMenu() {
  const [visibleCount] = useState(4); // Show first 4 items on mobile
  const visibleItems = NAV.slice(0, visibleCount);
  const hiddenItems = NAV.slice(visibleCount);

  return (
    <div className="sticky-safe bg-bfo-black text-white border-y border-bfo-gold">
      <div className="container mx-auto px-4">
        <nav 
          className="nav-row py-2"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Always visible items */}
          <div className="flex items-center gap-2 overflow-x-auto lg:gap-4">
            {visibleItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <NavDropdown item={item} />
                ) : (
                  <NavLink item={item} />
                )}
              </div>
            ))}
            
            {/* Hidden items on larger screens */}
            <div className="hidden lg:flex items-center gap-4">
              {hiddenItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <NavDropdown item={item} />
                  ) : (
                    <NavLink item={item} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile "More" menu */}
            {hiddenItems.length > 0 && (
              <MobileMoreMenu items={hiddenItems} />
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}