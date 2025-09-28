import React from "react";
import { Link } from "react-router-dom";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-white/70">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {it.href && !isLast ? (
                <Link to={it.href} className="underline-offset-4 hover:underline">
                  {it.label}
                </Link>
              ) : (
                <span className={isLast ? "opacity-100" : "opacity-70"}>{it.label}</span>
              )}
              {!isLast && <span className="mx-1 opacity-40">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}