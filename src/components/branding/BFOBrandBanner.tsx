'use client';

import * as React from "react";
import { Link } from "react-router-dom";
import { Megaphone, NotebookPen, Calculator, LayoutDashboard, BookOpenCheck, Bolt, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuickLink = { 
  label: string; 
  href: string; 
  icon?: React.ReactNode; 
  badge?: string; 
};

type Announcement = { 
  id: string; 
  text: string; 
  href?: string; 
  emphasize?: boolean 
};

export type BFOBrandBannerProps = {
  /** Path (public/) to a horizontal BFO wordmark */
  wordmarkSrc?: string;
  /** Path to the gold tree mark (square) */
  emblemSrc?: string;
  /** Show the intermittent announcement bar */
  announcements?: Announcement[];
  /** Sub-banner quick links (notes, recs, dashboards, calculators, etc.) */
  sublinks?: QuickLink[];
  /** Optional right-side CTA in masthead */
  cta?: { label: string; href: string };
  /** When true, the banner casts a subtle gradient underlay */
  withGradient?: boolean;
  /** Optional className passthrough */
  className?: string;
};

export function BFOBrandBanner({
  wordmarkSrc = "/brand/bfo-wordmark-white-gold.png",
  emblemSrc = "/brand/bfo-emblem-gold.png",
  announcements = [],
  sublinks = [],
  cta,
  withGradient = true,
  className,
}: BFOBrandBannerProps) {
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  React.useEffect(() => {
    const raw = localStorage.getItem("bfo_announcement_dismissed");
    if (raw) setDismissed(JSON.parse(raw));
  }, []);

  const dismiss = (id: string) => {
    const next = Array.from(new Set([...dismissed, id]));
    setDismissed(next);
    localStorage.setItem("bfo_announcement_dismissed", JSON.stringify(next));
  };

  const activeAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  return (
    <div className={cn("sticky top-0 z-50 w-full", className)}>
      {/* Dark Navy Masthead with 90-95% opacity + blur */}
      <div className={cn(
        "border-b border-border bg-navy/95 backdrop-blur-md supports-[backdrop-filter]:bg-navy/90",
        withGradient && "bg-gradient-to-b from-navy/95 to-navy/90"
      )}>
        <div className="container mx-auto h-14 px-4">
          <div className="flex h-full items-center justify-between gap-3">
            {/* Brand - emblem h-7, wordmark h-6 desktop, emblem only mobile */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={emblemSrc}
                alt="BFO emblem"
                className="h-7 w-auto"
              />
              <img
                src={wordmarkSrc}
                alt="Boutique Family Office"
                className="hidden h-6 w-auto sm:block"
              />
            </Link>

            {/* Right cluster */}
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/privacy">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-navy-foreground hover:bg-navy-foreground/10"
                >
                  Privacy
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-navy-foreground hover:bg-navy-foreground/10"
                >
                  Marketplace
                </Button>
              </Link>
              {cta ? (
                <Link to={cta.href}>
                  <Button 
                    size="sm" 
                    className="text-xs bg-gold text-navy hover:bg-gold/90"
                  >
                    {cta.label}
                  </Button>
                </Link>
              ) : (
                <Link to="/get-started">
                  <Button 
                    size="sm" 
                    className="text-xs bg-gold text-navy hover:bg-gold/90"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile CTA - keep persistent */}
            <div className="flex items-center gap-1 sm:hidden">
              <Link to="/get-started">
                <Button 
                  size="sm" 
                  className="bg-gold text-navy hover:bg-gold/90"
                >
                  Start
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Intermittent Announcement(s) - short with emphasize support */}
      {activeAnnouncements.length > 0 && (
        <div className="w-full border-b border-border bg-gold/10">
          {activeAnnouncements.map((a) => (
            <div
              key={a.id}
              className="container mx-auto flex items-center justify-between gap-4 px-4 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <Megaphone className="h-4 w-4 text-gold" aria-hidden />
                <p className={cn(
                  "leading-tight text-foreground",
                  a.emphasize && "font-semibold"
                )}>
                  {a.href ? (
                    <Link 
                      to={a.href} 
                      className="underline underline-offset-2 hover:text-gold transition-colors"
                    >
                      {a.text}
                    </Link>
                  ) : (
                    a.text
                  )}
                </p>
              </div>
              <button
                aria-label="Dismiss announcement"
                onClick={() => dismiss(a.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Banner: "Pretty book-looking field" with pill buttons */}
      <div className="w-full border-b border-border bg-muted/20">
        <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2">
          {(sublinks.length ? sublinks : DEFAULT_SUBLINKS).map((s) => (
            <Link
              key={`${s.href}-${s.label}`}
              to={s.href}
              className="group inline-flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1.5 text-xs font-medium transition-all hover:bg-background/80 hover:shadow-sm whitespace-nowrap"
            >
              {s.icon ?? <NotebookPen className="h-3.5 w-3.5" aria-hidden />}
              <span>{s.label}</span>
              {s.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-4 px-1.5 py-0 text-[10px] bg-gold/20 text-gold-foreground"
                >
                  {s.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A small reusable "square bug" for brand anchor on calculators/dashboards */
export function BFOCornerBug({
  position = "bottom-right",
  emblemSrc = "/brand/bfo-emblem-gold.png",
  href = "/",
  className,
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; 
  emblemSrc?: string; 
  href?: string; 
  className?: string 
}) {
  const positionClasses = {
    "top-left": "left-3 top-3",
    "top-right": "right-3 top-3",
    "bottom-left": "left-3 bottom-3",
    "bottom-right": "right-3 bottom-3",
  }[position];

  return (
    <Link
      to={href}
      aria-label="Boutique Family Office"
      className={cn(
        "fixed z-40 rounded-md border border-border bg-background/80 p-2 shadow-sm backdrop-blur hover:shadow-md transition-all hover:scale-105",
        positionClasses,
        className
      )}
    >
      <img src={emblemSrc} alt="BFO emblem" className="h-6 w-6" />
    </Link>
  );
}

/* Default sublinks for the "book-looking field" of quick actions */
const DEFAULT_SUBLINKS: QuickLink[] = [
  { 
    label: "Notes", 
    href: "/workspace/notes", 
    icon: <NotebookPen className="h-3.5 w-3.5" /> 
  },
  { 
    label: "Recommendations", 
    href: "/workspace/recommendations", 
    icon: <BookOpenCheck className="h-3.5 w-3.5" /> 
  },
  { 
    label: "Dashboards", 
    href: "/dashboards", 
    icon: <LayoutDashboard className="h-3.5 w-3.5" /> 
  },
  { 
    label: "Calculators", 
    href: "/calculators", 
    icon: <Calculator className="h-3.5 w-3.5" /> 
  },
  { 
    label: "Studies", 
    href: "/studies", 
    icon: <Bolt className="h-3.5 w-3.5" />, 
    badge: "New" 
  },
];
