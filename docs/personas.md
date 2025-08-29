# Persona Entry Points Documentation

This document outlines the persona-based entry points and navigation structure for the Family Office Marketplace MVP.

## Overview

The platform supports 6 main persona types, each with dedicated dashboards, tools, and onboarding flows:

1. **Financial Advisors** (`/personas/advisors`)
2. **Insurance Agents** (`/personas/insurance`)
3. **Accountants/CPAs** (`/personas/accountants`)
4. **Estate Planning Attorneys** (`/personas/attorneys`)
5. **Retiree Families** (`/personas/families/retirees`)
6. **Aspiring Families** (`/personas/families/aspiring`)

## Persona Dashboard Structure

Each persona dashboard follows a consistent structure:

### Hero Section
- **Badge**: Persona identifier
- **Headline**: Value proposition specific to the persona
- **Description**: What the persona can accomplish on the platform
- **3 Primary CTAs**:
  - **Open Catalog**: Links to `/discover` with persona-specific query params
  - **Run 90-Second Demo**: Launches interactive demo modal
  - **Book 15-Min Overview**: Links to `/learn/{persona}/starter` page

### Tools Grid
- **Category-organized tools**: Each persona sees tools relevant to their workflow
- **Existing page links**: All tools link to existing pages in the app (no 404s)
- **Visual consistency**: Cards with icons, descriptions, and launch buttons

### Start Workspace CTA
- **Onboarding link**: Points to existing onboarding flows (`/start/{persona-type}`)
- **Prominent placement**: Encourages conversion to active user

## Persona-Specific Tool Mappings

### Financial Advisors
- Retirement Roadmap → `/family/tools/retirement`
- Roth Conversion Analyzer → `/family/tools/roth-ladder`
- Estate Workbench → `/estate/workbench`
- Tax Projector → `/family/tools/taxhub-preview`
- 401(k) Control Plane → `/family/tools/rmd-check`
- Client Vault → `/family/vault/autofill-consent`

### Insurance Agents
- Intake (Home/Auto) → `/insurance/intake`
- Quote Engine → `/quotes/start`
- Bind Policies → `/insurance/bind/new`
- FNOL (Claims) → `/insurance/fnol/new`

### Accountants/CPAs
- Estate Tax Planning → `/cpa/estate`
- Tax Projector → `/family/tools/taxhub-preview`
- Business Valuations → `/family/assets`
- Retirement Analysis → `/family/tools/retirement`

### Estate Planning Attorneys
- Estate Workbench → `/attorney/estate`
- Healthcare Directives → `/attorney/estate/health`
- Estate Review Sessions → `/estate/review/new`
- Document Templates → `/estate/diy`

### Retiree Families
- Wealth Vault → `/family/vault/autofill-consent`
- Health Hub → `/estate/healthcare`
- Annuities Explorer → `/solutions/annuities`
- Estate Planning → `/estate/diy`
- Insurance Catalog → `/solutions/insurance`
- Family Assets → `/family/assets`

### Aspiring Families
- Wealth Vault → `/family/vault/autofill-consent`
- Retirement Roadmap → `/family/tools/retirement`
- Lending Solutions → `/solutions/lending`
- Insurance Catalog → `/solutions/insurance`
- Investment Hub → `/solutions/investments`
- Family Assets → `/family/assets`

## Demo System

### DemoLauncher Component
- **Interactive demos**: 90-second scripted demos for each persona
- **Mock data**: Uses fixtures when `FIXTURES=true` environment variable is set
- **Progress tracking**: Visual progress bars and step navigation
- **Realistic workflows**: Simulates actual platform usage patterns

### Demo Scripts
Each persona has a tailored demo script with:
- **5 steps**: Logical workflow progression
- **90-second duration**: Quick but comprehensive overview
- **Mock data**: Realistic test data for each step
- **Action descriptions**: Clear explanations of what's happening

### Demo Features
- **Play/Pause controls**: Users can control demo pacing
- **Step navigation**: Jump to specific demo sections
- **Restart capability**: Reset demo to beginning
- **Completion tracking**: Visual feedback on demo progress

## Booking System

### Starter Pages (`/learn/{persona}/starter`)
- **Video placeholder**: Ready for video content when available
- **Feature overview**: Key platform capabilities for the persona
- **Calendly integration**: Direct booking links for each persona
- **Return navigation**: Easy access back to persona dashboard

### Calendly Integration
Each persona has a dedicated Calendly URL:
- `advisor` → `https://calendly.com/your-team/advisor-demo`
- `insurance` → `https://calendly.com/your-team/insurance-demo`
- `accountant` → `https://calendly.com/your-team/cpa-demo`
- `attorney` → `https://calendly.com/your-team/attorney-demo`
- `family-*` → `https://calendly.com/your-team/family-demo`

## Discover Integration

### Query Parameters
- **Persona targeting**: `?persona={persona_type}`
- **Solution filtering**: `?solutions={comma_separated_solutions}`

### Examples
- Advisors: `/discover?persona=advisor&solutions=retirement%2Ctax`
- Insurance: `/discover?persona=insurance&solutions=auto%2Chome%2Clife`
- Families: `/discover?persona=family&solutions=estate%2Chealth%2Cannuities`

## Navigation Integration

### Entry Points
- **Main navigation**: Add persona links to primary navigation
- **Homepage**: Featured persona cards
- **Professional pages**: Cross-links between personas
- **Onboarding flows**: Redirect to appropriate persona dashboard

### SEO Considerations
- **Persona-specific URLs**: Clear, crawlable paths
- **Meta descriptions**: Tailored for each persona
- **Structured data**: Professional service markup
- **Internal linking**: Strong cross-linking between related pages

## Smoke Testing

### SSR Safety Checklist
- [ ] All persona dashboards render without JavaScript
- [ ] No client-side dependencies in critical path
- [ ] Graceful degradation for interactive elements
- [ ] Proper error boundaries for demo components

### Functional Testing
- [ ] All tool links resolve to existing pages
- [ ] Demo launcher works with and without fixtures
- [ ] Booking pages load correctly for all personas
- [ ] Discover integration respects query parameters
- [ ] Onboarding flows accessible from workspace CTAs

### Performance Testing
- [ ] Persona dashboards load under 3 seconds
- [ ] Images optimized and properly sized
- [ ] Demo scripts load asynchronously
- [ ] No blocking external resources

## Future Enhancements

### Planned Improvements
1. **Dynamic content**: CMS-driven persona content
2. **A/B testing**: Optimize conversion funnels
3. **Analytics tracking**: User journey measurement
4. **Personalization**: Customized tool recommendations
5. **Video integration**: Professional demo videos
6. **Chat integration**: Real-time sales support

### Maintenance Tasks
- **Regular link checking**: Ensure no 404s in tool links
- **Demo script updates**: Keep demos current with platform changes
- **Calendly management**: Update booking links as needed
- **Performance monitoring**: Track page load times and conversion rates

## Implementation Notes

### Development
- **Component reusability**: Shared components between personas
- **Type safety**: TypeScript interfaces for demo scripts
- **Error handling**: Graceful fallbacks for missing data
- **Loading states**: Proper loading indicators throughout

### Deployment
- **Environment variables**: Configure Calendly URLs per environment
- **Feature flags**: Control persona dashboard visibility
- **Analytics setup**: Track persona-specific metrics
- **SEO optimization**: Persona-specific meta tags and structured data