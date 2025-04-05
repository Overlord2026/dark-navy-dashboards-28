
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
  Receipt,
  ShieldCheck
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
      { id: "personal-insurance", label: "Personal Insurance", icon: ShieldCheck, href: "/personal-insurance" },
      { id: "cash-management", label: "Cash Management", icon: BanknoteIcon, href: "/cash-management" },
      { id: "tax-budgets", label: "Tax & Budgets", icon: Calculator, href: "/tax-budgets" },
      { id: "transfers", label: "Transfers", icon: ArrowRightLeft, href: "/transfers" },
      { id: "legacy-vault", label: "Secure Family Vault", icon: VaultIcon, href: "/legacy-vault" },
      { id: "social-security", label: "Social Security", icon: CircleDollarSignIcon, href: "/social-security" },
      { id: "properties", label: "Real Estate", icon: BuildingIcon, href: "/properties" },
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

// Fund manager submenu for each category with focus on the companies requested
export const privateEquityProviders: MenuItem[] = [
  { id: "all-pe", name: "All Private Equity", active: true },
  { id: "blackstone-pe", name: "Blackstone" },
  { id: "apollo-pe", name: "Apollo" },
  { id: "kkr-pe", name: "KKR" },
  { id: "stepstone-pe", name: "StepStone" },
  { id: "amg-pantheon", name: "AMG Pantheon" },
  { id: "hamilton-lane", name: "Hamilton Lane" },
  { id: "carlyle", name: "Carlyle Group" },
  { id: "tpg", name: "TPG" },
  { id: "bain-capital", name: "Bain Capital" },
  { id: "warburg-pincus", name: "Warburg Pincus" },
  { id: "eqt", name: "EQT" },
  { id: "cvc", name: "CVC Capital Partners" },
  { id: "advent", name: "Advent International" },
  { id: "thoma-bravo", name: "Thoma Bravo" },
];

export const privateDebtProviders: MenuItem[] = [
  { id: "all-pd", name: "All Private Debt", active: true },
  { id: "ares-pd", name: "Ares" },
  { id: "blackstone-pd", name: "Blackstone Credit" },
  { id: "apollo-pd", name: "Apollo" },
  { id: "cliffwater-pd", name: "Cliffwater" },
  { id: "stepstone-pd", name: "StepStone" },
  { id: "kkr-pd", name: "KKR" },
  { id: "oaktree-pd", name: "Oaktree" },
  { id: "golub-pd", name: "Golub Capital" },
  { id: "blue-owl-pd", name: "Blue Owl Capital" },
  { id: "monroe-pd", name: "Monroe Capital" },
  { id: "antares-pd", name: "Antares Capital" },
  { id: "carlyle-pd", name: "Carlyle Global Credit" },
  { id: "goldman-pd", name: "Goldman Sachs" },
  { id: "sixth-street", name: "Sixth Street" },
];

export const realAssetsProviders: MenuItem[] = [
  { id: "all-ra", name: "All Real Assets", active: true },
  { id: "blackstone-ra", name: "Blackstone Real Estate" },
  { id: "brookfield-ra", name: "Brookfield" },
  { id: "hancock-ra", name: "Hancock" },
  { id: "gip-ra", name: "Global Infrastructure Partners" },
  { id: "apollo-ra", name: "Apollo Real Assets" },
  { id: "kkr-ra", name: "KKR Real Assets" },
  { id: "starwood-ra", name: "Starwood Capital" },
  { id: "carlyle-ra", name: "Carlyle Real Assets" },
  { id: "hines-ra", name: "Hines" },
  { id: "blackrock-ra", name: "BlackRock Real Assets" },
  { id: "colony-ra", name: "DigitalBridge" },
  { id: "pgim-ra", name: "PGIM Real Estate" },
  { id: "cbre-ra", name: "CBRE Investment Management" },
  { id: "nuveen-ra", name: "Nuveen Real Estate" },
];

export const digitalAssetsProviders: MenuItem[] = [
  { id: "all-da", name: "All Digital Assets", active: true },
  { id: "pantera", name: "Pantera Capital" },
  { id: "grayscale", name: "Grayscale" },
  { id: "a16z", name: "Andreessen Horowitz" },
  { id: "parafi", name: "ParaFi Capital" },
];

export const getSecondaryMenuItems = (activeMainItem: string): MenuItem[] => {
  switch (activeMainItem) {
    case "accounts":
      return accountsSubMenuItems;
    case "sharing":
      return sharingSubMenuItems;
    case "education":
      return educationSubMenuItems;
    case "private-equity":
      return []; // No longer shown in the sidebar
    case "private-debt":
      return []; // No longer shown in the sidebar
    case "real-assets":
      return []; // No longer shown in the sidebar
    case "digital-assets":
      return []; // No longer shown in the sidebar
    default:
      return [];
  }
};
