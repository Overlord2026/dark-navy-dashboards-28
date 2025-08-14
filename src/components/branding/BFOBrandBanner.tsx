'use client';

import * as React from "react";
import { Link } from "react-router-dom";
import { Megaphone, NotebookPen, Calculator, LayoutDashboard, BookOpenCheck, Bolt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuickLink = { label: string; href: string; icon?: React.ReactNode; badge?: string; };
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
  // Stub out to prevent duplicate banners
  return null;
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
  { label: "Notes", href: "/workspace/notes", icon: <NotebookPen className="h-3.5 w-3.5" /> },
  { label: "Recommendations", href: "/workspace/recommendations", icon: <BookOpenCheck className="h-3.5 w-3.5" /> },
  { label: "Dashboards", href: "/client-dashboard", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
  { label: "Calculators", href: "/calculators", icon: <Calculator className="h-3.5 w-3.5" /> },
  { label: "Studies", href: "/studies", icon: <Bolt className="h-3.5 w-3.5" /> },
];