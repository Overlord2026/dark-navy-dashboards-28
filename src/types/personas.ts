// Persona types and welcome messages for Family Office Marketplace
export type PersonaType = 
  | 'advisor' 
  | 'attorney' 
  | 'accountant' 
  | 'coach' 
  | 'consultant' 
  | 'compliance' 
  | 'imo_fmo' 
  | 'agency' 
  | 'organization'
  | 'client'
  | 'vip_reserved'
  | 'insurance_agent'
  | 'healthcare_consultant';

export interface PersonaWelcomeMessage {
  title: string;
  subtitle: string;
  benefits: string[];
  ctaPrimary: string;
  ctaSecondary?: string;
  learnMoreText: string;
}

export const PERSONA_WELCOME_MESSAGES: Record<PersonaType, PersonaWelcomeMessage> = {
  advisor: {
    title: "Welcome, Financial Advisor!",
    subtitle: "Grow your practice, deliver SWAG™ client value, automate compliance, and maximize prospect conversion. Your advisor profile is ready to connect with high-net-worth families.",
    benefits: [
      "Advanced CRM and proposal tools",
      "SWAG Lead Score™ prospect analytics",
      "Automated compliance monitoring",
      "Direct access to vetted HNW families"
    ],
    ctaPrimary: "Invite Clients Now",
    ctaSecondary: "Create First Proposal",
    learnMoreText: "Grow your practice with SWAG™ client value and automated compliance."
  },
  attorney: {
    title: "Welcome, Attorney!",
    subtitle: "Connect with HNW families, automate CLE, streamline document workflows. Manage estate plans, contracts, and compliance with secure document vaults.",
    benefits: [
      "Secure document vaults and workflows",
      "Automated CLE tracking and alerts",
      "Direct HNW family connections",
      "Estate planning collaboration tools"
    ],
    ctaPrimary: "Upload Legal Documents",
    ctaSecondary: "Schedule Consultation",
    learnMoreText: "Connect with HNW families and automate CLE tracking."
  },
  accountant: {
    title: "Welcome, CPA!",
    subtitle: "Deliver seamless tax planning, automate CE, and partner with fiduciaries for client retention. Upload returns, monitor compliance, and connect with families who need your expertise.",
    benefits: [
      "Seamless tax planning workflows",
      "Automated CE tracking and alerts",
      "Fiduciary partnership network",
      "Client retention automation"
    ],
    ctaPrimary: "Import Clients",
    ctaSecondary: "Start Tax Planning",
    learnMoreText: "Deliver seamless tax planning and automate CE requirements."
  },
  coach: {
    title: "Welcome, Coach/Consultant!",
    subtitle: "Showcase curriculum, manage advisor cohorts, deliver trackable outcomes. Expand your influence by supporting advisors and families nationwide with branded workshops.",
    benefits: [
      "Curriculum showcase platform",
      "Advisor cohort management",
      "Trackable outcome analytics",
      "Nationwide workshop hosting"
    ],
    ctaPrimary: "Upload Training Content",
    ctaSecondary: "Publish Curriculum",
    learnMoreText: "Showcase curriculum and manage advisor cohorts with trackable outcomes."
  },
  consultant: {
    title: "Welcome, Consultant!",
    subtitle: "Showcase curriculum, manage advisor cohorts, deliver trackable outcomes. Share your specialized expertise with top-tier wealth management professionals.",
    benefits: [
      "Elite wealth professional access",
      "Specialized expertise platform",
      "Reputation building tools",
      "Trackable impact metrics"
    ],
    ctaPrimary: "Showcase Expertise",
    ctaSecondary: "Publish Practice Audit",
    learnMoreText: "Showcase curriculum and deliver trackable outcomes to elite professionals."
  },
  compliance: {
    title: "Welcome, Compliance Officer!",
    subtitle: "Centralize audits, monitor filings, automate RIA/insurance/attorney compliance. Access the industry's first built-in mock audit center and regulatory tracking.",
    benefits: [
      "Centralized audit management",
      "Automated compliance monitoring",
      "RIA/insurance/attorney workflows",
      "Mock audit center access"
    ],
    ctaPrimary: "Launch Mock Audit",
    ctaSecondary: "Track Regulatory Changes",
    learnMoreText: "Centralize audits and automate RIA/insurance/attorney compliance."
  },
  imo_fmo: {
    title: "Welcome, Insurance/IMO!",
    subtitle: "Manage multi-state compliance, automate CE, grow your agent network. Connect with qualified advisors and distribute approved solutions in a secure platform.",
    benefits: [
      "Multi-state compliance management",
      "Automated CE tracking",
      "Agent network growth tools",
      "Approved solution distribution"
    ],
    ctaPrimary: "Start New Quote",
    ctaSecondary: "Upload Licensing",
    learnMoreText: "Manage multi-state compliance and automate CE for your agent network."
  },
  agency: {
    title: "Welcome, Marketing Agency!",
    subtitle: "Engage your audience, add value with VIP reserved access, cross-promote. Showcase lead services to verified advisors and track ROI in real-time.",
    benefits: [
      "VIP audience engagement",
      "Cross-promotion opportunities",
      "Verified advisor marketplace",
      "Real-time ROI tracking"
    ],
    ctaPrimary: "Launch Campaign",
    ctaSecondary: "Request VIP Access",
    learnMoreText: "Engage your audience with VIP reserved access and cross-promotion."
  },
  organization: {
    title: "Welcome, Industry Organization!",
    subtitle: "Early-adopter status, drive innovation, and build strategic partnerships. Host educational content and connect members to trusted wealth professionals.",
    benefits: [
      "Early-adopter innovation status",
      "Strategic partnership building",
      "Educational content hosting",
      "Member networking platform"
    ],
    ctaPrimary: "Customize VIP Profile",
    ctaSecondary: "Upload Articles/Events",
    learnMoreText: "Achieve early-adopter status and drive innovation through strategic partnerships."
  },
  client: {
    title: "Welcome to the Family Office Marketplace™!",
    subtitle: "Connect with vetted wealth professionals, access premium resources, and take control of your financial future with confidence.",
    benefits: [
      "Vetted professional network",
      "Premium financial resources",
      "Personalized wealth strategies",
      "Secure, private platform"
    ],
    ctaPrimary: "Find Your Advisor",
    ctaSecondary: "Explore Resources",
    learnMoreText: "Access exclusive wealth management insights and tools."
  },
  vip_reserved: {
    title: "Welcome, {{name}}! Your Reserved Profile Awaits.",
    subtitle: "You're one of the first 25 industry leaders invited to shape the future of family wealth management. Your premium profile is ready—just click to activate.",
    benefits: [
      "Exclusive founding member access",
      "Priority onboarding and support",
      "Direct influence on platform development",
      "Elite professional network access"
    ],
    ctaPrimary: "Claim My Reserved Profile",
    ctaSecondary: "Learn More",
    learnMoreText: "Join the elite network transforming wealth management."
  },
  insurance_agent: {
    title: "Welcome, Insurance Agent!",
    subtitle: "Manage multi-state compliance, automate CE, grow your agent network. Quote policies, track commissions, and connect with high-value clients while staying audit-ready.",
    benefits: [
      "Multi-state compliance management",
      "Automated CE and licensing tracking",
      "Commission tracking system",
      "High-value client connections"
    ],
    ctaPrimary: "Start New Quote",
    ctaSecondary: "Upload Licensing",
    learnMoreText: "Manage multi-state compliance and automate CE requirements."
  },
  healthcare_consultant: {
    title: "Welcome, Healthcare Consultant!",
    subtitle: "Connect as a verified longevity consultant, manage client care, and join expert panels. Lead in family health and longevity with our nationwide network.",
    benefits: [
      "Verified longevity consultant status",
      "Client care management tools",
      "Expert panel participation",
      "Nationwide healthcare network"
    ],
    ctaPrimary: "Set My Consultation Rates",
    ctaSecondary: "Join Longevity Network",
    learnMoreText: "Connect as a verified longevity consultant and join expert panels."
  }
};

// Map user roles to persona types
export const roleToPersonaMap: Record<string, PersonaType> = {
  'advisor': 'advisor',
  'attorney': 'attorney',
  'accountant': 'accountant',
  'cpa': 'accountant',
  'coach': 'coach',
  'consultant': 'consultant',
  'compliance_officer': 'compliance',
  'imo': 'imo_fmo',
  'fmo': 'imo_fmo',
  'marketing_agency': 'agency',
  'lead_gen': 'agency',
  'industry_organization': 'organization',
  'client': 'client',
  'family': 'client'
};

export const getPersonaFromRole = (role: string): PersonaType => {
  return roleToPersonaMap[role.toLowerCase()] || 'client';
};