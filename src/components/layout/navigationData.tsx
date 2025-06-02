import {
  Home,
  CreditCard,
  TrendingUp,
  DollarSign,
  ArrowLeftRight,
  TrendingUp as TrendingUpIcon,
  Building,
  FileText,
  Rocket,
  Gem,
  Smartphone,
  Building2,
  BarChart3,
  PieChart,
  Search,
  Calculator,
  Shield,
  Target,
  Archive,
  Users,
  BookOpen,
  Share2,
  Link,
  HelpCircle,
  Settings
} from "lucide-react";

import { NavCategory, NavItem } from "@/types/navigation";

export const navigationCategories: NavCategory[] = [
  {
    id: "Home",
    title: "Home",
    label: "Home",
    defaultExpanded: true,
    items: [
      {
        title: "Dashboard",
        href: "/client-dashboard",
        icon: Home,
        items: []
      }
    ]
  },
  {
    id: "Accounts",
    title: "Accounts",
    label: "Accounts", 
    defaultExpanded: true,
    items: [
      {
        title: "Accounts",
        href: "/accounts",
        icon: CreditCard,
        items: []
      },
      {
        title: "All Assets",
        href: "/client-all-assets",
        icon: TrendingUp,
        items: []
      },
      {
        title: "Cash Management",
        href: "/cash-management", 
        icon: DollarSign,
        items: []
      },
      {
        title: "Transfers",
        href: "/transfers",
        icon: ArrowLeftRight,
        items: []
      }
    ]
  },
  {
    id: "Family Wealth",
    title: "Family Wealth",
    label: "Family Wealth",
    defaultExpanded: true,
    items: [
      {
        title: "Investments",
        href: "/client-investments",
        icon: TrendingUp,
        items: [
          {
            title: "Alternative Investments",
            href: "/client-investments/alternative",
            icon: Building,
            items: [
              {
                title: "Private Equity",
                href: "/client-investments/alternative/private-equity",
                icon: Building,
                items: []
              },
              {
                title: "Private Debt", 
                href: "/client-investments/alternative/private-debt",
                icon: FileText,
                items: []
              },
              {
                title: "Hedge Funds",
                href: "/client-investments/alternative/hedge-fund",
                icon: TrendingUp,
                items: []
              },
              {
                title: "Venture Capital",
                href: "/client-investments/alternative/venture-capital", 
                icon: Rocket,
                items: []
              },
              {
                title: "Collectibles",
                href: "/client-investments/alternative/collectibles",
                icon: Gem,
                items: []
              },
              {
                title: "Digital Assets",
                href: "/client-investments/alternative/digital-assets",
                icon: Smartphone,
                items: []
              },
              {
                title: "Real Assets",
                href: "/client-investments/alternative/real-assets",
                icon: Building2,
                items: []
              },
              {
                title: "Structured Investments",
                href: "/client-investments/alternative/structured-investments",
                icon: BarChart3,
                items: []
              }
            ]
          },
          {
            title: "Model Portfolios",
            href: "/client-investments/model-portfolios",
            icon: PieChart,
            items: []
          },
          {
            title: "Stock Screener",
            href: "/client-investments/stock-screener",
            icon: Search,
            items: []
          }
        ]
      },
      {
        title: "Tax Planning",
        href: "/tax-planning",
        icon: Calculator,
        items: []
      },
      {
        title: "Insurance",
        href: "/client-insurance", 
        icon: Shield,
        items: []
      },
      {
        title: "Lending",
        href: "/client-lending",
        icon: Building,
        items: []
      },
      {
        title: "Estate Planning",
        href: "/client-estate-planning",
        icon: FileText,
        items: []
      },
      {
        title: "Financial Plans",
        href: "/financial-plans",
        icon: Target,
        items: []
      },
      {
        title: "Tax Budgets",
        href: "/client-tax-budgets",
        icon: Calculator,
        items: []
      },
      {
        title: "Legacy Vault",
        href: "/legacy-vault",
        icon: Archive,
        items: []
      },
      {
        title: "Social Security",
        href: "/social-security",
        icon: Users,
        items: []
      },
      {
        title: "Properties",
        href: "/properties",
        icon: Building,
        items: []
      },
      {
        title: "Bill Pay",
        href: "/client-billpay",
        icon: CreditCard,
        items: []
      }
    ]
  },
  {
    id: "Education",
    title: "Education",
    label: "Education",
    defaultExpanded: true,
    items: [
      {
        title: "Education",
        href: "/client-education",
        icon: BookOpen,
        items: []
      }
    ]
  },
  {
    id: "Collaboration",
    title: "Collaboration",
    label: "Collaboration",
    defaultExpanded: true,
    items: [
      {
        title: "Documents",
        href: "/client-documents",
        icon: FileText,
        items: []
      },
      {
        title: "Professionals",
        href: "/professionals", 
        icon: Users,
        items: []
      },
      {
        title: "Sharing",
        href: "/sharing",
        icon: Share2,
        items: []
      }
    ]
  },
  {
    id: "Integration",
    title: "Integration",
    label: "Integration",
    defaultExpanded: true,
    items: [
      {
        title: "Project Integration",
        href: "/project-integration",
        icon: Link,
        items: []
      }
    ]
  },
  {
    id: "Settings",
    title: "Settings",
    label: "Settings",
    defaultExpanded: true,
    items: [
      {
        title: "Help",
        href: "/help",
        icon: HelpCircle,
        items: []
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        items: []
      }
    ]
  }
];

export const navItems: { [key: string]: NavItem[] } = navigationCategories.reduce((acc: { [key: string]: NavItem[] }, category) => {
  acc[category.label] = category.items;
  return acc;
}, {});

// Add the missing getSecondaryMenuItems function
export const getSecondaryMenuItems = (activeMainItem: string): { id: string; label?: string; name?: string; active?: boolean }[] => {
  // Return empty array for now - this function can be implemented based on specific requirements
  return [];
};
