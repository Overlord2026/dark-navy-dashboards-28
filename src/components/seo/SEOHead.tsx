import { Helmet } from 'react-helmet-async';
import { jsonLdSafe } from '@/lib/jsonLd';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-default.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = [],
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('MyBFOCFO') ? title : `${title} | MyBFOCFO`;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mybfocfo.com';
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MyBFOCFO" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="author" content="MyBFOCFO" />
      
      {/* Schema.org JSON-LD for Better SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ 
        __html: jsonLdSafe({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MyBFOCFO",
          "description": "Complete family office platform for financial planning, compliance, and wealth management",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })
      }} />
    </Helmet>
  );
}