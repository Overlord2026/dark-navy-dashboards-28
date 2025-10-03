import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function ButtonLink({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm text-white hover:text-bfo-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfo-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bfo-black ${className}`}
    >
      {children}
    </Link>
  );
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <NavLink
        to={to}
        aria-current={isActive ? "page" : undefined}
        className={({ isActive }) =>
          `rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfo-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bfo-black ${
            isActive ? "text-bfo-gold font-semibold" : "text-white hover:text-bfo-gold"
          }`
        }
        onClick={() => setOpen(false)}
      >
        {label}
      </NavLink>
    );
  };

  return (
    <header className="bfo-header w-full border-b-2 border-bfo-gold">
      {/* accessibility */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 z-50 bg-bfo-gold text-black font-semibold px-4 py-2 rounded shadow-lg">
        Skip to main content
      </a>

      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand (never truncates on desktop; truncates safely on very small widths) */}
          <Link to="/" className="min-w-0 flex-1">
            <h1 className="truncate text-base sm:text-lg font-bold text-white">
              Boutique Family Office
            </h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavItem to="/families" label="Families" />
            <span className="text-white/30 mx-1">•</span>
            <NavItem to="/pros" label="Professionals" />
            <span className="text-white/30 mx-1">•</span>
            <NavItem to="/pricing#families" label="Pricing" />
            <span className="text-white/30 mx-1">•</span>
            <NavItem to="/learn" label="Learn" />
            <span className="text-white/30 mx-1">•</span>
            <NavItem to="/marketplace" label="Marketplace" />
          </nav>

          {/* Quick actions (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <ButtonLink to="/families" className="border border-white/10 hover:border-bfo-gold/40">Home</ButtonLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-2 text-white hover:text-bfo-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfo-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bfo-black"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="lg:hidden pb-3">
            <div className="mt-2 space-y-3 rounded-lg border border-bfo-gold/30 bg-bfo-black/95 backdrop-blur-sm p-3">
              
              {/* FOR FAMILIES Section */}
              <div>
                <div className="text-xs font-semibold text-bfo-gold px-2 py-1 mb-1 uppercase tracking-wider">
                  For Families
                </div>
                <div className="space-y-0.5">
                  <NavItem to="/families" label="Families Overview" />
                  <NavItem to="/healthcare" label="Healthcare Hub" />
                </div>
              </div>
              
              {/* FOR PROFESSIONALS Section */}
              <div className="border-t border-white/10 pt-2">
                <div className="text-xs font-semibold text-bfo-gold px-2 py-1 mb-1 uppercase tracking-wider">
                  For Professionals
                </div>
                <div className="space-y-0.5">
                  <NavItem to="/pros" label="All Professionals" />
                  <NavItem to="/pros/advisors" label="Financial Advisors" />
                  <NavItem to="/pros/accountants" label="CPAs" />
                  <NavItem to="/pros/attorneys" label="Attorneys" />
                </div>
              </div>
              
              {/* RESOURCES Section */}
              <div className="border-t border-white/10 pt-2">
                <div className="text-xs font-semibold text-bfo-gold px-2 py-1 mb-1 uppercase tracking-wider">
                  Resources
                </div>
                <div className="space-y-0.5">
                  <NavItem to="/learn" label="Learning Center" />
                  <NavItem to="/marketplace" label="Marketplace" />
                  <NavItem to="/pricing" label="Pricing" />
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export { TopNav };
