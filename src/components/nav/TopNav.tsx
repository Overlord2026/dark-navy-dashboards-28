import { useState } from "react";
import { Link } from "react-router-dom";
import { usePersonaContext } from "@/context/persona-context";

export default function TopNav({ showSubBanner = true }: {
  showSubBanner?: boolean;
}) {
  const { personaRoot, setPersonaRoot, currentMenu, servicesMenu, solutionsMenu, ctas } = usePersonaContext();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <header className="w-full bg-background border-b border-border">
      {/* Masthead */}
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/brand/bfo-horizontal.svg" alt="Boutique Family Office" className="h-7" />
        </Link>

        <nav className="hidden md:flex items-center gap-2 relative">
          <NavButton
            label={currentMenu.label}
            onOpen={() => setOpen(open === "persona" ? null : "persona")}
            active={open === "persona"}
          />
          {open === "persona" && (
            <MenuPanel onClose={() => setOpen(null)} width="w-[340px]">
              {currentMenu.groups.map(g => (
                <div key={g.heading} className="mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{g.heading}</div>
                  <ul className="mt-2 space-y-1">
                    {g.items.map(it => (
                      <li key={it.href}>
                        <Link to={it.href} className="block rounded-md px-3 py-2 hover:bg-accent text-foreground">
                          <div className="text-sm font-medium">{it.label}</div>
                          {it.description && <div className="text-xs text-muted-foreground">{it.description}</div>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* Quick toggle */}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button 
                  onClick={() => setPersonaRoot("families")} 
                  className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${
                    personaRoot === "families" 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-border hover:bg-accent"
                  }`}
                >
                  Families
                </button>
                <button 
                  onClick={() => setPersonaRoot("professionals")} 
                  className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${
                    personaRoot === "professionals" 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-border hover:bg-accent"
                  }`}
                >
                  Professionals
                </button>
              </div>
            </MenuPanel>
          )}

          <NavButton 
            label={servicesMenu.label} 
            onOpen={() => setOpen(open === "services" ? null : "services")} 
            active={open === "services"} 
          />
          {open === "services" && <MegaMenu config={servicesMenu} onClose={() => setOpen(null)} />}

          <NavButton 
            label={solutionsMenu.label} 
            onOpen={() => setOpen(open === "solutions" ? null : "solutions")} 
            active={open === "solutions"} 
          />
          {open === "solutions" && <MegaMenu config={solutionsMenu} onClose={() => setOpen(null)} />}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/auth/signin" className="px-3 py-2 rounded-md hover:bg-accent text-foreground">
            Sign In
          </Link>
          <Link 
            to={ctas.getStarted.href} 
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Sub-banner - only render if showSubBanner is true */}
      {showSubBanner && (
        <div className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 h-10 flex items-center gap-4 text-sm">
            <Link to="/notes" className="text-muted-foreground hover:text-foreground transition-colors">
              Notes
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/recommendations" className="text-muted-foreground hover:text-foreground transition-colors">
              Recommendations
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/dashboards" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboards
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/calculators" className="text-muted-foreground hover:text-foreground transition-colors">
              Calculators
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/studies" className="text-muted-foreground hover:text-foreground transition-colors">
              Studies
            </Link>

            <div className="ml-auto">
              <Link 
                to={ctas.valueCalculator.href} 
                className="px-3 py-1.5 rounded-md border border-border hover:bg-accent text-foreground text-xs font-medium"
              >
                {ctas.valueCalculator.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavButton({ label, onOpen, active }: { label: string; onOpen: () => void; active: boolean; }) {
  return (
    <button 
      onClick={onOpen} 
      className={`px-3 py-2 rounded-md hover:bg-accent transition-colors ${
        active ? "bg-accent" : ""
      }`}
    >
      {label}
    </button>
  );
}

function MenuPanel({ 
  children, 
  onClose, 
  width = "w-[640px]" 
}: { 
  children: React.ReactNode; 
  onClose: () => void; 
  width?: string; 
}) {
  return (
    <div 
      className={`absolute top-full left-0 mt-2 ${width} rounded-xl border border-border bg-popover shadow-xl p-4 z-50`} 
      onMouseLeave={onClose}
    >
      {children}
    </div>
  );
}

function MegaMenu({ 
  config, 
  onClose 
}: { 
  config: { 
    label: string; 
    groups: {
      heading: string;
      items: {
        label: string;
        href: string;
        description?: string;
      }[];
    }[];
  }; 
  onClose: () => void; 
}) {
  return (
    <MenuPanel onClose={onClose}>
      <div className="grid grid-cols-2 gap-6">
        {config.groups.map(g => (
          <div key={g.heading}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {g.heading}
            </div>
            <ul className="space-y-1">
              {g.items.map(it => (
                <li key={it.href}>
                  <Link 
                    to={it.href} 
                    className="block rounded-md px-3 py-2 hover:bg-accent transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground">{it.label}</div>
                    {it.description && (
                      <div className="text-xs text-muted-foreground">{it.description}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </MenuPanel>
  );
}