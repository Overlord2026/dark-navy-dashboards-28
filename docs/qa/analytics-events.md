# Analytics Events Catalog

## Overview
This document defines all analytics events tracked across the Family Office CRM platform for user behavior analysis, conversion tracking, and business intelligence.

## Event Categories

### 1. Page View & Navigation Events

#### Core Page Views
- **Event**: `page_view`
- **Properties**:
  - `page_name` (string): Standardized page identifier
  - `page_path` (string): URL path
  - `user_persona` (string): Current user persona
  - `subscription_tier` (string): Free/Premium/Elite
  - `session_id` (string): Session identifier
  - `referrer` (string): Previous page or external referrer
  - `utm_source` (string): Marketing source
  - `utm_medium` (string): Marketing medium
  - `utm_campaign` (string): Campaign identifier

**Tracked Pages**:
- Landing pages: `/`, `/welcome`, `/universal`
- Calculators: `/demo`, `/retirement-analyzer`, `/fee-calculator`
- Personas: `/advisor`, `/client`, `/accountant`, etc.
- Admin: `/admin/*` (admin-only events)

#### Navigation Events
- **Event**: `navigation_click`
- **Properties**:
  - `nav_item` (string): Menu item clicked
  - `nav_location` (string): Header/sidebar/footer/breadcrumb
  - `destination_page` (string): Target page
  - `current_page` (string): Source page

### 2. Authentication & Onboarding Events

#### Authentication Flow
- **Event**: `auth_started`
- **Properties**:
  - `auth_type` (string): login/signup/magic_link/social
  - `auth_source` (string): Page where auth was initiated
  - `persona_intent` (string): Intended persona (if selected)

- **Event**: `auth_completed`
- **Properties**:
  - `auth_type` (string): login/signup/magic_link/social
  - `user_id` (string): User identifier
  - `persona` (string): Selected persona
  - `is_new_user` (boolean): First-time user flag
  - `auth_duration` (number): Time to complete auth (seconds)

- **Event**: `auth_failed`
- **Properties**:
  - `auth_type` (string): login/signup/magic_link/social
  - `error_type` (string): invalid_credentials/network_error/validation_error
  - `error_message` (string): Error description

#### Onboarding Flow
- **Event**: `onboarding_started`
- **Properties**:
  - `persona` (string): Selected persona
  - `onboarding_type` (string): welcome/premium/professional
  - `referral_source` (string): How user arrived

- **Event**: `onboarding_step_completed`
- **Properties**:
  - `step_name` (string): Name of completed step
  - `step_number` (number): Step position in flow
  - `persona` (string): User persona
  - `completion_time` (number): Time spent on step (seconds)
  - `fields_completed` (array): Form fields filled
  - `skipped` (boolean): Was step skipped

- **Event**: `onboarding_completed`
- **Properties**:
  - `persona` (string): Final persona
  - `total_duration` (number): Total onboarding time (seconds)
  - `steps_completed` (number): Number of steps finished
  - `steps_skipped` (number): Number of steps skipped
  - `conversion_source` (string): Original referral source

### 3. Feature Usage Events

#### SWAG™ Retirement Roadmap
- **Event**: `roadmap_calculation_started`
- **Properties**:
  - `user_persona` (string): User persona
  - `calculation_type` (string): full_analysis/quick_estimate/scenario
  - `data_source` (string): manual_entry/plan_import/existing_data

- **Event**: `roadmap_calculation_completed`
- **Properties**:
  - `swag_score` (number): Calculated SWAG score
  - `success_probability` (number): Monte Carlo success rate
  - `retirement_gap` (number): Income gap amount
  - `calculation_time` (number): Processing time (seconds)
  - `scenarios_analyzed` (number): Number of scenarios run

- **Event**: `scenario_comparison`
- **Properties**:
  - `base_scenario` (string): Original scenario name
  - `comparison_scenario` (string): Comparison scenario name
  - `parameter_changed` (string): Modified parameter
  - `impact_amount` (number): Financial impact of change

#### Plan Import & Data Management
- **Event**: `plan_import_started`
- **Properties**:
  - `import_method` (string): file_upload/manual_entry/plaid_connection
  - `file_type` (string): pdf/csv/excel (if applicable)
  - `document_pages` (number): Number of pages (for PDFs)

- **Event**: `plan_import_completed`
- **Properties**:
  - `accounts_imported` (number): Number of accounts extracted
  - `data_accuracy` (number): Confidence score of extraction
  - `manual_corrections` (number): User corrections made
  - `processing_time` (number): Time to complete import

- **Event**: `plan_export`
- **Properties**:
  - `export_format` (string): pdf/excel/csv
  - `report_type` (string): full_roadmap/summary/scenarios
  - `recipient_type` (string): self/advisor/client/family

### 4. CRM & Lead Management Events

#### Lead Capture
- **Event**: `lead_form_started`
- **Properties**:
  - `form_type` (string): contact/demo_request/consultation
  - `form_location` (string): Page where form appeared
  - `lead_source` (string): organic/paid/referral/direct
  - `persona_interest` (string): Indicated persona interest

- **Event**: `lead_form_submitted`
- **Properties**:
  - `lead_score` (number): Calculated lead score
  - `form_completion_time` (number): Time to fill form (seconds)
  - `fields_completed` (array): Form fields filled
  - `persona` (string): Selected persona
  - `contact_preference` (string): email/phone/calendar

- **Event**: `demo_scheduled`
- **Properties**:
  - `demo_type` (string): personal_demo/group_demo/self_service
  - `calendar_source` (string): calendly/manual/other
  - `lead_score` (number): Lead qualification score
  - `requested_features` (array): Features of interest

#### Pipeline Management
- **Event**: `lead_status_changed`
- **Properties**:
  - `lead_id` (string): Lead identifier
  - `previous_status` (string): Previous pipeline status
  - `new_status` (string): New pipeline status
  - `changed_by` (string): User who made change
  - `status_duration` (number): Time in previous status (hours)

- **Event**: `lead_converted`
- **Properties**:
  - `lead_id` (string): Lead identifier
  - `conversion_type` (string): trial/paid/consultation
  - `lead_score` (number): Final lead score
  - `conversion_time` (number): Time from lead to conversion (hours)
  - `touchpoints` (number): Number of interactions before conversion

### 5. Subscription & Commerce Events

#### Subscription Management
- **Event**: `subscription_upgrade_started`
- **Properties**:
  - `current_tier` (string): Current subscription level
  - `target_tier` (string): Desired subscription level
  - `upgrade_trigger` (string): feature_gate/usage_limit/promotion
  - `feature_accessed` (string): Feature that triggered upgrade

- **Event**: `subscription_upgrade_completed`
- **Properties**:
  - `previous_tier` (string): Previous subscription
  - `new_tier` (string): New subscription level
  - `payment_amount` (number): Transaction amount
  - `payment_method` (string): card/bank/other
  - `billing_cycle` (string): monthly/annual

- **Event**: `subscription_cancelled`
- **Properties**:
  - `cancellation_reason` (string): User-provided reason
  - `tier_cancelled` (string): Subscription level cancelled
  - `tenure_days` (number): Days as subscriber
  - `retention_offer_shown` (boolean): Was retention offer displayed

#### Feature Gating
- **Event**: `feature_gate_encountered`
- **Properties**:
  - `feature_name` (string): Gated feature name
  - `user_tier` (string): Current subscription tier
  - `required_tier` (string): Required subscription tier
  - `gate_action` (string): upgrade_prompt/trial_offer/contact_sales

### 6. Document Management Events

#### Document Operations
- **Event**: `document_uploaded`
- **Properties**:
  - `document_type` (string): financial_plan/legal_doc/tax_doc/other
  - `file_size` (number): File size in bytes
  - `file_format` (string): File extension
  - `vault_section` (string): Destination folder/category
  - `upload_source` (string): manual/drag_drop/plan_import

- **Event**: `document_shared`
- **Properties**:
  - `document_id` (string): Document identifier
  - `share_method` (string): link/email/portal_access
  - `recipient_type` (string): client/advisor/family_member/professional
  - `access_level` (string): view/download/edit

- **Event**: `document_accessed`
- **Properties**:
  - `document_id` (string): Document identifier
  - `access_method` (string): direct_link/vault_browse/search
  - `user_relationship` (string): owner/shared_with/professional
  - `view_duration` (number): Time spent viewing (seconds)

### 7. Communication & Collaboration Events

#### Meeting & Calendar Events
- **Event**: `meeting_scheduled`
- **Properties**:
  - `meeting_type` (string): consultation/review/planning/onboarding
  - `meeting_duration` (number): Scheduled duration (minutes)
  - `participants` (array): Meeting participant roles
  - `calendar_source` (string): calendly/manual/integration

- **Event**: `meeting_completed`
- **Properties**:
  - `meeting_id` (string): Meeting identifier
  - `actual_duration` (number): Actual meeting duration (minutes)
  - `follow_up_scheduled` (boolean): Was follow-up scheduled
  - `meeting_rating` (number): Participant rating (if provided)

#### Communication Events
- **Event**: `message_sent`
- **Properties**:
  - `message_type` (string): secure_message/email/sms/notification
  - `recipient_type` (string): client/advisor/professional/family
  - `message_category` (string): update/reminder/marketing/support

### 8. Error & Performance Events

#### Error Tracking
- **Event**: `application_error`
- **Properties**:
  - `error_type` (string): javascript/api/validation/network
  - `error_message` (string): Error description
  - `error_location` (string): Page/component where error occurred
  - `user_action` (string): Action that triggered error
  - `browser_info` (string): Browser and version
  - `stack_trace` (string): Error stack trace (if available)

#### Performance Monitoring
- **Event**: `performance_metric`
- **Properties**:
  - `metric_type` (string): page_load/api_response/calculation_time
  - `metric_value` (number): Measured value
  - `page_name` (string): Page where metric was recorded
  - `user_connection` (string): Connection speed category

### 9. Business Intelligence Events

#### Goal Achievement
- **Event**: `goal_created`
- **Properties**:
  - `goal_type` (string): retirement/investment/savings/debt
  - `goal_amount` (number): Target amount
  - `goal_timeline` (number): Target timeline (months)
  - `priority_level` (string): high/medium/low

- **Event**: `goal_progress_updated`
- **Properties**:
  - `goal_id` (string): Goal identifier
  - `progress_percentage` (number): Completion percentage
  - `milestone_reached` (boolean): Was milestone achieved
  - `update_source` (string): manual/automatic/plan_update

#### Professional Network Events
- **Event**: `professional_connection`
- **Properties**:
  - `connection_type` (string): advisor/cpa/attorney/insurance/coach
  - `connection_source` (string): referral/directory/search/recommendation
  - `verification_status` (string): verified/pending/unverified

## Event Implementation

### PostHog Integration
All events are tracked using PostHog with the following standard properties automatically included:
- `$current_url`: Current page URL
- `$referrer`: Referring page
- `$browser`: Browser information
- `$device`: Device information
- `$os`: Operating system
- `$timestamp`: Event timestamp
- `user_id`: Authenticated user ID (when available)
- `session_id`: Session identifier

### Custom Properties
Each event includes custom properties specific to the Family Office platform:
- `platform_version`: Application version
- `feature_flags`: Active feature flags
- `subscription_tier`: User subscription level
- `user_persona`: Current user persona
- `tenant_id`: Multi-tenant identifier (if applicable)

### Privacy Considerations
- No PII (personally identifiable information) in event properties
- Financial amounts are ranges or categories, not exact values
- User identifiers are hashed or pseudonymized
- Data retention follows privacy policy guidelines
- Users can opt-out of analytics tracking

### Event Naming Convention
Events follow a consistent naming pattern:
- `category_action` (e.g., `auth_completed`, `roadmap_calculation_started`)
- Use lowercase with underscores
- Descriptive but concise
- Consistent across similar actions

### Property Naming Convention
Properties follow these guidelines:
- `snake_case` formatting
- Descriptive but concise names
- Consistent data types across similar properties
- Include units for numeric values (e.g., `duration_seconds`)

## Analytics Dashboards

### Key Metrics Tracked
1. **User Engagement**
   - Daily/Monthly Active Users
   - Session duration and page views
   - Feature adoption rates
   - Retention cohorts

2. **Conversion Funnel**
   - Landing page → Registration
   - Registration → Onboarding completion
   - Free → Paid conversion
   - Feature gate → Upgrade

3. **Product Usage**
   - SWAG™ roadmap calculations per user
   - Document uploads and shares
   - CRM activity levels
   - Feature usage by persona

4. **Business Metrics**
   - Lead generation and quality
   - Customer acquisition cost (CAC)
   - Lifetime value (LTV)
   - Revenue attribution

### Persona-Specific Analytics
Each persona has tailored analytics focusing on their key actions:
- **Clients**: Goal setting, document uploads, plan engagement
- **Advisors**: Client management, lead conversion, tool usage
- **Professionals**: CRM usage, client acquisition, feature adoption

## Implementation Guidelines

### Event Tracking Code
Events are tracked using the centralized analytics utility:

```typescript
import { analytics } from '@/lib/analytics';

// Page view tracking
analytics.trackPageView('retirement_analyzer', {
  user_persona: 'client',
  calculation_type: 'full_analysis'
});

// Feature usage tracking
analytics.trackFeatureUsage('swag_roadmap_calculation', {
  swag_score: 85,
  success_probability: 0.92,
  scenarios_analyzed: 3
});

// Conversion tracking
analytics.trackConversion('subscription_upgrade', {
  previous_tier: 'free',
  new_tier: 'premium',
  upgrade_trigger: 'feature_gate'
});
```

### Event Validation
All events should be validated before sending:
- Required properties are present
- Data types match expected format
- Numeric values are within reasonable ranges
- String values follow expected patterns

### Testing Events
Events can be tested in development using:
- Console logging for verification
- PostHog's live events view
- Custom debugging tools
- Automated testing for critical events

This comprehensive analytics catalog ensures consistent tracking across the platform and provides valuable insights for product development, user experience optimization, and business growth.