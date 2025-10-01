import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function ButtonLink({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm text-bfo-ivory hover:text-bfo-gold focus:outline-none focus:ring-2 focus:ring-bfo-gold/40 ${className}`}
    >
      {children}
    </Link>
  );
}

export default function TopNav() {
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, label }: { to: string; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm ${isActive ? "text-bfo-gold" : "text-bfo-ivory hover:text-bfo-gold"}`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="w-full bg-bfo-navy/95 border-b border-white/10">
      {/* accessibility */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 z-50 bg-bfo-gold/20 text-bfo-ivory px-3 py-1 rounded">
        Skip to main content
      </a>

      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand (never truncates on desktop; truncates safely on very small widths) */}
          <Link to="/" className="min-w-0 flex-1">
            <h1 className="truncate text-base sm:text-lg font-bold text-bfo-ivory">
              Boutique Family Office
            </h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <NavItem to="/families" label="Families" />
            <NavItem to="/pros" label="Professionals" />
            <NavItem to="/pricing#families" label="Pricing" />
            <NavItem to="/learn" label="Learn" />
            <NavItem to="/marketplace" label="Marketplace" />
            {/* optional links; remove if not used */}
            {/* <NavItem to="/hq" label="HQ" /> */}
            {/* <NavItem to="/book-demo" label="Book Demo" /> */}
            {/* <NavItem to="/login" label="Log In" /> */}
          </nav>

          {/* Quick actions (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <ButtonLink to="/families" className="border border-white/10 hover:border-bfo-gold/40">Home</ButtonLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-2 text-bfo-ivory hover:text-bfo-gold"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden pb-3">
            <div className="mt-2 grid gap-1 rounded-lg border border-white/10 bg-white/5 p-2">
              <NavItem to="/families" label="Families" />
              <NavItem to="/pros" label="Professionals" />
              <NavItem to="/pricing#families" label="Pricing" />
              <NavItem to="/learn" label="Learn" />
              <NavItem to="/marketplace" label="Marketplace" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export { TopNav };
