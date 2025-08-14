import { PersonaKind } from '@/types/persona';

export type Link = { 
  label: string; 
  href: string; 
  badge?: string;
  external?: boolean;
};

// Comprehensive persona-specific navigation links
export const PERSONA_LINKS: Record<PersonaKind, Link[]> = {
  // Family personas
  family_aspiring: [
    { label: "Savings Plan", href: "/services/planning" },
    { label: "Starter Portfolio", href: "/services/investments" },
    { label: "Insurance Basics", href: "/services/estate" },
    { label: "First Home", href: "/solutions/home-readiness" },
    { label: "Calculators", href: "/calculators" },
  ],
  
  family_younger: [
    { label: "Budget & Cash", href: "/services/cash" },
    { label: "College Savings", href: "/solutions/education" },
    { label: "401(k) Setup", href: "/solutions/retirement-start" },
    { label: "Protection Plan", href: "/services/estate" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  
  family_wealthy: [
    { label: "Private Market Alpha", href: "/services/private-markets", badge: "New" },
    { label: "Tax Coordination", href: "/services/taxes" },
    { label: "Family Entities", href: "/services/entities" },
    { label: "Estate & Titling", href: "/services/estate" },
    { label: "Concierge", href: "/services/concierge" },
  ],
  
  family_executive: [
    { label: "Equity Comp Planner", href: "/solutions/equity-comp" },
    { label: "AMT & RSU Taxes", href: "/solutions/tax-season" },
    { label: "10b5-1 Scheduler", href: "/solutions/10b5-1" },
    { label: "Private Deals", href: "/services/private-markets" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  
  family_retiree: [
    { label: "Income Now", href: "/solutions/income-now" },
    { label: "Income Later", href: "/solutions/income-now#later" },
    { label: "RMDs", href: "/solutions/rmds" },
    { label: "Healthcare", href: "/services/health" },
    { label: "Estate & Titling", href: "/services/estate" },
  ],
  
  family_business_owner: [
    { label: "Entity Design", href: "/services/entities" },
    { label: "Cash Flow", href: "/dashboards" },
    { label: "Benefits", href: "/solutions/benefits" },
    { label: "Exit Readiness", href: "/solutions/owner-exit" },
    { label: "Taxes", href: "/services/taxes" },
  ],

  // Core professionals
  pro_advisor: [
    { label: "Book Health", href: "/pros/advisors" },
    { label: "Meeting Kits", href: "/solutions/meetings" },
    { label: "Exceptions", href: "/solutions/exceptions" },
    { label: "Tasks", href: "/workspace/recommendations" },
    { label: "Private Deals", href: "/services/private-markets" },
  ],
  
  pro_cpa: [
    { label: "K-1 Intake", href: "/solutions/tax-season" },
    { label: "Quarterlies", href: "/services/taxes" },
    { label: "Client Docs", href: "/services/documents" },
    { label: "Entities", href: "/services/entities" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  
  pro_attorney: [
    { label: "Titling Exceptions", href: "/solutions/estate-gaps" },
    { label: "Trust Funding", href: "/services/estate" },
    { label: "Signings", href: "/services/documents" },
    { label: "Entities", href: "/services/entities" },
    { label: "Tasks", href: "/workspace/recommendations" },
  ],
  
  pro_insurance: [
    { label: "Case Design", href: "/solutions/insurance-cases" },
    { label: "Underwriting", href: "/solutions/underwriting" },
    { label: "Policy Review", href: "/solutions/policy-review" },
    { label: "Illustrations", href: "/solutions/illustrations" },
    { label: "Tasks", href: "/workspace/recommendations" },
  ],
  
  pro_bank_trust: [
    { label: "Distributions", href: "/solutions/distributions" },
    { label: "Audit Trail", href: "/solutions/audit" },
    { label: "Entities", href: "/services/entities" },
    { label: "Compliance Calendar", href: "/solutions/compliance" },
    { label: "Dashboards", href: "/dashboards" },
  ],

  // Healthcare sub-tracks
  pro_healthcare_influencer: [
    { label: "Content Studio", href: "/healthcare/content" },
    { label: "Public Education", href: "/healthcare/education" },
    { label: "Health Advocacy", href: "/healthcare/advocacy" },
    { label: "Compliance Check", href: "/healthcare/compliance" },
    { label: "Analytics", href: "/healthcare/analytics" },
  ],
  
  pro_healthcare_clinic: [
    { label: "Test Orders", href: "/healthcare/testing" },
    { label: "Results Portal", href: "/healthcare/results" },
    { label: "Billing & Claims", href: "/healthcare/billing" },
    { label: "Patient Records", href: "/healthcare/records" },
    { label: "Lab Integration", href: "/healthcare/labs" },
  ],
  
  pro_healthcare_navigator: [
    { label: "Care Plans", href: "/healthcare/care-plans" },
    { label: "Patient Navigation", href: "/healthcare/navigation" },
    { label: "Permissions", href: "/healthcare/permissions" },
    { label: "Coordination", href: "/healthcare/coordination" },
    { label: "Progress Tracking", href: "/healthcare/tracking" },
  ],
  
  pro_pharmacy: [
    { label: "Vaccine Schedule", href: "/pharmacy/vaccines" },
    { label: "Inventory Mgmt", href: "/pharmacy/inventory" },
    { label: "Reimbursement", href: "/pharmacy/reimbursement" },
    { label: "Patient Education", href: "/pharmacy/education" },
    { label: "Compliance", href: "/pharmacy/compliance" },
  ],

  // Real estate
  pro_realtor: [
    { label: "Property Listings", href: "/realestate/listings" },
    { label: "Client Management", href: "/realestate/clients" },
    { label: "Market Analysis", href: "/realestate/market" },
    { label: "Transaction Mgmt", href: "/realestate/transactions" },
    { label: "Lead Generation", href: "/realestate/leads" },
  ],
};

// Default links for fallback
export const DEFAULT_LINKS: Link[] = [
  { label: "Notes", href: "/workspace/notes" },
  { label: "Recommendations", href: "/workspace/recommendations" },
  { label: "Dashboards", href: "/dashboards" },
  { label: "Calculators", href: "/calculators" },
  { label: "Studies", href: "/studies" },
];

// Get links for a specific persona
export const getPersonaLinks = (personaKind?: PersonaKind): Link[] => {
  if (!personaKind || !PERSONA_LINKS[personaKind]) {
    return DEFAULT_LINKS;
  }
  return PERSONA_LINKS[personaKind];
};

// Menu configuration for navigation
export const MEGA_MENU_CONFIG = {
  families: {
    title: "For Families",
    sections: [
      {
        title: "Family Types",
        items: [
          { label: "Aspiring Families", href: "/families/aspiring", description: "Building wealth foundations" },
          { label: "Younger Families", href: "/families/younger", description: "Growing with children" },
          { label: "Wealthy Families", href: "/families/wealthy", description: "High net worth management" },
          { label: "Executives", href: "/families/executive", description: "Equity compensation planning" },
          { label: "Retirees", href: "/families/retiree", description: "Income and legacy planning" },
          { label: "Business Owners", href: "/families/business", description: "Exit and succession planning" },
        ]
      }
    ]
  },
  professionals: {
    title: "For Professionals",
    sections: [
      {
        title: "Financial Services",
        items: [
          { label: "Advisors", href: "/pros/advisors", description: "Financial planning professionals" },
          { label: "CPAs", href: "/pros/cpas", description: "Tax and accounting services" },
          { label: "Estate Attorneys", href: "/pros/attorneys", description: "Legal and estate planning" },
          { label: "Insurance", href: "/pros/insurance", description: "Risk management specialists" },
          { label: "Bank/Trust", href: "/pros/bank-trust", description: "Trust and banking services" },
        ]
      },
      {
        title: "Healthcare",
        items: [
          { label: "Healthcare Influencers", href: "/pros/healthcare/influencers", description: "Public health content creators" },
          { label: "Clinic/Testing", href: "/pros/healthcare/clinics", description: "Testing and diagnostics providers" },
          { label: "Care Navigators", href: "/pros/healthcare/navigators", description: "Patient care coordination" },
          { label: "Pharmacy & Shots", href: "/pros/healthcare/pharmacy", description: "Vaccines and medication management" },
        ]
      },
      {
        title: "Real Estate",
        items: [
          { label: "Realtors", href: "/pros/realtors", description: "Real estate professionals" },
        ]
      }
    ]
  },
  services: {
    title: "Services",
    sections: [
      {
        title: "Core Services",
        items: [
          { label: "Planning", href: "/services/planning", description: "Comprehensive financial planning" },
          { label: "Cash Management", href: "/services/cash", description: "Liquidity and cash flow" },
          { label: "Investments", href: "/services/investments", description: "Portfolio management" },
          { label: "Private Markets", href: "/services/private-markets", description: "Alternative investments" },
          { label: "Tax Planning", href: "/services/taxes", description: "Tax optimization strategies" },
          { label: "Estate Planning", href: "/services/estate", description: "Wealth transfer and legacy" },
          { label: "Entity Structures", href: "/services/entities", description: "Business entity management" },
          { label: "Document Management", href: "/services/documents", description: "Secure document storage" },
          { label: "Education & Concierge", href: "/services/concierge", description: "Learning and support services" },
        ]
      }
    ]
  },
  solutions: {
    title: "Solutions",
    sections: [
      {
        title: "Income & Retirement",
        items: [
          { label: "Income Now", href: "/solutions/income-now", description: "Current income optimization" },
          { label: "Income Later", href: "/solutions/income-later", description: "Future income planning" },
          { label: "RMDs", href: "/solutions/rmds", description: "Required minimum distributions" },
        ]
      },
      {
        title: "Tax & Compliance",
        items: [
          { label: "K-1 Season", href: "/solutions/tax-season", description: "Partnership tax management" },
          { label: "Capital Calls", href: "/solutions/capital-calls", description: "Investment funding management" },
          { label: "Entity Renewals", href: "/solutions/entity-renewals", description: "Business license management" },
        ]
      },
      {
        title: "Executive & Business",
        items: [
          { label: "Equity Compensation", href: "/solutions/equity-comp", description: "Stock option management" },
          { label: "10b5-1 Plans", href: "/solutions/10b5-1", description: "Systematic trading plans" },
          { label: "Exit Planning", href: "/solutions/owner-exit", description: "Business succession planning" },
        ]
      },
      {
        title: "Healthcare",
        items: [
          { label: "Medicare Coverage", href: "/solutions/medicare", description: "Healthcare coverage optimization" },
          { label: "Immunization Programs", href: "/solutions/immunization", description: "Vaccine management" },
          { label: "LTC Planning", href: "/solutions/ltc", description: "Long-term care planning" },
          { label: "Care Coordination", href: "/solutions/care-plans", description: "Comprehensive care management" },
        ]
      }
    ]
  }
};