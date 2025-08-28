# JSON-LD Samples Report

## Overview
Final JSON-LD implementations after applying jsonLdSafe() security patches.

## Sample JSON-LD Outputs

### 1. SEOHead.tsx - WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MyBFOCFO",
  "description": "Complete family office platform for financial planning, compliance, and wealth management",
  "url": "https://mybfocfo.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://mybfocfo.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 2. SchemaBreadcrumbs.tsx - BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://mybfocfo.com/"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "Current Page",
      "item": "https://mybfocfo.com/current"
    }
  ]
}
```

### 3. SchemaOrganization.tsx - Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyBFOCFO",
  "url": "https://mybfocfo.com",
  "logo": "https://mybfocfo.com/logo.png"
}
```

### 4. SchemaWebSite.tsx - WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MyBFOCFO",
  "url": "https://mybfocfo.com",
  "publisher": {
    "@type": "Organization",
    "name": "MyBFOCFO",
    "logo": "https://mybfocfo.com/logo.png"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mybfocfo.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 5. SchemaLocalBusiness.tsx - LocalBusiness Schema
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Example Business",
  "url": "https://example.com",
  "description": "Create NIL campaigns with compliant briefs, approvals and payments in one place.",
  "areaServed": "US",
  "knowsAbout": ["NIL campaigns", "Brand sponsorships", "Ambassador programs", "Local events"],
  "category": "Marketing",
  "priceRange": "$$"
}
```

## Security Features Applied

All JSON-LD implementations now use `jsonLdSafe()` which:

1. **Prevents Script Breakouts**: Escapes `<` and `>` characters as `\u003C` and `\u003E`
2. **Prevents HTML Parsing**: Escapes `&` characters as `\u0026`  
3. **Prevents Script Tag Injection**: Escapes `</script>` patterns as `<\/script`
4. **Preserves JSON Structure**: Unlike DOMPurify, maintains valid JSON-LD format

## Rich Results Testing

These JSON-LD snippets can be tested using:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Bing Markup Validator](https://www.bing.com/toolbox/markup-validator)

## View Source Verification

In browser view-source, you should see properly escaped JSON-LD:
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"MyBFOCFO"...}
</script>
```

Note: The JSON content will contain `\u003C` and `\u003E` escape sequences instead of raw `<` and `>` characters.