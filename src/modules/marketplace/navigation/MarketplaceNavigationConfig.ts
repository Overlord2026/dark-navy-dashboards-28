
import { Icon } from "lucide-react";
import { 
  BarChart3, 
  ReceiptText, 
  Scroll, 
  Briefcase, 
  Users,
  FileText,
  Building,
  HandshakeIcon,
  ClipboardList,
  ShoppingBag
} from "lucide-react";

export type MarketplaceSubItem = {
  id: string;
  name: string;
  href: string;
};

export type MarketplaceCategory = {
  id: string;
  name: string;
  icon: typeof Icon;
  description: string;
  subcategories: MarketplaceSubItem[];
};

// Define the main marketplace categories and their subcategories
export const marketplaceCategories: MarketplaceCategory[] = [
  {
    id: "wealth-management",
    name: "Holistic Wealth Management & Investment Advisory",
    icon: BarChart3,
    description: "Comprehensive wealth management and investment advisory services",
    subcategories: [
      { id: "portfolio-management", name: "Portfolio Management & Monitoring", href: "/marketplace/wealth-management/portfolio-management" },
      { id: "private-markets", name: "Private Market Investment Opportunities", href: "/marketplace/wealth-management/private-markets" },
      { id: "risk-tax-optimization", name: "Risk & Tax Optimization Strategies", href: "/marketplace/wealth-management/risk-tax-optimization" }
    ]
  },
  {
    id: "tax-planning",
    name: "Proactive Tax Planning & Optimization",
    icon: ReceiptText,
    description: "Advanced tax planning and optimization strategies",
    subcategories: [
      { id: "tax-minimization", name: "Advanced Tax Minimization Techniques", href: "/marketplace/tax-planning/tax-minimization" },
      { id: "multi-state", name: "Multi-State Residency Strategies", href: "/marketplace/tax-planning/multi-state" },
      { id: "professional-coordination", name: "CPA & Attorney Coordination", href: "/marketplace/tax-planning/professional-coordination" }
    ]
  },
  {
    id: "estate-planning",
    name: "Estate & Legacy Planning",
    icon: Scroll,
    description: "Comprehensive estate planning and legacy preservation",
    subcategories: [
      { id: "estate-trust", name: "Comprehensive Estate & Trust Planning", href: "/marketplace/estate-planning/estate-trust" },
      { id: "family-legacy", name: "Family Legacy Planning", href: "/marketplace/estate-planning/family-legacy" },
      { id: "philanthropy", name: "Philanthropy & Charitable Giving", href: "/marketplace/estate-planning/philanthropy" }
    ]
  },
  {
    id: "concierge-services",
    name: "Concierge Lifestyle & Administrative Services",
    icon: Briefcase,
    description: "Premium lifestyle management and administrative services",
    subcategories: [
      { id: "bill-pay", name: "Bill Pay & Personal Bookkeeping", href: "/marketplace/concierge-services/bill-pay" },
      { id: "travel-property", name: "Private Travel & Property Management", href: "/marketplace/concierge-services/travel-property" },
      { id: "exclusive-experiences", name: "Exclusive Experiences & Memberships", href: "/marketplace/concierge-services/exclusive-experiences" }
    ]
  },
  {
    id: "family-governance",
    name: "Strategic Family Governance & Education",
    icon: Users,
    description: "Family governance structures and educational programs",
    subcategories: [
      { id: "governance-succession", name: "Family Governance & Succession Structures", href: "/marketplace/family-governance/governance-succession" },
      { id: "next-gen", name: "Next-Generation Education Programs", href: "/marketplace/family-governance/next-gen" },
      { id: "strategic-philanthropy", name: "Strategic Philanthropy & Impact Investing", href: "/marketplace/family-governance/strategic-philanthropy" }
    ]
  }
];

// Register marketplace in the main navigation
export const registerMarketplaceNavigation = () => {
  return {
    id: "marketplace",
    label: "Marketplace",
    icon: ShoppingBag,
    href: "/marketplace",
    subItems: [
      { id: "marketplace-home", name: "Marketplace Home", href: "/marketplace" },
      { id: "family-office-directory", name: "Family Office Directory", href: "/family-office-directory" },
      { id: "marketplace-rfp", name: "Request for Proposals", href: "/marketplace/rfp" },
      { id: "marketplace-payments", name: "Payment Management", href: "/marketplace/payments" }
    ]
  };
};

// Marketplace section categories for the directory
export const serviceSections = [
  { id: "directory", name: "Family Office Directory", href: "/family-office-directory", icon: Building },
  { id: "rfp", name: "Submit RFP", href: "/marketplace/rfp", icon: FileText },
  { id: "proposals", name: "My Proposals", href: "/marketplace/proposals", icon: ClipboardList },
  { id: "payments", name: "Payment Management", href: "/marketplace/payments", icon: HandshakeIcon }
];
