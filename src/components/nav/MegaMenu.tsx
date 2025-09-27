import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
        isActive ? 'text-bfo-gold' : 'text-white hover:text-bfo-gold'
      }`}
    >
      {children}
    </Link>
  );
}

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium hover:text-bfo-gold transition-colors inline-flex items-center whitespace-nowrap text-white">
        {label}
        <ChevronDown className="ml-1 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="min-w-[220px] bg-bfo-black border border-bfo-gold z-50"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownItem({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <DropdownMenuItem asChild>
      <Link to={to} className="w-full text-white hover:text-bfo-gold" onClick={onClick}>
        {children}
      </Link>
    </DropdownMenuItem>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const onNavigate = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 text-sm font-medium hover:text-bfo-gold transition-colors inline-flex items-center text-white"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      
      {open && (
        <div className="absolute top-full left-0 right-0 bg-bfo-black border-t border-bfo-gold z-50">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link to="/nil" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">NIL</Link>
            <Link to="/search" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Search</Link>
            <Link to="/goals" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Goals</Link>
            <Link to="/catalog" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Catalog</Link>
            <div className="px-3 py-2">
              <div className="font-medium text-bfo-gold mb-2">Families</div>
              <Link to="/families" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Overview</Link>
              <Link to="/start/families?segment=retirees" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Retirees</Link>
              <Link to="/start/families?segment=aspiring" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Aspiring Families</Link>
            </div>
            <div className="px-3 py-2">
              <div className="font-medium text-bfo-gold mb-2">Service Professionals</div>
              <Link to="/pros" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Overview</Link>
              <Link to="/pros/advisors" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Financial Advisors</Link>
              <Link to="/pros/accountants" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Accountants</Link>
              <Link to="/pros/attorneys" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Attorneys</Link>
              <Link to="/pros/insurance/life" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Insurance (Life/Annuity)</Link>
              <Link to="/pros/insurance/other" onClick={onNavigate} className="block px-3 py-1 text-sm text-white hover:text-bfo-gold">Insurance (P&C/Medicare/LTC)</Link>
            </div>
            <Link to="/health" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Healthcare</Link>
            <Link to="/solutions" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Solutions</Link>
            <Link to="/pricing#families" onClick={onNavigate} className="block px-3 py-2 text-white hover:text-bfo-gold">Pricing</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function MegaMenu() {
  return (
    <div className="sticky-safe bg-bfo-black text-white border-y border-bfo-gold relative">
      <div className="container mx-auto px-4">
        <nav className="w-full overflow-x-auto py-2" role="navigation" aria-label="Main navigation">
          <ul className="flex gap-6 whitespace-nowrap items-center">
            <li className="hidden lg:block">
              <NavLink to="/nil">NIL</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink to="/search">Search</NavLink>
            </li>
            <li>
              <NavLink to="/goals">Goals</NavLink>
            </li>
            <li>
              <NavLink to="/catalog">Catalog</NavLink>
            </li>
            <li className="hidden lg:block">
              <Dropdown label="Families">
                <DropdownItem to="/families">Overview</DropdownItem>
                <DropdownItem to="/start/families?segment=retirees">Retirees</DropdownItem>
                <DropdownItem to="/start/families?segment=aspiring">Aspiring Families</DropdownItem>
              </Dropdown>
            </li>
            <li className="hidden lg:block">
              <Dropdown label="Service Professionals">
                <DropdownItem to="/pros">Overview</DropdownItem>
                <DropdownItem to="/pros/advisors">Financial Advisors</DropdownItem>
                <DropdownItem to="/pros/accountants">Accountants</DropdownItem>
                <DropdownItem to="/pros/attorneys">Attorneys</DropdownItem>
                <DropdownItem to="/pros/insurance/life">Insurance (Life/Annuity)</DropdownItem>
                <DropdownItem to="/pros/insurance/other">Insurance (P&C/Medicare/LTC)</DropdownItem>
              </Dropdown>
            </li>
            <li>
              <NavLink to="/health">Healthcare</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink to="/solutions">Solutions</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink to="/pricing#families">Pricing</NavLink>
            </li>
            <li className="ml-auto">
              <MobileMenu />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}