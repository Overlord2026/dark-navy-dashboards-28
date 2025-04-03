
import React from "react";
import {
  HomeIcon,
  BarChart3Icon,
  ShieldIcon,
  BanknoteIcon,
  WalletIcon,
  FileTextIcon,
  ShareIcon,
  GraduationCapIcon,
  BuildingIcon,
  Users2Icon,
  VaultIcon,
  LineChartIcon,
  CircleDollarSignIcon,
  ArchiveIcon,
  PieChart,
  ArrowRightLeft,
  Calculator,
  Receipt
} from "lucide-react";

type MainMenuItem = {
  id: string;
  label: string;
  icon: React.ElementType | React.FC;
  href: string;
  active?: boolean;
  subItems?: MainMenuItem[];
};

type NavCategory = {
  id: string;
  label: string;
  items: MainMenuItem[];
  defaultExpanded?: boolean;
};

const CustomHomeIcon: React.FC = () => (
  <img 
    src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
    alt="Home"
    className="h-5 w-5"
  />
);

export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    defaultExpanded: true,
    items: [
      { id: "home", label: "Home", icon: CustomHomeIcon, href: "/" },
    ]
  },
  {
    id: "education-solutions",
    label: "Education & Solutions",
    defaultExpanded: true,
    items: [
      { id: "education", label: "Education Center", icon: GraduationCapIcon, href: "/education" },
      { id: "investments", label: "Investments", icon: BarChart3Icon, href: "/investments" },
      { id: "tax-planning", label: "Tax Planning", icon: PieChart, href: "/education/tax-planning" },
      { id: "insurance", label: "Insurance", icon: ShieldIcon, href: "/insurance" },
      { id: "lending", label: "Lending", icon: BanknoteIcon, href: "/lending" },
      { id: "estate-planning", label: "Estate Planning", icon: ArchiveIcon, href: "/estate-planning" },
    ]
  },
  {
    id: "family-wealth",
    label: "Family Wealth",
    defaultExpanded: true,
    items: [
      { id: "financial-plans", label: "Financial Plans", icon: LineChartIcon, href: "/financial-plans" },
      { id: "accounts", label: "Accounts Overview", icon: WalletIcon, href: "/accounts" },
      { id: "cash-management", label: "Cash Management", icon: BanknoteIcon, href: "/cash-management" },
      { id: "tax-budgets", label: "Tax & Budgets", icon: Calculator, href: "/tax-budgets" },
      { id: "transfers", label: "Transfers", icon: ArrowRightLeft, href: "/transfers" },
      { id: "legacy-vault", label: "Secure Family Vault", icon: VaultIcon, href: "/legacy-vault" },
      { id: "social-security", label: "Social Security", icon: CircleDollarSignIcon, href: "/social-security" },
      { id: "properties", label: "Real Estate & Properties", icon: BuildingIcon, href: "/properties" },
      { id: "billpay", label: "Bill Pay", icon: Receipt, href: "/billpay" },
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration & Sharing",
    items: [
      { id: "documents", label: "Document Sharing", icon: FileTextIcon, href: "/documents" },
      { id: "professionals", label: "Professional Access", icon: Users2Icon, href: "/professionals" },
      { id: "sharing", label: "Family Member Access", icon: ShareIcon, href: "/sharing" },
    ]
  },
];

export type MenuItem = {
  id: string;
  label?: string;
  name?: string;
  active?: boolean;
};

export const accountsSubMenuItems: MenuItem[] = [];

export const sharingSubMenuItems: MenuItem[] = [
  { id: "shared-with-me", name: "Shared With Me", active: true },
  { id: "shared-by-me", name: "Shared By Me" },
  { id: "collaborators", name: "Collaborators" },
];

export const educationSubMenuItems: MenuItem[] = [
  { id: "all-courses", name: "All Courses", active: true },
  { id: "financial-basics", name: "Financial Basics" },
  { id: "investing", name: "Investing" },
  { id: "retirement", name: "Retirement" },
  { id: "premium", name: "Premium Courses" },
];

// New investment submenu items for alternative investments
export const investmentSubMenuItems: MenuItem[] = [
  { id: "overview", name: "Overview", active: true },
  { id: "alternative", name: "Alternative Investments" },
  { id: "private-equity", name: "Private Equity" },
  { id: "private-debt", name: "Private Debt" },
  { id: "real-assets", name: "Real Assets" },
  { id: "digital-assets", name: "Digital Assets" },
  { id: "portfolio", name: "My Portfolio" },
];

// Fund manager submenu for each category
export const privateEquityProviders: MenuItem[] = [
  { id: "all-pe", name: "All Private Equity", active: true },
  { id: "blackstone-pe", name: "Blackstone" },
  { id: "apollo-pe", name: "Apollo" },
  { id: "kkr-pe", name: "KKR" },
  { id: "stepstone-pe", name: "StepStone" },
  { id: "amg-pantheon", name: "AMG Pantheon" },
  { id: "hamilton-lane", name: "Hamilton Lane" },
];

export const privateDebtProviders: MenuItem[] = [
  { id: "all-pd", name: "All Private Debt", active: true },
  { id: "ares-pd", name: "Ares" },
  { id: "blackstone-pd", name: "Blackstone Credit" },
  { id: "apollo-pd", name: "Apollo" },
  { id: "cliffwater-pd", name: "Cliffwater" },
  { id: "stepstone-pd", name: "StepStone" },
  { id: "kkr-pd", name: "KKR" },
];

export const realAssetsProviders: MenuItem[] = [
  { id: "all-ra", name: "All Real Assets", active: true },
  { id: "blackstone-ra", name: "Blackstone Real Estate" },
  { id: "brookfield-ra", name: "Brookfield" },
  { id: "hancock-ra", name: "Hancock" },
  { id: "gip-ra", name: "Global Infrastructure Partners" },
];

export const getSecondaryMenuItems = (activeMainItem: string): MenuItem[] => {
  switch (activeMainItem) {
    case "accounts":
      return accountsSubMenuItems;
    case "sharing":
      return sharingSubMenuItems;
    case "education":
      return educationSubMenuItems;
    case "investments":
      return investmentSubMenuItems;
    case "private-equity":
      return privateEquityProviders;
    case "private-debt":
      return privateDebtProviders;
    case "real-assets":
      return realAssetsProviders;
    default:
      return [];
  }
};
