import {
  LayoutGridIcon,
  CreditCardIcon,
  DollarSignIcon,
  WalletIcon,
  RepeatIcon,
  HomeIcon,
  TargetIcon,
  CalendarIcon,
  StarIcon,
  ArchiveIcon,
  FileTextIcon,
  UserCheckIcon,
  BriefcaseIcon,
  ChevronDownIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

// Wealth Management Navigation Registry
export const wealthManagementNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/wealth",
    icon: LayoutGridIcon,
  },
  {
    title: "Accounts Overview", 
    href: "/wealth/accounts",
    icon: CreditCardIcon,
  },
  {
    title: "Cash & Transfers",
    href: "/wealth/cash",
    icon: DollarSignIcon,
    children: [
      {
        title: "Cash Management",
        href: "/wealth/cash/management", 
        icon: WalletIcon,
      },
      {
        title: "Transfers",
        href: "/wealth/cash/transfers",
        icon: RepeatIcon,
      },
    ],
  },
  {
    title: "Properties",
    href: "/wealth/properties",
    icon: HomeIcon,
  },
  {
    title: "Goals & Budgets", 
    href: "/wealth/goals",
    icon: TargetIcon,
    children: [
      {
        title: "Retirement Goals",
        href: "/wealth/goals/retirement",
        icon: CalendarIcon,
      },
      {
        title: "Bucket-List Goals", 
        href: "/wealth/goals/bucket-list",
        icon: StarIcon,
      },
      {
        title: "Budgets",
        href: "/wealth/goals/budgets",
        icon: ArchiveIcon,
      },
    ],
  },
  {
    title: "Documents & Vault",
    href: "/wealth/docs",
    icon: FileTextIcon,
  },
  {
    title: "Social Security",
    href: "/wealth/social-security", 
    icon: UserCheckIcon,
  },
  {
    title: "Business Filings",
    href: "/wealth/business-filings",
    icon: BriefcaseIcon,
  },
  {
    title: "Bill Pay",
    href: "/wealth/bill-pay",
    icon: CreditCardIcon,
  },
];

// Professional Dashboard Navigation
export const professionalDashboardNavItems: NavItem[] = [
  {
    title: "Advisor Dashboard",
    href: "/advisor-dashboard",
    icon: BriefcaseIcon,
    label: "Comprehensive practice management with client insights"
  },
  {
    title: "CPA Dashboard",
    href: "/cpa",
    icon: BriefcaseIcon,
    label: "Tax & Accounting Hub"
  },
  {
    title: "Estate Attorney Dashboard", 
    href: "/attorney",
    icon: UserCheckIcon,
    label: "Estate Planning Hub"
  },
];

// Client Tools Navigation Registry (top-level category)
export const clientToolsNavItems: NavItem[] = [
  {
    title: "Wealth Management",
    href: "/wealth",
    icon: BriefcaseIcon,
    children: wealthManagementNavItems,
  },
  {
    title: "Your Team",
    href: "/your-team",
    icon: UserCheckIcon,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: LayoutGridIcon,
  },
  // TODO: Add other client tools sections like Health Optimization, etc.
];

// Export for integration with main navigation registry
export default wealthManagementNavItems;