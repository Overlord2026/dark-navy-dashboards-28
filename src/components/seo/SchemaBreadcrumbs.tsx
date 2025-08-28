import React from 'react';
import { sanitizeHtml } from '@/lib/sanitize';

type Crumb = { name: string; item: string };

export default function SchemaBreadcrumbs({ items }: { items: Crumb[] }) {
  const sd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((c, i) => ({
      "@type": "ListItem", 
      "position": i + 1, 
      "name": c.name, 
      "item": c.item
    }))
  };
  
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: sanitizeHtml(JSON.stringify(sd)) }} />;
}