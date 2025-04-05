
import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  CircleDollarSign,
  Building,
  BookUser,
  Wallet,
  ScrollText,
  FileText,
  Home,
  Receipt,
  Landmark,
  Scale,
  Users2,
  User,
  Settings,
  Shield,
  Briefcase,
  HelpCircle,
  BadgeAlert,
  Bookmark,
  Plug,
  Inbox,
} from "lucide-react";
import { NavigationProps } from "@/types/navigation";

// Main navigation data
const navigationData: NavigationProps[] = [
  {
    title: "Overview",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    href: "/dashboard",
    isMainNavItem: true,
  },
  {
    title: "Cash Management",
    icon: <Wallet className="mr-2 h-4 w-4" />,
    href: "/cash-management",
    isMainNavItem: true,
    subItems: [
      {
        title: "Bill Pay",
        icon: <Receipt className="mr-2 h-4 w-4" />,
        href: "/bill-pay",
      },
      {
        title: "Bill Inbox",
        icon: <Inbox className="mr-2 h-4 w-4" />,
        href: "/bill-inbox",
      },
      {
        title: "Transfers",
        icon: <CircleDollarSign className="mr-2 h-4 w-4" />,
        href: "/transfers",
      },
      {
        title: "Funding Accounts",
        icon: <Landmark className="mr-2 h-4 w-4" />,
        href: "/funding-accounts",
      },
      {
        title: "Banking Transfers",
        icon: <CreditCard className="mr-2 h-4 w-4" />,
        href: "/banking-transfers",
      },
      {
        title: "Integrations",
        icon: <Plug className="mr-2 h-4 w-4" />,
        href: "/integrations",
      },
    ],
  },
  {
    title: "Family Wealth",
    icon: <Users2 className="mr-2 h-4 w-4" />,
    href: "#",
    isMainNavItem: true,
    subItems: [
      {
        title: "All Accounts",
        icon: <CreditCard className="mr-2 h-4 w-4" />,
        href: "/accounts",
      },
      {
        title: "Real Estate & Properties",
        icon: <Building className="mr-2 h-4 w-4" />,
        href: "/properties",
      },
      {
        title: "Legacy Vault",
        icon: <Shield className="mr-2 h-4 w-4" />,
        href: "/legacy-vault",
      },
    ],
  },
  {
    title: "Investments",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
    href: "/investments",
    isMainNavItem: true,
    subItems: [
      {
        title: "Performance",
        href: "/investment-performance",
      },
      {
        title: "Risk Analysis",
        href: "/investment-risk",
      },
      {
        title: "Portfolio Builder",
        href: "/portfolio-builder",
      },
    ],
  },
  {
    title: "Planning",
    icon: <ScrollText className="mr-2 h-4 w-4" />,
    href: "#",
    isMainNavItem: true,
    subItems: [
      {
        title: "Financial Plans",
        href: "/financial-plans",
      },
      {
        title: "Tax Planning",
        href: "/tax-planning",
      },
      {
        title: "Tax Budgets",
        href: "/tax-budgets",
      },
      {
        title: "Estate Planning",
        href: "/estate-planning",
      },
    ],
  },
  {
    title: "Insurance",
    icon: <FileText className="mr-2 h-4 w-4" />,
    href: "/insurance",
    isMainNavItem: true,
  },
  {
    title: "Support",
    icon: <BookUser className="mr-2 h-4 w-4" />,
    href: "#",
    isMainNavItem: true,
    subItems: [
      {
        title: "Professionals",
        href: "/professionals",
      },
      {
        title: "Marketplace",
        href: "/marketplace",
      },
      {
        title: "Education",
        href: "/education",
      },
    ],
  },
  {
    title: "Lending",
    icon: <Home className="mr-2 h-4 w-4" />,
    href: "/lending",
    isMainNavItem: true,
  },
  {
    title: "Operations",
    icon: <BadgeAlert className="mr-2 h-4 w-4" />,
    href: "#",
    isMainNavItem: false,
    subItems: [
      {
        title: "Diagnostics",
        href: "/system-diagnostics",
      },
      {
        title: "Access Control",
        href: "/developer-access-control",
      },
      {
        title: "IP Protection",
        href: "/ip-protection",
      },
    ],
  },
  {
    title: "Advisor",
    icon: <User className="mr-2 h-4 w-4" />,
    href: "#",
    isMainNavItem: false,
    subItems: [
      {
        title: "Dashboard",
        href: "/advisor-dashboard",
      },
      {
        title: "Profile",
        href: "/advisor-profile",
      },
      {
        title: "Module Marketplace",
        href: "/advisor-module-marketplace",
      },
      {
        title: "Onboarding",
        href: "/advisor-onboarding",
      },
      {
        title: "Feedback",
        href: "/advisor-feedback",
      },
    ],
  },
  {
    title: "Subscription",
    icon: <Bookmark className="mr-2 h-4 w-4" />,
    href: "/subscription",
    isMainNavItem: false,
  },
  {
    title: "Help",
    icon: <HelpCircle className="mr-2 h-4 w-4" />,
    href: "/help",
    isMainNavItem: false,
  },
  {
    title: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    href: "/settings",
    isMainNavItem: false,
  },
];

// Add navigationCategories for sidebar structure
export const navigationCategories = [
  {
    id: "main",
    label: "Main",
    items: navigationData.filter(item => item.isMainNavItem),
    defaultExpanded: true
  },
  {
    id: "secondary",
    label: "Other",
    items: navigationData.filter(item => !item.isMainNavItem),
    defaultExpanded: false
  }
];

// Function to get secondary menu items based on active item
export function getSecondaryMenuItems(activeItem: string) {
  // Find the navigation item that matches the active item
  const navItem = navigationData.find(item => 
    item.href.includes(activeItem) || activeItem.includes(item.title.toLowerCase())
  );
  
  // If found and it has sub-items, return them with proper format
  if (navItem && navItem.subItems) {
    return navItem.subItems.map(subItem => ({
      id: subItem.href.split('/').pop() || '',
      label: subItem.title,
      name: subItem.title,
      active: false
    }));
  }
  
  // Default empty array if no matching item or no sub-items
  return [];
}

export default navigationData;
