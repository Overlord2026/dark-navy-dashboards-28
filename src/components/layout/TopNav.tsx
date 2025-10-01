import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Families',
    href: '/families'
  },
  {
    label: 'Professionals',
    href: '/pros'
  },
  {
    label: 'Pricing',
    href: '/pricing'
  },
  {
    label: 'Learn',
    href: '/learn'
  }
];

interface DropdownMenuProps {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}

function DropdownMenu({ items, isOpen, onClose }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-bfo-black border border-bfo-gold rounded-lg shadow-xl z-50">
      <div className="py-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="block px-4 py-3 text-bfo-ivory hover:bg-bfo-gold/10 transition-colors"
            onClick={onClose}
          >
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-sm text-bfo-gold/70 mt-1">{item.description}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

interface NavDropdownProps {
  item: NavItem;
}

function NavDropdown({ item }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (item.href) {
    return (
      <Link
        to={item.href}
        className="text-bfo-ivory hover:text-bfo-gold transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className={cn(
          "flex items-center gap-1 text-bfo-ivory hover:text-bfo-gold transition-colors whitespace-nowrap",
          isOpen && "text-bfo-gold"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown 
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} 
        />
      </button>
      
      {item.dropdown && (
        <DropdownMenu
          items={item.dropdown}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export function TopNav() {
  return (
    <nav className="hidden md:flex items-center gap-4">
      {navItems.map((item, index) => (
        <NavDropdown key={index} item={item} />
      ))}
    </nav>
  );
}