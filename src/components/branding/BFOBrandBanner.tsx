'use client';

import * as React from "react";
import { Link } from "react-router-dom";
import { Megaphone, NotebookPen, Calculator, LayoutDashboard, BookOpenCheck, Bolt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuickLink = { label: string; to: string; icon?: React.ReactNode; badge?: string; };
type Announcement = { id: string; text: string; to?: string; emphasize?: boolean };

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
  cta?: { label: string; to: string };
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
      {/* Permanent Masthead */}
      <div className={cn(
        "border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        withGradient && "bg-gradient-to-b from-background/95 to-background/60"
      )}>
        <div className="container mx-auto h-14 px-4">
          <div className="flex h-full items-center justify-between gap-3">
            {/* Brand */}
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
                <Button variant="ghost" size="sm" className="text-xs">Privacy</Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="ghost" size="sm" className="text-xs">Marketplace</Button>
              </Link>
              {cta ? (
                <Link to={cta.to}>
                  <Button size="sm" className="text-xs">{cta.label}</Button>
                </Link>
              ) : (
                <Link to="/get-started">
                  <Button size="sm" className="text-xs">Get Started</Button>
                </Link>
              )}
            </div>

            {/* Mobile CTA / icon row */}
            <div className="flex items-center gap-1 sm:hidden">
              <Link to="/get-started"><Button size="sm">Start</Button></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Intermittent Announcement(s) */}
      {activeAnnouncements.length > 0 && (
        <div className="w-full border-b bg-primary/10">
          {activeAnnouncements.map((a) => (
            <div
              key={a.id}
              className="container mx-auto flex items-center justify-between gap-4 px-4 py-1.5"
            >
              <div className="flex items-center gap-2 text-sm">
                <Megaphone className="h-4 w-4 text-primary" aria-hidden />
                <p className={cn("leading-tight", a.emphasize && "font-semibold")}>
                  {a.to ? <Link to={a.to} className="underline underline-offset-2">{a.text}</Link> : a.text}
                </p>
              </div>
              <button
                aria-label="Dismiss announcement"
                onClick={() => dismiss(a.id)}
                className="text-xs text-muted-foreground hover:underline"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Banner: notes, recommendations, calculators, dashboards, studies */}
      <div className="w-full border-b bg-muted/40">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-4 py-2">
          {(sublinks.length ? sublinks : DEFAULT_SUBLINKS).map((s) => (
            <Link
              key={`${s.to}-${s.label}`}
              to={s.to}
              className="group inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {s.icon ?? <NotebookPen className="h-3.5 w-3.5" aria-hidden />}
              <span>{s.label}</span>
              {s.badge && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">{s.badge}</Badge>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A small reusable "square bug" you can pin on corners or cards */
export function BFOCornerBug({
  position = "bottom-right",
  emblemSrc = "/brand/bfo-emblem-gold.png",
  to = "/",
  className,
}: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; emblemSrc?: string; to?: string; className?: string }) {
  const pos = {
    "top-left": "left-3 top-3",
    "top-right": "right-3 top-3",
    "bottom-left": "left-3 bottom-3",
    "bottom-right": "right-3 bottom-3",
  }[position];

  return (
    <Link
      to={to}
      aria-label="Boutique Family Office"
      className={cn(
        "fixed z-40 rounded-md border bg-background/80 p-2 shadow-sm backdrop-blur hover:shadow-md",
        pos,
        className
      )}
    >
      <img src={emblemSrc} alt="BFO emblem" className="h-6 w-6" />
    </Link>
  );
}

/* sensible defaults for your "book-looking field" of quick actions */
const DEFAULT_SUBLINKS: QuickLink[] = [
  { label: "Notes", to: "/workspace/notes", icon: <NotebookPen className="h-3.5 w-3.5" /> },
  { label: "Recommendations", to: "/workspace/recommendations", icon: <BookOpenCheck className="h-3.5 w-3.5" /> },
  { label: "Dashboards", to: "/client-dashboard", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { label: "Calculators", to: "/calculators", icon: <Calculator className="h-3.5 w-3.5" /> },
  { label: "Studies", to: "/studies", icon: <Bolt className="h-3.5 w-3.5" /> },
];