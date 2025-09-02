# Layout Map - Family Office Marketplace

## Global Layout Structure

### App Root (`App.tsx`)
```
ToolsProvider
  HelmetProvider
    ThemeProvider (next-themes)
      div.min-h-screen.bg-background.text-foreground
        BrandHeader
        MegaMenu
        Routes (main content)
        Toaster
        DevPanel
        AutoLoadDemo
        CTAStickyBar
```

### Header System
- **Primary Header**: `BrandHeader` - Global navigation with persona switching
- **Sub-Header**: Persona-specific navigation (families, pros, nil, healthcare)
- **MegaMenu**: Dropdown navigation overlay

### Brand Header Composition
```
Header Classes: bfo-header bfo-no-blur
- Logo section
- Persona navigation links
- User authentication status
- Mobile/desktop responsive
- Thin gold bottom border
```

### Footer System
- **BrandedFooter**: Compact black background with gold links
- Minimal design for all personas
- Copyright and essential links only

### Global Providers

#### ToolsProvider (`/contexts/ToolsContext.tsx`)
- Manages tool installation and availability
- Provides tool state across components

#### ThemeProvider (next-themes)
- Dark/light theme management
- System preference detection
- Theme persistence

#### HelmetProvider (react-helmet-async)
- SEO meta tag management
- Page title updates
- Open Graph tags

### Layout Patterns

#### Protected Routes
- Require authentication via SupaBase
- Redirect to login if unauthenticated
- User session management

#### Public Routes
- No authentication required
- Marketing and landing pages
- Demo content access

#### Admin Routes
- Additional role-based access control
- Admin-only components and data
- Enhanced security policies

### Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints
- Adaptive navigation patterns
- Touch-friendly interactions

### Global State Management
- Supabase client for backend state
- Local state via React hooks
- Context providers for shared state
- Feature flag system integration

### SEO Implementation
- Meta tags via react-helmet-async
- Semantic HTML structure
- Open Graph protocol
- Twitter Card support
- Canonical URLs