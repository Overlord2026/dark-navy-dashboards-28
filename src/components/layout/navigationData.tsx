
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
  BookIcon,
  BarChart2Icon,
  Network
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
      { id: "documents", label: "Documents", icon: BookIcon, href: "/documents" },
    ]
  },
  {
    id: "education-solutions",
    label: "Education & Solutions",
    defaultExpanded: true,
    items: [
      { id: "education", label: "Education Center", icon: GraduationCapIcon, href: "/education" },
      { id: "tax-planning", label: "Tax Planning", icon: PieChart, href: "/tax-planning" },
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
      { id: "professionals", label: "Professional Access", icon: Users2Icon, href: "/professionals" },
      { id: "sharing", label: "Family Member Access", icon: ShareIcon, href: "/sharing" },
      { id: "integration", label: "Project Integration", icon: Network, href: "/integration" },
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

export const getSecondaryMenuItems = (activeMainItem: string): MenuItem[] => {
  switch (activeMainItem) {
    case "accounts":
      return accountsSubMenuItems;
    case "sharing":
      return sharingSubMenuItems;
    case "education":
      return educationSubMenuItems;
    default:
      return [];
  }
};
