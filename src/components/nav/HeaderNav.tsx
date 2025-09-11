import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

type Item = { label: string; to: string };
type Group = { label: string; items: Item[] };

const NAV: Group[] = [
  {
    label: "Service Professionals",
    items: [
      { label: "Advisors", to: "/pros/advisors" },
      { label: "Accountants", to: "/pros/accountants" },
      { label: "Attorneys", to: "/pros/attorneys" },
      { label: "Insurance", to: "/pros/insurance" },
      { label: "Realtors / Property Managers", to: "/pros/realtors" },
      { label: "Consultants", to: "/pros/consultants" },
      { label: "Medicare Specialists", to: "/pros/medicare" },
    ],
  },
  {
    label: "Families",
    items: [
      { label: "Aspiring Families", to: "/families/aspiring" },
      { label: "Retirees", to: "/families/retirees" },
    ],
  },
];

function useRouteClose(setOpen: (v: boolean) => void) {
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname, setOpen]);
}

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useRouteClose(setMobileOpen);

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50" role="banner">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" aria-label="Boutique Family Office - Home">
          <Logo variant="tree" className="h-8 w-auto" />
          <span className="hidden sm:inline-block font-bold text-foreground">
            Boutique Family Office
          </span>
        </Link>

        {/* Desktop menus */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
          {NAV.map(group => (
            <Popover key={group.label} label={group.label}>
              <ul className="py-2" role="menu">
                {group.items.map(it => (
                  <li key={it.to} role="none">
                    <Link 
                      className="block px-4 py-2 text-foreground hover:bg-accent transition-colors rounded-md"
                      to={it.to}
                      role="menuitem"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Popover>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent transition-colors"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function Popover({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(o => !o);
          }
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        className="px-3 py-2 rounded-md text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {label}
        <svg 
          className={`ml-1 h-4 w-4 inline transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          ref={panelRef}
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-md border bg-popover shadow-lg z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { 
      if (e.key === "Escape") onClose(); 
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      // Focus trap - focus the close button when opened
      closeButtonRef.current?.focus();
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  useEffect(() => {
    // Prevent body scroll when drawer is open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50" aria-modal="true" role="dialog" aria-labelledby="mobile-menu-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Drawer */}
      <nav 
        id="mobile-menu" 
        ref={ref} 
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl overflow-y-auto border-l"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-foreground">Menu</h2>
            <button 
              ref={closeButtonRef}
              className="p-2 rounded-md text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary" 
              aria-label="Close menu" 
              onClick={onClose}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Navigation groups */}
          {NAV.map(g => (
            <div key={g.label} className="mb-6">
              <div className="px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                {g.label}
              </div>
              <ul className="space-y-1">
                {g.items.map(it => (
                  <li key={it.to}>
                    <Link 
                      className="block px-3 py-2 rounded-md text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary" 
                      to={it.to} 
                      onClick={onClose}
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}