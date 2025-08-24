import { Template, ProPersona } from '../../types';

export const CPA_TEMPLATES: Template[] = [
  {
    id: 'cpa_tax_season_warmup',
    persona: 'cpa',
    name: 'Tax Season Warmup (3-touch)',
    subject: 'Tax Season 2024 Preparation - {{client_name}}',
    content: `# Tax Season 2024 is Approaching!

Dear {{client_name}},

Tax season will be here before you know it. Let's get organized early to ensure a smooth filing process.

## Key Dates to Remember
- **Tax Filing Deadline**: April 15, 2024
- **Extension Deadline**: October 15, 2024
- **Document Collection**: Start now for better preparation

## What You'll Need
- W-2 forms from all employers
- 1099 forms (interest, dividends, retirement)
- Business income/expense records
- Charitable contribution receipts
- Medical expense receipts (if itemizing)

## Schedule Your Appointment
**Early Bird Special**: Schedule by {{early_deadline}} and save {{discount_amount}} on your tax preparation.

Contact us today: {{phone}} or {{email}}

Best regards,
{{cpa_name}}, CPA
{{firm_name}}

---
*This is automated communication #1 of 3 in our Tax Season Warmup series.*`,
    category: 'onboarding',
    tokens: ['client_name', 'early_deadline', 'discount_amount', 'phone', 'email', 'cpa_name', 'firm_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  },
  {
    id: 'cpa_quarterly_estimate_reminder',
    persona: 'cpa',
    name: 'Quarterly Estimate Reminder',
    subject: 'Q{{quarter}} Estimated Tax Payment Due {{due_date}}',
    content: `# Quarterly Estimated Tax Payment Reminder

Hello {{client_name}},

Your Q{{quarter}} {{year}} estimated tax payment is due on **{{due_date}}**.

## Payment Details
- **Estimated Amount**: {{payment_amount}}
- **Due Date**: {{due_date}}
- **Payment Methods**: Online, check, or phone

## Payment Options
1. **IRS Direct Pay**: Visit irs.gov/payments
2. **EFTPS**: Electronic Federal Tax Payment System
3. **Mail Check**: Use Form 1040ES voucher

## Need Adjustment?
If your income has changed significantly, contact us to review your quarterly estimates.

{{cpa_name}}, CPA
{{firm_name}}
{{phone}}

---
*Estimated tax payments help avoid underpayment penalties. Contact us with questions.*`,
    category: 'follow-up',
    tokens: ['client_name', 'quarter', 'year', 'due_date', 'payment_amount', 'cpa_name', 'firm_name', 'phone'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  }
];

export const ATTORNEY_TEMPLATES: Template[] = [
  {
    id: 'attorney_will_trust_review',
    persona: 'attorney',
    name: 'Will/Trust Review (3-touch)',
    subject: 'Time for Your Estate Plan Review - {{client_name}}',
    content: `# Annual Estate Plan Review

Dear {{client_name}},

It's been {{years_since_update}} since your last estate plan update. Life changes, and so should your estate plan.

## When to Update Your Estate Plan
- Marriage, divorce, or death in the family
- Birth or adoption of children/grandchildren
- Significant change in assets or income
- Changes in tax laws
- Moving to a different state

## What We'll Review
- **Will and Testament**: Beneficiaries, guardians, executors
- **Trust Documents**: Terms, beneficiaries, successor trustees
- **Powers of Attorney**: Financial and healthcare decisions
- **Beneficiary Designations**: 401(k), IRA, life insurance

## Schedule Your Review
We recommend annual reviews to ensure your plan reflects your current wishes and maximizes tax benefits.

**Contact us**: {{phone}} or {{email}}

Sincerely,
{{attorney_name}}, Esq.
{{law_firm}}

---
*ATTORNEY-CLIENT PRIVILEGED COMMUNICATION*
*This is communication #1 of 3 in our Estate Plan Review series.*`,
    category: 'follow-up',
    tokens: ['client_name', 'years_since_update', 'phone', 'email', 'attorney_name', 'law_firm'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  },
  {
    id: 'attorney_beneficiary_checkup',
    persona: 'attorney',
    name: 'Beneficiary Checkup',
    subject: 'Important: Beneficiary Designation Review for {{client_name}}',
    content: `# Annual Beneficiary Designation Checkup

Dear {{client_name}},

Don't let outdated beneficiary designations derail your estate plan. These designations override your will and trust.

## Accounts to Review
- **Retirement Accounts**: 401(k), 403(b), IRA, Roth IRA
- **Life Insurance**: All policies and riders
- **Bank Accounts**: Payable-on-death (POD) designations
- **Investment Accounts**: Transfer-on-death (TOD) designations

## Common Problems We See
- Ex-spouses still listed as beneficiaries
- Deceased beneficiaries not updated
- Minor children named without trust protection
- Contingent beneficiaries not specified

## Action Items
{{action_items}}

## Next Steps
We can coordinate with your financial institutions to ensure all designations align with your estate plan.

**Contact us today**: {{phone}}

Sincerely,
{{attorney_name}}, Esq.
{{law_firm}}

---
*ATTORNEY-CLIENT PRIVILEGED COMMUNICATION*`,
    category: 'follow-up',
    tokens: ['client_name', 'action_items', 'phone', 'attorney_name', 'law_firm'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  }
];

export const INSURANCE_TEMPLATES: Template[] = [
  {
    id: 'insurance_life_needs_analysis',
    persona: 'insurance',
    name: 'Life Needs Analysis (3-touch)',
    subject: 'Your Life Insurance Coverage Review - {{client_name}}',
    content: `# Life Insurance Needs Analysis

Hello {{client_name}},

When did you last review your life insurance coverage? Your needs change as your life evolves.

## Life Events That Affect Coverage Needs
- Marriage or divorce
- Birth/adoption of children
- Home purchase or mortgage changes
- Career advancement or income changes
- Children becoming financially independent
- Retirement planning

## Coverage Gap Analysis
Current coverage: {{current_coverage}}
Estimated need: {{estimated_need}}
Potential gap: {{coverage_gap}}

## Types of Coverage to Consider
- **Term Life**: Affordable, temporary protection
- **Whole Life**: Permanent coverage with cash value
- **Universal Life**: Flexible premiums and death benefits

## Next Steps
Let's schedule a no-obligation review to ensure your family is properly protected.

**Schedule your review**: {{phone}} or {{email}}

Best regards,
{{agent_name}}
Licensed Life Insurance Agent
{{agency_name}}

---
*This is communication #1 of 3 in our Life Insurance Review series.*
*Life insurance products are subject to underwriting approval.*`,
    category: 'onboarding',
    tokens: ['client_name', 'current_coverage', 'estimated_need', 'coverage_gap', 'phone', 'email', 'agent_name', 'agency_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  },
  {
    id: 'insurance_1035_exchange_review',
    persona: 'insurance',
    name: '1035 Exchange Review',
    subject: 'Annuity Review: Better Options Available for {{client_name}}',
    content: `# Annuity Performance Review

Dear {{client_name}},

We've reviewed your current annuity: {{current_annuity}} and identified potential improvements.

## Current Annuity Analysis
- **Current Value**: {{current_value}}
- **Annual Fees**: {{current_fees}}
- **Surrender Period**: {{surrender_period}}
- **Performance**: {{performance_summary}}

## Potential 1035 Exchange Benefits
- **Lower fees**: Potential savings of {{fee_savings}} annually
- **Better returns**: {{return_improvement}} potential improvement
- **Enhanced features**: {{feature_improvements}}

## Important Considerations
**Before any exchange**:
- Review surrender charges
- Compare product features
- Understand new surrender periods
- Consider tax implications

## Suitability Review
✓ Investment objectives reviewed
✓ Risk tolerance assessed
✓ Time horizon considered
✓ Financial situation analyzed

**Schedule your consultation**: {{phone}}

Sincerely,
{{agent_name}}
Licensed Insurance Professional
{{agency_name}}

---
*1035 exchanges are complex transactions. Full suitability analysis required.*
*This is not a recommendation without complete suitability review.*`,
    category: 'follow-up',
    tokens: ['client_name', 'current_annuity', 'current_value', 'current_fees', 'surrender_period', 'performance_summary', 'fee_savings', 'return_improvement', 'feature_improvements', 'phone', 'agent_name', 'agency_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  }
];

export const HEALTHCARE_TEMPLATES: Template[] = [
  {
    id: 'healthcare_longevity_intro',
    persona: 'healthcare',
    name: 'Longevity Introduction (3-touch)',
    subject: 'Welcome to Your Longevity Journey - {{client_name}}',
    content: `# Welcome to Optimized Longevity

Dear {{client_name}},

Thank you for choosing our longevity optimization program. Your journey to healthier aging starts now.

## Your Personalized Approach
Based on your initial assessment, we've designed a program focusing on:
- **Cardiovascular Health**: {{cardio_focus}}
- **Metabolic Optimization**: {{metabolic_focus}}
- **Cognitive Health**: {{cognitive_focus}}
- **Nutritional Support**: {{nutrition_focus}}

## What's Next - Your First 30 Days
1. **Week 1**: Complete comprehensive lab panel
2. **Week 2**: Nutritional assessment and meal planning
3. **Week 3**: Exercise capacity testing
4. **Week 4**: Initial progress review

## Your Care Team
- **Lead Physician**: {{physician_name}}
- **Nutritionist**: {{nutritionist_name}}
- **Fitness Specialist**: {{fitness_specialist}}

## Important Health Information
This program supplements but does not replace your primary healthcare. Always consult your physician before making significant health changes.

**Questions?** Contact us: {{clinic_phone}}

To your health,
{{clinic_name}} Team

---
*CONFIDENTIAL HEALTHCARE COMMUNICATION*
*This is communication #1 of 3 in our Longevity Introduction series.*`,
    category: 'onboarding',
    tokens: ['client_name', 'cardio_focus', 'metabolic_focus', 'cognitive_focus', 'nutrition_focus', 'physician_name', 'nutritionist_name', 'fitness_specialist', 'clinic_phone', 'clinic_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  },
  {
    id: 'healthcare_screening_reminder',
    persona: 'healthcare',
    name: 'Screening Reminder',
    subject: 'Health Screening Due: {{screening_type}} for {{client_name}}',
    content: `# Important Health Screening Reminder

Dear {{client_name}},

Your {{screening_type}} screening is due based on your age and health profile.

## Screening Details
- **Test**: {{screening_type}}
- **Recommended Frequency**: {{frequency}}
- **Last Completed**: {{last_completed}}
- **Next Due**: {{due_date}}

## Why This Screening Matters
{{screening_importance}}

## Scheduling Options
- **In-office**: {{clinic_phone}}
- **Online**: {{online_portal}}
- **Partner locations**: {{partner_locations}}

## Preparation Instructions
{{prep_instructions}}

## Insurance Coverage
Most insurance plans cover preventive screenings at 100%. We'll verify your coverage before your appointment.

**Schedule today**: {{clinic_phone}}

Your healthcare team,
{{clinic_name}}

---
*CONFIDENTIAL HEALTHCARE COMMUNICATION*
*Early detection saves lives. Don't delay important screenings.*`,
    category: 'follow-up',
    tokens: ['client_name', 'screening_type', 'frequency', 'last_completed', 'due_date', 'screening_importance', 'clinic_phone', 'online_portal', 'partner_locations', 'prep_instructions', 'clinic_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  }
];

export const REALTOR_TEMPLATES: Template[] = [
  {
    id: 'realtor_neighborhood_report',
    persona: 'realtor',
    name: 'Neighborhood Report (3-touch)',
    subject: '{{neighborhood_name}} Market Report - {{month}} {{year}}',
    content: `# {{neighborhood_name}} Market Report
## {{month}} {{year}}

Hello {{client_name}},

Here's your personalized market update for {{neighborhood_name}}.

## Market Snapshot
- **Median Home Price**: {{median_price}} ({{price_change}} from last month)
- **Homes Sold**: {{homes_sold}} ({{volume_change}} from last month)
- **Average Days on Market**: {{avg_dom}} days
- **Inventory Level**: {{inventory_level}} ({{inventory_change}})

## Neighborhood Highlights
{{neighborhood_highlights}}

## Notable Sales This Month
{{notable_sales}}

## Market Forecast
{{market_forecast}}

## For Buyers
{{buyer_advice}}

## For Sellers
{{seller_advice}}

## Featured Properties
{{featured_listings}}

Questions about the market or your property value? Let's connect!

**Direct line**: {{realtor_phone}}
**Email**: {{realtor_email}}

Best regards,
{{realtor_name}}
Licensed Real Estate Professional
{{brokerage_name}}

---
*Market data sourced from local MLS. This is communication #1 of 3 in our monthly series.*`,
    category: 'newsletter',
    tokens: ['neighborhood_name', 'month', 'year', 'client_name', 'median_price', 'price_change', 'homes_sold', 'volume_change', 'avg_dom', 'inventory_level', 'inventory_change', 'neighborhood_highlights', 'notable_sales', 'market_forecast', 'buyer_advice', 'seller_advice', 'featured_listings', 'realtor_phone', 'realtor_email', 'realtor_name', 'brokerage_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  },
  {
    id: 'realtor_open_house_followup',
    persona: 'realtor',
    name: 'Open House Follow-up',
    subject: 'Thank you for visiting {{property_address}}',
    content: `# Thank You for Visiting Our Open House

Hello {{visitor_name}},

Thank you for visiting {{property_address}} during our open house on {{open_house_date}}.

## Property Highlights
- **Address**: {{property_address}}
- **Price**: {{listing_price}}
- **Bedrooms**: {{bedrooms}} | **Bathrooms**: {{bathrooms}}
- **Square Feet**: {{square_feet}}
- **Lot Size**: {{lot_size}}

## What Makes This Home Special
{{property_highlights}}

## Next Steps
Interested in scheduling a private showing or learning more about the neighborhood?

## Financing Options
We work with trusted lenders who can help with:
- Pre-approval letters
- First-time homebuyer programs
- Competitive rates and terms

## Similar Properties
Based on your interests, you might also like:
{{similar_properties}}

## Questions?
I'm here to help with any questions about this property or your home search.

**Call/Text**: {{realtor_phone}}
**Email**: {{realtor_email}}

Best regards,
{{realtor_name}}
Licensed Real Estate Professional
{{brokerage_name}}

---
*Equal Housing Opportunity. All information deemed reliable but not guaranteed.*`,
    category: 'follow-up',
    tokens: ['visitor_name', 'property_address', 'open_house_date', 'listing_price', 'bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'property_highlights', 'similar_properties', 'realtor_phone', 'realtor_email', 'realtor_name', 'brokerage_name'],
    compliance_reviewed: true,
    policy_version: 'v1.0'
  }
];

// Combined repository
export const PERSONA_TEMPLATE_REPOSITORY = {
  cpa: CPA_TEMPLATES,
  attorney: ATTORNEY_TEMPLATES,
  insurance: INSURANCE_TEMPLATES,
  healthcare: HEALTHCARE_TEMPLATES,
  realtor: REALTOR_TEMPLATES
};