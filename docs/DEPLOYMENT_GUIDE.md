# 🚀 Deployment Guide - Family Office Marketplace

## Overview
This comprehensive deployment guide covers the complete process for deploying the Family Office Marketplace from development to production, including CI/CD pipeline, Supabase migrations, and monitoring setup.

## 📋 Pre-Deployment Checklist

### 🔍 Code Quality Gates
- [ ] **TypeScript Compilation**: `npm run build` passes without errors
- [ ] **Linting**: ESLint checks pass with zero errors
- [ ] **Testing**: All unit tests and E2E tests pass
- [ ] **Security Scan**: No critical vulnerabilities detected
- [ ] **Bundle Analysis**: Bundle size within acceptable limits

### 🗄️ Database Readiness
- [ ] **Migration Scripts**: All pending migrations tested
- [ ] **RLS Policies**: Row Level Security policies verified
- [ ] **Backup**: Production database backup completed
- [ ] **Performance**: Query performance optimized
- [ ] **Security**: Supabase security linter checks passed

### 🔐 Environment Configuration
- [ ] **Secrets Management**: All production secrets configured
- [ ] **API Keys**: Third-party service keys validated
- [ ] **Environment Variables**: Production values set
- [ ] **Domain Configuration**: DNS and SSL certificates ready

---

## 🏗️ CI/CD Pipeline Configuration

### GitHub Actions Workflow
```yaml
# .github/workflows/production-deployment.yml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.STAGING_URL }}

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level=high
      
      - name: Run Supabase security linter
        run: |
          npx supabase start
          npx supabase db lint

  build:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref != 'refs/heads/main'
    steps:
      - name: Deploy to staging
        run: echo "Deploy to staging environment"
        # Add staging deployment commands

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to production
        run: echo "Deploy to production environment"
        # Add production deployment commands
      
      - name: Run post-deployment tests
        run: npm run test:production
        env:
          PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
```

### Build Optimization
```typescript
// vite.config.ts production optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          analytics: ['posthog-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

---

## 🗄️ Supabase Migration Process

### Migration Workflow
```bash
# 1. Create new migration
supabase migration new add_feature_name

# 2. Write migration SQL
# Edit the generated migration file with your changes

# 3. Test migration locally
supabase db reset
supabase start

# 4. Validate migration
supabase db lint

# 5. Apply to staging
supabase db push --db-url $STAGING_DB_URL

# 6. Run integration tests
npm run test:integration

# 7. Apply to production (with approval)
supabase db push --db-url $PRODUCTION_DB_URL
```

### Migration Best Practices
```sql
-- migrations/20240903000000_example_migration.sql

-- 1. Always use transactions for complex migrations
BEGIN;

-- 2. Create new tables with proper RLS
CREATE TABLE public.new_feature_table (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable RLS immediately
ALTER TABLE public.new_feature_table ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
CREATE POLICY "Users can manage their own records" 
ON public.new_feature_table 
FOR ALL 
USING (auth.uid() = user_id);

-- 5. Create indexes for performance
CREATE INDEX idx_new_feature_user_id ON public.new_feature_table(user_id);
CREATE INDEX idx_new_feature_created_at ON public.new_feature_table(created_at);

-- 6. Add triggers for updated_at
CREATE TRIGGER update_new_feature_updated_at
    BEFORE UPDATE ON public.new_feature_table
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_touch_updated_at();

-- 7. Commit transaction
COMMIT;
```

### Rollback Procedures
```sql
-- Create rollback migration for emergency use
-- migrations/20240903000001_rollback_new_feature.sql

BEGIN;

-- Drop policies first
DROP POLICY IF EXISTS "Users can manage their own records" ON public.new_feature_table;

-- Drop triggers
DROP TRIGGER IF EXISTS update_new_feature_updated_at ON public.new_feature_table;

-- Drop indexes
DROP INDEX IF EXISTS idx_new_feature_user_id;
DROP INDEX IF EXISTS idx_new_feature_created_at;

-- Drop table
DROP TABLE IF EXISTS public.new_feature_table;

COMMIT;
```

---

## 🌐 Environment Configuration

### Production Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=https://xcmqjkvyvuhoslbzmlgi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]

# Authentication
JWT_SECRET=[production-jwt-secret]

# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Financial Data
PLAID_CLIENT_ID=[production-plaid-client-id]
PLAID_SECRET=[production-plaid-secret]
PLAID_ENV=production

# Email Service
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@mybfocfo.com

# Analytics
POSTHOG_KEY=[production-posthog-key]
POSTHOG_HOST=https://app.posthog.com

# Application
NODE_ENV=production
DOMAIN=mybfocfo.com
```

### Secret Management
```typescript
// lib/config.ts
export const config = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!
  },
  plaid: {
    clientId: process.env.PLAID_CLIENT_ID!,
    secret: process.env.PLAID_SECRET!,
    env: process.env.PLAID_ENV as 'sandbox' | 'production'
  }
}

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'PLAID_CLIENT_ID'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
```

---

## 🏗️ Deployment Procedures

### Staging Deployment
```bash
#!/bin/bash
# deploy-staging.sh

set -e

echo "🚀 Starting staging deployment..."

# 1. Pull latest code
git pull origin develop

# 2. Install dependencies
npm ci

# 3. Run tests
npm run test
npm run test:e2e

# 4. Build application
npm run build

# 5. Deploy to staging
# (Specific to your hosting provider)

# 6. Run smoke tests
npm run test:smoke:staging

echo "✅ Staging deployment complete!"
```

### Production Deployment
```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# 1. Verify we're on main branch
if [[ $(git branch --show-current) != "main" ]]; then
    echo "❌ Must be on main branch for production deployment"
    exit 1
fi

# 2. Ensure clean working directory
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Working directory must be clean"
    exit 1
fi

# 3. Pull latest changes
git pull origin main

# 4. Install production dependencies
npm ci --production

# 5. Run full test suite
npm run test:all

# 6. Build for production
NODE_ENV=production npm run build

# 7. Backup current production
echo "📦 Creating backup..."
# Add backup commands here

# 8. Deploy new version
echo "🚀 Deploying to production..."
# Add deployment commands here

# 9. Run post-deployment checks
echo "🔍 Running post-deployment checks..."
npm run test:production-health

# 10. Update monitoring
echo "📊 Updating monitoring..."
# Add monitoring setup commands

echo "✅ Production deployment complete!"
echo "🌐 Application available at: https://mybfocfo.com"
```

---

## 📊 Monitoring & Health Checks

### Application Health Monitoring
```typescript
// lib/healthCheck.ts
export class HealthChecker {
  async runHealthChecks(): Promise<HealthCheckResult[]> {
    const checks = [
      this.checkDatabase(),
      this.checkStripe(),
      this.checkPlaid(),
      this.checkEmail(),
      this.checkAnalytics()
    ]
    
    return Promise.all(checks)
  }
  
  private async checkDatabase(): Promise<HealthCheckResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      return {
        service: 'database',
        status: error ? 'unhealthy' : 'healthy',
        response_time: Date.now() - start,
        error: error?.message
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        error: error.message
      }
    }
  }
  
  private async checkStripe(): Promise<HealthCheckResult> {
    try {
      const { data } = await supabase.functions.invoke('stripe-health')
      return {
        service: 'stripe',
        status: data.healthy ? 'healthy' : 'unhealthy'
      }
    } catch (error) {
      return {
        service: 'stripe',
        status: 'unhealthy',
        error: error.message
      }
    }
  }
}
```

### Performance Monitoring
```typescript
// lib/performanceMonitor.ts
export class PerformanceMonitor {
  trackPageLoad(pageName: string) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const timing = entry as PerformanceNavigationTiming
          
          analytics.track('page_performance', {
            page: pageName,
            load_time: timing.loadEventEnd - timing.navigationStart,
            dom_ready: timing.domContentLoadedEventEnd - timing.navigationStart,
            first_paint: timing.responseStart - timing.navigationStart
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['navigation'] })
  }
  
  trackAPICall(endpoint: string, startTime: number) {
    const duration = Date.now() - startTime
    
    analytics.track('api_performance', {
      endpoint,
      duration,
      timestamp: new Date().toISOString()
    })
    
    if (duration > 2000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`)
    }
  }
}
```

---

## 🔄 Rollback Procedures

### Emergency Rollback
```bash
#!/bin/bash
# rollback.sh

set -e

BACKUP_VERSION=$1

if [[ -z "$BACKUP_VERSION" ]]; then
    echo "❌ Usage: ./rollback.sh <backup-version>"
    exit 1
fi

echo "🔄 Starting emergency rollback to version $BACKUP_VERSION..."

# 1. Stop health checks temporarily
echo "⏸️ Pausing health checks..."

# 2. Restore application code
echo "📦 Restoring application to version $BACKUP_VERSION..."
git checkout $BACKUP_VERSION

# 3. Restore database if needed
echo "🗄️ Checking database state..."
# Add database rollback logic if required

# 4. Clear caches
echo "🧹 Clearing caches..."
# Add cache clearing commands

# 5. Restart services
echo "🔄 Restarting services..."
# Add service restart commands

# 6. Verify rollback
echo "🔍 Verifying rollback..."
npm run test:production-health

echo "✅ Rollback completed successfully!"
echo "📧 Sending notification to team..."
# Add notification logic
```

### Database Rollback
```sql
-- Emergency database rollback procedure
BEGIN;

-- 1. Create backup of current state
CREATE TABLE backup_table_name AS 
SELECT * FROM problematic_table;

-- 2. Restore from known good backup
-- (Specific restore commands depend on backup strategy)

-- 3. Verify data integrity
SELECT COUNT(*) FROM restored_table;

-- 4. Update sequences if needed
SELECT setval('table_id_seq', (SELECT MAX(id) FROM restored_table));

COMMIT;
```

---

## 📈 Post-Deployment Monitoring

### Key Metrics to Monitor
```typescript
// lib/deploymentMetrics.ts
export const DEPLOYMENT_METRICS = {
  // Performance Metrics
  page_load_time: { threshold: 2000, unit: 'ms' },
  api_response_time: { threshold: 1000, unit: 'ms' },
  error_rate: { threshold: 1, unit: '%' },
  
  // Business Metrics
  user_onboarding_rate: { threshold: 80, unit: '%' },
  payment_success_rate: { threshold: 98, unit: '%' },
  document_upload_success: { threshold: 95, unit: '%' },
  
  // System Metrics
  cpu_usage: { threshold: 80, unit: '%' },
  memory_usage: { threshold: 85, unit: '%' },
  disk_usage: { threshold: 90, unit: '%' }
}

export function checkDeploymentHealth() {
  // Implementation for checking all metrics
  return Promise.all([
    checkPerformanceMetrics(),
    checkBusinessMetrics(),
    checkSystemMetrics()
  ])
}
```

### Alert Configuration
```typescript
// lib/alerting.ts
export class AlertManager {
  async checkCriticalAlerts() {
    const alerts = []
    
    // Check error rates
    const errorRate = await this.getErrorRate()
    if (errorRate > 5) {
      alerts.push({
        level: 'critical',
        message: `Error rate ${errorRate}% exceeds threshold`,
        action: 'Consider immediate rollback'
      })
    }
    
    // Check payment processing
    const paymentSuccessRate = await this.getPaymentSuccessRate()
    if (paymentSuccessRate < 95) {
      alerts.push({
        level: 'high',
        message: `Payment success rate ${paymentSuccessRate}% below threshold`,
        action: 'Check Stripe integration'
      })
    }
    
    return alerts
  }
}
```

---

## 📋 Deployment Checklist

### Pre-Deployment (T-1 Day)
- [ ] **Code Review**: All changes peer reviewed
- [ ] **Testing**: Full test suite passes
- [ ] **Performance**: Load testing completed
- [ ] **Security**: Security scan passed
- [ ] **Documentation**: Updated for changes
- [ ] **Rollback Plan**: Verified and tested

### Deployment Day (T-0)
- [ ] **Team Notification**: All stakeholders informed
- [ ] **Backup**: Current state backed up
- [ ] **Deployment**: Changes deployed successfully
- [ ] **Health Checks**: All systems operational
- [ ] **Monitoring**: Alerts configured
- [ ] **Communication**: Status page updated

### Post-Deployment (T+1 Hour)
- [ ] **Performance**: Response times normal
- [ ] **Error Monitoring**: No critical errors
- [ ] **User Experience**: Key flows functional
- [ ] **Analytics**: Event tracking working
- [ ] **Support**: Team monitoring channels

### 24-Hour Review (T+1 Day)
- [ ] **Metrics Review**: All KPIs within normal range
- [ ] **User Feedback**: No critical user issues
- [ ] **System Stability**: No unexpected issues
- [ ] **Performance**: Meeting SLA requirements
- [ ] **Documentation**: Lessons learned recorded

---

## 📞 Emergency Contacts

### Escalation Matrix
- **Level 1**: Development Team Lead
- **Level 2**: Technical Director
- **Level 3**: CTO/Engineering Manager
- **Level 4**: CEO/Emergency Response

### Service Contacts
- **Supabase Support**: [Support Portal](https://supabase.com/support)
- **Stripe Support**: [Dashboard](https://dashboard.stripe.com/support)
- **Plaid Support**: [Developer Portal](https://dashboard.plaid.com/support)
- **Hosting Provider**: [Support Dashboard]

### Monitoring Dashboards
- **Application Health**: [Monitoring URL]
- **Database Performance**: [Supabase Dashboard](https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi)
- **Error Tracking**: [Error Dashboard]
- **Analytics**: [PostHog Dashboard](https://app.posthog.com)