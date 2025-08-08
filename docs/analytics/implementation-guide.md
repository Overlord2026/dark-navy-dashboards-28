# Analytics Implementation Guide

## Overview
This guide provides comprehensive instructions for implementing and maintaining analytics across the BFO platform using PostHog as the primary analytics provider.

---

## Current Implementation

### Analytics Provider: PostHog
**Configuration File:** `src/lib/analytics.ts`
**API Key:** `phc_Yc8jTGjpIN3vMS0YSvT6ZpOZ7UhEwnyBaUhI2i8ec46`
**Host:** `https://us.i.posthog.com`

### Privacy Settings
```typescript
{
  capture_pageview: false,     // Manual page tracking
  capture_pageleave: true,     // Exit tracking
  respect_dnt: true,           // Honor Do Not Track
  disable_session_recording: false
}
```

---

## Core Analytics Functions

### 1. Page Tracking
```typescript
analytics.trackPageView(pageName: string, properties?: Record<string, any>)
```
**Usage:**
```typescript
// In React components
useEffect(() => {
  analytics.trackPageView('Retirement Analyzer', {
    persona: 'client',
    tier: 'premium'
  });
}, []);
```

### 2. Feature Usage Tracking
```typescript
analytics.trackFeatureUsage(featureName: string, properties?: Record<string, any>)
```
**Usage:**
```typescript
// When user uses a feature
const handleCalculatorRun = () => {
  analytics.trackFeatureUsage('SWAG Calculator', {
    input_count: inputs.length,
    completion_time: Date.now() - startTime
  });
};
```

### 3. Conversion Tracking
```typescript
analytics.trackConversion(conversionType: string, properties?: Record<string, any>)
```
**Usage:**
```typescript
// When important actions complete
analytics.trackConversion('onboarding_completed', {
  persona: 'advisor',
  steps_completed: 5,
  time_to_complete: totalTime
});
```

---

## Persona-Specific Tracking

### Client/Family Tracking
```typescript
// Goal management
analytics.track('goal_created', {
  goal_type: 'retirement',
  target_amount: 1000000,
  timeline: 20,
  persona: 'client'
});

// Retirement planning
analytics.track('swag_score_calculated', {
  score: 87,
  user_age: 45,
  retirement_age: 65,
  assets_total: 500000
});
```

### Advisor Tracking
```typescript
// Client management
analytics.track('client_invited', {
  invitation_method: 'email',
  client_tier: 'premium',
  invitation_code: 'ADV-ABC123'
});

// ROI analysis
analytics.track('roi_dashboard_viewed', {
  time_period: 'quarterly',
  metrics_viewed: ['aum_growth', 'client_acquisition']
});
```

### Realtor Tracking
```typescript
// Property management
analytics.track('listing_created', {
  property_type: 'single_family',
  list_price: 450000,
  cap_rate: 6.5
});

// Owner relations
analytics.track('owner_portal_invited', {
  property_count: 3,
  owner_type: 'investor'
});
```

---

## Event Implementation Patterns

### 1. Component-Level Tracking
```typescript
// In React components
import { analytics } from '@/lib/analytics';

const RetirementCalculator = () => {
  const handleCalculate = () => {
    // Perform calculation
    const results = calculateRetirement(inputs);
    
    // Track the event
    analytics.track('retirement_calculation_completed', {
      swag_score: results.swagScore,
      success_probability: results.monteCarlo.successProbability,
      calculation_time: Date.now() - startTime
    });
  };
};
```

### 2. Custom Hook Pattern
```typescript
// Create reusable tracking hooks
export const useRetirementTracking = () => {
  const trackCalculation = (results: RetirementResults) => {
    analytics.track('retirement_calculation_completed', {
      swag_score: results.swagScore,
      monte_carlo_success: results.monteCarlo.successProbability,
      scenarios_compared: results.scenarios.length
    });
  };

  const trackPDFExport = (reportType: string) => {
    analytics.track('pdf_exported', {
      report_type: reportType,
      timestamp: Date.now()
    });
  };

  return { trackCalculation, trackPDFExport };
};
```

### 3. Automated Tracking with HOC
```typescript
// Higher-order component for automatic tracking
export const withAnalytics = (Component: React.ComponentType, eventName: string) => {
  return (props: any) => {
    useEffect(() => {
      analytics.trackPageView(eventName, {
        component: Component.name,
        props: Object.keys(props)
      });
    }, []);

    return <Component {...props} />;
  };
};
```

---

## Conversion Funnel Implementation

### 1. Client Onboarding Funnel
```typescript
// Step 1: Persona selection
analytics.track('persona_claimed', {
  persona_type: 'client',
  user_id: userId,
  referrer: document.referrer
});

// Step 2: Onboarding start
analytics.track('onboarding_started', {
  persona: 'client',
  segment: 'high_net_worth'
});

// Step 3: Account connection
analytics.track('account_connected', {
  account_type: 'investment',
  provider: 'fidelity',
  balance_range: '$500K-$1M'
});

// Step 4: Goal creation
analytics.track('goal_created', {
  goal_type: 'retirement',
  target_amount: 2000000,
  timeline: 15
});

// Step 5: Onboarding completion
analytics.track('onboarding_completed', {
  persona: 'client',
  total_time: completionTime,
  steps_completed: 5
});
```

### 2. Premium Conversion Funnel
```typescript
// Preview premium feature
analytics.track('premium_feature_previewed', {
  feature_name: 'advanced_tax_optimization',
  persona: 'client',
  preview_duration: 120
});

// Click upgrade
analytics.track('upgrade_clicked', {
  current_tier: 'basic',
  target_tier: 'premium',
  price_point: '$99/month'
});

// Complete subscription
analytics.track('subscription_started', {
  plan_name: 'Premium Annual',
  price: 999,
  billing_frequency: 'annual'
});
```

---

## Error and Performance Tracking

### Error Tracking
```typescript
// Automatic error tracking
window.addEventListener('error', (event) => {
  analytics.trackError(event.error, {
    page: window.location.pathname,
    user_agent: navigator.userAgent,
    timestamp: Date.now()
  });
});

// Manual error tracking
try {
  // Risky operation
  performCalculation();
} catch (error) {
  analytics.trackError(error, {
    operation: 'retirement_calculation',
    inputs: sanitizedInputs
  });
}
```

### Performance Tracking
```typescript
// Page load performance
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  analytics.trackPerformance('page_load_time', perfData.loadEventEnd, {
    page: window.location.pathname
  });
});

// Feature performance
const startTime = performance.now();
await performExpensiveOperation();
const endTime = performance.now();

analytics.trackPerformance('calculation_time', endTime - startTime, {
  operation: 'monte_carlo_simulation',
  iterations: 10000
});
```

---

## Data Privacy & Compliance

### PII Handling
```typescript
// ❌ DON'T track PII directly
analytics.track('user_registered', {
  email: 'user@example.com',  // BAD
  ssn: '123-45-6789'          // BAD
});

// ✅ DO track hashed or anonymized data
analytics.track('user_registered', {
  user_id_hash: hash(userId),
  email_domain: 'gmail.com',
  location_state: 'CA'
});
```

### GDPR Compliance
```typescript
// Check consent before tracking
const trackingConsent = localStorage.getItem('analytics_consent');
if (trackingConsent === 'granted') {
  analytics.track(eventName, properties);
}

// Respect Do Not Track
if (navigator.doNotTrack === '1') {
  return; // Skip tracking
}
```

---

## Testing & Validation

### Development Environment
```typescript
// Use debug mode in development
if (process.env.NODE_ENV === 'development') {
  console.log('Analytics Event:', eventName, properties);
}

// Test events without sending to production
const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
  posthog.capture(eventName, properties);
}
```

### Event Validation
```typescript
// Validate event properties before sending
const validateEvent = (eventName: string, properties: any) => {
  const requiredFields = eventSchemas[eventName];
  for (const field of requiredFields) {
    if (!properties[field]) {
      console.warn(`Missing required field: ${field} for event: ${eventName}`);
      return false;
    }
  }
  return true;
};
```

---

## Analytics Dashboard Setup

### Key Metrics to Track
1. **User Engagement**
   - Daily/Monthly Active Users
   - Session duration
   - Feature adoption rates

2. **Conversion Metrics**
   - Onboarding completion rate
   - Premium conversion rate
   - Goal achievement rate

3. **Business Metrics**
   - Revenue per user
   - Churn rate
   - Customer lifetime value

### Custom Dashboards
Create dashboards for each persona:
- **Client Dashboard:** Goal progress, calculator usage, advisor interactions
- **Advisor Dashboard:** Client acquisition, ROI metrics, tool usage
- **Admin Dashboard:** Platform health, user growth, revenue metrics

---

## Best Practices

### 1. Event Naming Convention
```typescript
// Use consistent naming: subject_action_object
'retirement_calculation_completed'
'goal_creation_started'
'pdf_report_exported'
```

### 2. Property Standardization
```typescript
// Always include these standard properties
{
  persona: 'client|advisor|cpa|attorney|realtor',
  user_tier: 'basic|premium|enterprise',
  timestamp: Date.now(),
  session_id: sessionId,
  page: window.location.pathname
}
```

### 3. Rate Limiting
```typescript
// Prevent event spam
const lastEvent = new Map();
const MIN_INTERVAL = 1000; // 1 second

const track = (eventName: string, properties: any) => {
  const now = Date.now();
  const lastTime = lastEvent.get(eventName) || 0;
  
  if (now - lastTime < MIN_INTERVAL) {
    return; // Skip duplicate event
  }
  
  lastEvent.set(eventName, now);
  analytics.track(eventName, properties);
};
```

---

*Last Updated: [Current Date]*
*Next Review: Quarterly*
*Owner: Engineering Team*