# JSON-LD Security Scan Report

## Overview
Scanned src/** for `type="application/ld+json"` patterns and analyzed safety implementations.

## Findings

### ✅ SAFE IMPLEMENTATIONS (4 files)

**1. src/components/seo/SchemaBreadcrumbs.tsx:18**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(sd) }} />
```
Classification: **SAFE** - Uses jsonLdSafe helper

**2. src/components/seo/SchemaLocalBusiness.tsx:51**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(jsonLd) }} />
```
Classification: **SAFE** - Uses jsonLdSafe helper

**3. src/components/seo/SchemaOrganization.tsx:16**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(sd) }} />
```
Classification: **SAFE** - Uses jsonLdSafe helper

**4. src/components/seo/SchemaWebSite.tsx:19**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(sd) }} />
```
Classification: **SAFE** - Uses jsonLdSafe helper

### ⚠️ UNSAFE IMPLEMENTATIONS (1 file)

**5. src/components/seo/SEOHead.tsx:62-63**
```tsx
<script type="application/ld+json">
  {JSON.stringify({
```
Classification: **UNSAFE** - Uses direct JSON.stringify without dangerouslySetInnerHTML escaping

## Summary

- **Total JSON-LD implementations found:** 5
- **Safe implementations:** 4 (80%)
- **Unsafe implementations:** 1 (20%)

## Recommendations

1. **Fix SEOHead.tsx:** Replace direct JSON.stringify with jsonLdSafe helper and dangerouslySetInnerHTML pattern
2. **Monitor:** All new JSON-LD implementations should use the jsonLdSafe helper

## Security Benefits of jsonLdSafe Helper

The jsonLdSafe helper prevents:
- `</script>` tag breakouts
- HTML parsing edge cases
- XSS attacks via JSON-LD content
- Malformed JSON structure issues