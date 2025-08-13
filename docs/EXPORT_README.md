# My.BFOCFO — Complete Application Export

## Project Overview

**My.BFOCFO** is a comprehensive Family Office Marketplace platform that provides a multi-persona operating system for financial professionals, families, and advisory services. This export contains the complete source code, architecture documentation, and deployment artifacts for external review and optimization analysis.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git
- Supabase CLI (optional, for local development)

### Local Setup

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd mybfocfo
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

4. **Run Tests (if available)**
   ```bash
   npm run test
   npm run cypress:open
   ```

### Environment Variables Required

See `.env.example` for all required environment variables:

- **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Payment Processing**: Stripe keys
- **Email/SMS**: SendGrid, Twilio credentials
- **External APIs**: Plaid, DocuSign, various data providers
- **AI Services**: OpenAI, other AI provider keys

## Architecture Overview

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite build system
- Tailwind CSS + shadcn/ui components
- React Router for routing
- React Query for state management
- Framer Motion for animations

**Backend & Database:**
- Supabase (PostgreSQL + Edge Functions)
- Row-Level Security (RLS) for data protection
- Real-time subscriptions
- File storage with bucket policies

**Key Libraries:**
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icons
- `recharts` - Data visualization
- `react-hook-form` + `zod` - Form handling & validation
- `date-fns` - Date manipulation

### Core Features

1. **Multi-Persona System** - Role-based access (Family, Advisor, CPA, Attorney, Admin)
2. **Financial Education Center** - Public educational resources
3. **Portfolio Management** - Holdings, transactions, performance tracking
4. **Document Management** - Upload, e-signature, vault storage
5. **Compliance & Audit** - Full audit trails, RLS security
6. **SWAG™ Planning** - Strategic Wealth Alpha GPS planning system
7. **Alternative Investments** - Private markets, capital calls, distributions
8. **Communication Hub** - Messages, tasks, notifications
9. **Banking & Transfers** - ACH transfers, account linking
10. **Billing & Subscriptions** - Stripe integration for payments

### Security Architecture

- **Authentication**: Supabase Auth with email/password and magic links
- **Authorization**: Row-Level Security (RLS) policies on all tables
- **Data Encryption**: At rest and in transit
- **Audit Logging**: Comprehensive audit trails for all operations
- **API Security**: JWT verification, rate limiting
- **File Security**: Secure bucket policies for document storage

## Database Schema

### Core Tables

#### Users & Authentication
- `profiles` - Extended user information beyond auth.users
- `user_roles` - Role-based access control
- `user_sessions` - Session management

#### Multi-Persona System
- `family_members` - Family office members and relationships
- `advisor_client_links` - Advisor-client relationships
- `cpa_clients` - CPA client relationships
- `attorney_clients` - Attorney client relationships

#### Financial Data
- `accounts` - Bank and investment accounts
- `holdings` - Portfolio positions
- `transactions` - Transaction history
- `account_performance` - Performance tracking

#### Document & Compliance
- `documents` - Document metadata and storage references
- `document_signatures` - E-signature tracking
- `audit_logs` - Comprehensive audit trail
- `compliance_checks` - Compliance validation records

#### Communication & Tasks
- `messages` - Inter-user messaging
- `tasks` - Task management system
- `notifications` - System notifications

#### Alternative Investments
- `alt_investments` - Alternative investment tracking
- `capital_calls` - Capital call management
- `distributions` - Distribution tracking
- `k1_documents` - K-1 tax document management

### RLS Policy Summary

All tables implement Row-Level Security with policies ensuring:
- Users can only access their own data
- Advisors can access their clients' data
- CPAs can access their clients' data
- Attorneys can access their clients' data
- Admins have elevated access where appropriate
- Service role has full access for system operations

## API Endpoints

### Edge Functions

**Public Endpoints (no JWT required):**
- `ai-analysis` - AI-powered analysis services
- `leads-invite` - Public invitation system
- `events-track` - Analytics tracking
- `generate-otp` / `verify-otp` - Authentication flow
- `market-data` - Public market data
- `brand-get` - Public branding API
- `fees-calc` - Fee calculation with demo mode

**Authenticated Endpoints:**
- `plaid-*` - Plaid integration for account linking
- `stripe-*` - Payment processing
- `alternative-investments` - Alt investment management
- `parse-retirement-pdf` - Document parsing
- `healthcare-file-operations` - Healthcare document handling

**Webhook Endpoints:**
- `stripe-ach-webhook` - Stripe ACH webhook handler
- `finnhub-webhook` - Market data webhooks
- `webhook-recording-*` - Meeting recording webhooks

### Request/Response Patterns

Most endpoints follow REST-like patterns:
```typescript
// Standard response format
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Error handling
interface ApiError {
  error: string;
  details?: string;
  code?: string;
}
```

## Component Inventory

### Design System

**Base Components (shadcn/ui):**
- `Button` - Primary, secondary, outline, ghost variants
- `Input` - Text, email, password, search inputs
- `Card` - Container components with consistent styling
- `Dialog` - Modal dialogs and overlays
- `Toast` - Notification system
- `Table` - Data tables with sorting and filtering
- `Form` - Form components with validation

**Custom Components:**
- `ThreeColumnLayout` - Main application layout
- `NavSidebar` - Navigation sidebar with role-based items
- `UserMenu` - User profile and settings menu
- `DocumentViewer` - PDF and document viewing
- `PerformanceChart` - Financial performance visualization
- `TaskCard` - Task management interface
- `MessageThread` - Communication interface

### Theme & Styling

**Color Palette:**
- Primary: Gold (#FFD700) - High contrast for accessibility
- Secondary: Deep Blue (#14213D) - Professional, premium feel
- Accent: Emerald (#169873) - Success states and highlights
- Background: Dark gradient theme for premium feel

**Typography:**
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Code: SF Mono (monospace)

**Responsive Design:**
- Mobile-first approach
- Touch targets minimum 44px
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Known Issues & Technical Debt

### Security & Performance
1. **RLS Policies**: Some tables have RLS enabled but no policies (see linter report)
2. **Query Optimization**: Large tables may need indexing optimization
3. **Bundle Size**: Consider code splitting for better performance
4. **Cache Strategy**: Implement more aggressive caching for static data

### UX & Accessibility
1. **Mobile Navigation**: Improve mobile sidebar experience
2. **Keyboard Navigation**: Enhance keyboard accessibility
3. **Loading States**: Add more granular loading indicators
4. **Error Boundaries**: Implement comprehensive error boundaries

### Code Quality
1. **TypeScript**: Strengthen type safety (some `noImplicitAny: false`)
2. **Test Coverage**: Increase unit and integration test coverage
3. **Documentation**: Add JSDoc comments to complex functions
4. **Component Split**: Some components are too large and should be split

### Infrastructure
1. **Monitoring**: Implement comprehensive error tracking
2. **Performance**: Add performance monitoring and alerting
3. **Backup Strategy**: Implement automated backup verification
4. **Deployment**: Automate deployment pipeline

## Quick Wins

### Immediate Improvements (1-2 days)
1. Fix RLS policies on tables without policies
2. Add proper error boundaries to prevent white screens
3. Implement skeleton loading states for better perceived performance
4. Add keyboard navigation to all interactive elements

### Short-term Improvements (1-2 weeks)
1. Implement comprehensive test suite
2. Add performance monitoring and alerting
3. Optimize bundle size with code splitting
4. Improve mobile responsive design

### Medium-term Improvements (1-2 months)
1. Implement offline capability for critical features
2. Add comprehensive analytics and user behavior tracking
3. Implement advanced caching strategies
4. Add comprehensive documentation and developer guides

## Deployment & Operations

### Current Deployment
- **Frontend**: Lovable platform deployment
- **Backend**: Supabase hosted
- **CDN**: Static assets via Supabase storage
- **SSL**: Automatic via hosting platform

### Environment Matrix
- **Development**: Local with Supabase project
- **Staging**: Preview deployments on Lovable
- **Production**: Main branch deployment

### Monitoring
- **Error Tracking**: Basic browser error logging
- **Performance**: Core Web Vitals monitoring
- **Uptime**: Hosting platform monitoring
- **Database**: Supabase dashboard monitoring

## Support & Maintenance

### Critical Dependencies
- React 18.3.1
- Supabase 2.49.8
- TypeScript 5.5.3
- Tailwind CSS 3.4.11

### Update Strategy
- Monthly dependency updates with testing
- Quarterly framework updates
- Immediate security patch deployment

### Backup Strategy
- Daily automated database backups via Supabase
- Code versioning via Git
- Asset backup via Supabase storage replication

## Export Contents

This export includes:
- ✅ Complete source code with lockfiles
- ✅ Architecture documentation with diagrams
- ✅ Database schema and RLS policies
- ✅ Environment template and configuration
- ✅ Component inventory and design system
- ✅ API documentation and integration notes
- ✅ Known issues and improvement roadmap
- ✅ Deployment and operations notes
- ✅ Security analysis and recommendations

---

**Generated**: 2024-12-26
**Version**: Production v2.1.0
**Contact**: Development Team