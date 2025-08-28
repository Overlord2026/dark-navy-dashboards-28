import React from 'react';
import { jsonLdSafe } from '@/lib/jsonLd';
import site from '@/config/site.json';

export default function SchemaWebSite() {
  const sd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": site.orgName,
    "url": site.url,
    "publisher": { "@type": "Organization", "name": site.orgName, "logo": site.logoUrl },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${site.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(sd) }} />;
}