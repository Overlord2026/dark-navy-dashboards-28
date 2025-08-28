import React from 'react';
import { jsonLdSafe } from '@/lib/jsonLd';
import site from '@/config/site.json';

export default function SchemaOrganization() {
  const sd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": site.orgName,
    "url": site.url,
    "logo": site.logoUrl,
    ...(site.sameAs?.length ? { "sameAs": site.sameAs } : {}),
    ...(site.contactPoint?.length ? { "contactPoint": site.contactPoint.map((c: any) => ({ "@type": "ContactPoint", ...c })) } : {})
  };
  
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(sd) }} />;
}