# CPA Publish Gap Checklist

## Critical (P0) - Must Fix Before Launch

| Issue | Owner | Route/File | Status | ETA |
|-------|-------|------------|--------|-----|
| Missing TaxHub Pro Console | Dev | `/taxhub/pro` | ❌ NOT STARTED | 2h |
| Missing CPA Tools Hub | Dev | `/cpa/tools` | ❌ NOT STARTED | 1h |
| Missing CPA Learning Center | Dev | `/cpa/learn` | ❌ NOT STARTED | 1h |
| ProInquiry form integration | Dev | `src/pages/marketplace/CpaProfile.tsx` | ❌ NOT STARTED | 30m |

## High Priority (P1) - Fix This Week

| Issue | Owner | Route/File | Status | ETA |
|-------|-------|------------|--------|-----|
| Brand consistency - GoldButton usage | Dev | `src/pages/cpas/CpaHome.tsx` | ❌ NOT STARTED | 15m |
| PersonaSubHeader missing | Dev | `src/pages/marketplace/CpaMarketplace.tsx` | ❌ NOT STARTED | 10m |
| SEO titles optimization | Dev | Multiple CPA pages | ❌ NOT STARTED | 30m |
| Form accessibility labels | Dev | All CPA forms | ❌ NOT STARTED | 45m |

## Medium Priority (P2) - Next Sprint

| Issue | Owner | Route/File | Status | ETA |
|-------|-------|------------|--------|-----|
| Mobile responsiveness audit | QA | All CPA pages | ❌ NOT STARTED | 1h |
| Receipt system integration | Dev | TaxHub Pro components | ❌ NOT STARTED | 2h |
| CE requirements tracking | Dev | Learning center components | ❌ NOT STARTED | 1.5h |
| Client portal integration | Dev | CPA dashboard | ❌ NOT STARTED | 3h |

## Low Priority (P3) - Future Iterations

| Issue | Owner | Route/File | Status | ETA |
|-------|-------|------------|--------|-----|
| Advanced filtering on CPA marketplace | Dev | `src/pages/marketplace/CpaMarketplace.tsx` | ❌ NOT STARTED | 2h |
| Bulk client import | Dev | TaxHub Pro | ❌ NOT STARTED | 4h |
| Advanced reporting dashboard | Dev | CPA analytics | ❌ NOT STARTED | 6h |
| Third-party integrations | Dev | External tax software | ❌ NOT STARTED | 8h |

## Completed Items ✅

| Issue | Owner | Route/File | Status | Completed |
|-------|-------|------------|--------|-----------|
| CPA Home page structure | Dev | `src/pages/cpas/CpaHome.tsx` | ✅ DONE | Previous |
| CPA Marketplace listing | Dev | `src/pages/marketplace/CpaMarketplace.tsx` | ✅ DONE | Previous |
| CPA Profile pages | Dev | `src/pages/marketplace/CpaProfile.tsx` | ✅ DONE | Previous |
| Basic routing structure | Dev | `src/App.tsx` | ✅ DONE | Previous |

## Technical Debt

### Code Quality Issues
- [ ] Consistent error handling across CPA components
- [ ] TypeScript strict mode compliance
- [ ] Unit test coverage for CPA-specific components
- [ ] Performance optimization for large client lists

### Security Issues  
- [ ] Input validation on all CPA forms
- [ ] Rate limiting on contact forms
- [ ] Audit trail for sensitive CPA operations
- [ ] Secure file upload for tax documents

### Performance Issues
- [ ] Lazy loading for tax calculation components
- [ ] Caching strategy for CPA marketplace data
- [ ] Optimize bundle size for CPA-specific routes
- [ ] Database query optimization for client searches

## Definition of Done

For each CPA route to be considered "production ready":

1. **Functional Requirements**
   - ✅ Route exists and loads without 404
   - ✅ Uses consistent brand styling (bfo-card, GoldButton)
   - ✅ Proper header/subheader structure
   - ✅ Mobile responsive design
   - ✅ Form validation and error handling

2. **SEO Requirements**
   - ✅ Proper title tag with CPA keywords
   - ✅ Meta description under 160 characters
   - ✅ H1 tag matches page intent
   - ✅ Semantic HTML structure
   - ✅ Image alt attributes

3. **Accessibility Requirements**
   - ✅ Form labels and keyboard navigation
   - ✅ Color contrast compliance
   - ✅ Screen reader compatibility
   - ✅ Focus management

4. **Security Requirements**
   - ✅ Input sanitization
   - ✅ CSRF protection on forms
   - ✅ Secure data handling
   - ✅ Rate limiting

## Next Steps

1. **Immediate Actions** (Next 4 hours)
   - Create TaxHub Pro console stub
   - Create CPA tools hub stub  
   - Create CPA learning center stub
   - Wire ProInquiry form in CPA profiles

2. **This Week** (Next 5 days)
   - Complete brand consistency fixes
   - Add missing PersonaSubHeaders
   - Optimize SEO across all CPA pages
   - Complete accessibility audit

3. **Next Sprint** (Next 2 weeks)
   - Mobile responsiveness testing
   - Receipt system integration
   - CE tracking functionality
   - Client portal features

## Success Metrics

- 🎯 **Zero 404s** on CPA routes
- 🎯 **100% brand consistency** across CPA pages  
- 🎯 **Accessibility score 95+** on all CPA pages
- 🎯 **Mobile responsiveness 100%** across devices
- 🎯 **Page load time <2s** for all CPA routes