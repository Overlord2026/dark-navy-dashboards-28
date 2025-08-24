import React from 'react';

type Props = {
  name: string;
  url: string;
  logo?: string;
  telephone?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;     // e.g., "US"
  sameAs?: string[];           // public social links
  category?: string;           // e.g., "Marketing" | "Sports"
  priceRange?: string;         // e.g., "$$"
};

export default function SchemaLocalBusiness(props: Props) {
  const {
    name, url, logo, telephone,
    streetAddress, addressLocality, addressRegion, postalCode, addressCountry,
    sameAs = [], category = "Marketing", priceRange = "$$"
  } = props;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "url": url,
    ...(logo ? {"logo": logo} : {}),
    ...(telephone ? {"telephone": telephone} : {}),
    "image": logo || undefined,
    "description": "Create NIL campaigns with compliant briefs, approvals and payments in one place.",
    "address": (streetAddress || addressLocality || addressRegion || postalCode || addressCountry) ? {
      "@type": "PostalAddress",
      ...(streetAddress ? {"streetAddress": streetAddress} : {}),
      ...(addressLocality ? {"addressLocality": addressLocality} : {}),
      ...(addressRegion ? {"addressRegion": addressRegion} : {}),
      ...(postalCode ? {"postalCode": postalCode} : {}),
      ...(addressCountry ? {"addressCountry": addressCountry} : {})
    } : undefined,
    "areaServed": "US",
    "knowsAbout": ["NIL campaigns","Brand sponsorships","Ambassador programs","Local events"],
    "category": category,
    ...(priceRange ? {"priceRange": priceRange} : {}),
    ...(sameAs.length ? {"sameAs": sameAs} : {})
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}