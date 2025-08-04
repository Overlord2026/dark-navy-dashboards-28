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
  | 'client';

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
    title: "Welcome, Advisor!",
    subtitle: "You're now connected to a new generation of families seeking best-in-class guidance. Showcase your expertise, connect instantly, and deliver custom Roadmaps powered by AI—without any commission bias.",
    benefits: [
      "Advanced portfolio tools and premium insights",
      "Direct access to high-net-worth families",
      "AI-powered client roadmaps",
      "No commission bias in recommendations"
    ],
    ctaPrimary: "Complete Your Profile",
    ctaSecondary: "Explore Client Matching",
    learnMoreText: "Unlock advanced portfolio tools and premium insights."
  },
  attorney: {
    title: "Welcome, Attorney!",
    subtitle: "Join a vetted network of legal professionals trusted by high-net-worth families. Share your expertise, manage clients securely, and collaborate with other advisors—all in one secure platform.",
    benefits: [
      "Document vaults and compliance tools",
      "Client referral management",
      "Secure collaboration platform",
      "Trusted by HNW families"
    ],
    ctaPrimary: "Set Up Document Vault",
    ctaSecondary: "View Client Portal",
    learnMoreText: "Access document vaults, compliance, and client referral tools."
  },
  accountant: {
    title: "Welcome, CPA!",
    subtitle: "Streamline your practice, offer clients proactive tax planning, and partner with wealth advisors in a compliant, secure ecosystem.",
    benefits: [
      "Tax workflow automation",
      "RIA integrations",
      "Proactive tax planning tools",
      "Secure advisor partnerships"
    ],
    ctaPrimary: "Configure Tax Workflows",
    ctaSecondary: "Connect with Advisors",
    learnMoreText: "Unlock tax workflow automation and RIA integrations."
  },
  coach: {
    title: "Welcome, Coach!",
    subtitle: "Expand your influence by supporting advisors and families nationwide. Offer workshops, host events, and track your impact—all with a branded profile.",
    benefits: [
      "Nationwide reach for workshops",
      "Event hosting capabilities",
      "Impact tracking tools",
      "Branded professional profile"
    ],
    ctaPrimary: "Create Workshop",
    ctaSecondary: "Build Your Brand",
    learnMoreText: "Connect directly with advisors seeking expert guidance."
  },
  consultant: {
    title: "Welcome, Consultant!",
    subtitle: "Share your specialized expertise with top-tier wealth management professionals. Build your reputation and expand your client base through our trusted network.",
    benefits: [
      "Access to elite wealth professionals",
      "Reputation building platform",
      "Specialized expertise showcase",
      "Trusted network connections"
    ],
    ctaPrimary: "Showcase Expertise",
    ctaSecondary: "Browse Opportunities",
    learnMoreText: "Build your reputation in the wealth management ecosystem."
  },
  compliance: {
    title: "Welcome, Compliance Pro!",
    subtitle: "Manage firm-wide best practices, track audit trails, and support compliance across all roles. Access the industry's first built-in mock audit center.",
    benefits: [
      "Firm-wide compliance tracking",
      "Mock audit center access",
      "Automated audit trails",
      "SEC/state requirement updates"
    ],
    ctaPrimary: "Set Up Compliance Dashboard",
    ctaSecondary: "Run Mock Audit",
    learnMoreText: "Stay ahead of SEC/state requirements—always."
  },
  imo_fmo: {
    title: "Welcome, IMO/FMO Partner!",
    subtitle: "Connect with qualified advisors, distribute approved insurance solutions, and offer exclusive training programs in a secure, reputation-first platform.",
    benefits: [
      "Qualified advisor network",
      "Approved solution distribution",
      "Training program management",
      "Agent compliance tracking"
    ],
    ctaPrimary: "View Advisor Network",
    ctaSecondary: "Upload Training Materials",
    learnMoreText: "Track agent compliance and continuing education."
  },
  agency: {
    title: "Welcome, Lead Gen Partner!",
    subtitle: "Showcase your lead services to verified advisors and track your ROI per campaign—real time.",
    benefits: [
      "Verified advisor marketplace",
      "Real-time ROI tracking",
      "Campaign performance analytics",
      "Performance-based referrals"
    ],
    ctaPrimary: "Launch First Campaign",
    ctaSecondary: "View Analytics",
    learnMoreText: "Earn referrals for top performance and transparent results."
  },
  organization: {
    title: "Welcome, Industry Organization!",
    subtitle: "Provide thought leadership, host educational webinars, and connect your members to the largest marketplace of trusted wealth professionals and families.",
    benefits: [
      "Thought leadership platform",
      "Educational webinar hosting",
      "Member networking tools",
      "Sponsorship opportunities"
    ],
    ctaPrimary: "Schedule Webinar",
    ctaSecondary: "Connect Members",
    learnMoreText: "Unlock sponsorship and collaboration tools."
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