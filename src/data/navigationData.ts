import { 
  Home, 
  File, 
  Users,
  Settings, 
  CreditCard, 
  UserCircle, 
  Briefcase, 
  BarChart, 
  Clock, 
  Calendar, 
  DollarSign, 
  FileText, 
  Wallet, 
  HeartHandshake, 
  Network, 
  Brain, 
  Layers, 
  Puzzle,
  Code2
} from "lucide-react";

export const mainNavItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
    subPaths: ["/dashboard"],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
    subPaths: ["/profile", "/advisor-profile"],
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    subPaths: ["/documents"]
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Project Integration",
    href: "/integration",
    icon: Puzzle,
    badge: "Connected",
    badgeColor: "green",
    subPaths: ["/integration"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const investmentsSidebarNavItems = [
  {
    title: "Portfolio Overview",
    href: "/investments/portfolio",
    items: [],
  },
  {
    title: "Asset Allocation",
    href: "/investments/allocation",
    items: [
      {
        title: "Strategic Allocation",
        href: "/investments/allocation/strategic",
        items: [],
      },
      {
        title: "Tactical Adjustments",
        href: "/investments/allocation/tactical",
        items: [],
      },
      {
        title: "Intelligent Allocation",
        href: "/investments/allocation/intelligent",
        items: [],
      },
    ],
  },
];

export const assetManagementSidebarNavItems = [
  {
    title: "Overview",
    href: "/assets/overview",
    items: [],
  },
  {
    title: "Real Estate",
    href: "/assets/real-estate",
    items: [
      {
        title: "Properties",
        href: "/assets/real-estate/properties",
        items: [],
      },
      {
        title: "Mortgages",
        href: "/assets/real-estate/mortgages",
        items: [],
      },
    ],
  },
];

export const wealthPlanningSidebarNavItems = [
  {
    title: "Financial Goals",
    href: "/wealth-planning/goals",
    items: [],
  },
  {
    title: "Retirement Planning",
    href: "/wealth-planning/retirement",
    items: [],
  },
];

export const taxStrategySidebarNavItems = [
  {
    title: "Tax Dashboard",
    href: "/tax/dashboard",
    items: [],
  },
  {
    title: "Tax Optimization",
    href: "/tax/optimization",
    items: [],
  },
];

export const philanthropySidebarNavItems = [
  {
    title: "Overview",
    href: "/philanthropy/overview",
    items: [],
  },
  {
    title: "Charitable Giving",
    href: "/philanthropy/giving",
    items: [],
  },
];

export const educationSidebarNavItems = [
  {
    title: "Learning Center",
    href: "/education",
    items: [],
  },
  {
    title: "Financial Literacy",
    href: "/education/financial-literacy",
    items: [],
  },
];

export const integrationSidebarNavItems = [
  {
    title: "Connected Projects",
    href: "/integration",
    items: [],
  },
  {
    title: "Architecture",
    href: "/integration/architecture",
    items: [],
  },
  {
    title: "API Documentation",
    href: "/integration/api",
    items: [],
  },
  {
    title: "Plugins",
    href: "/integration/plugins",
    items: [],
  },
  {
    title: "Developer Settings",
    href: "/integration/developer",
    items: [],
  },
];

export const getSidebarNavItems = (section: string) => {
  switch (section) {
    case "investments":
      return investmentsSidebarNavItems;
    case "assets":
      return assetManagementSidebarNavItems;
    case "wealth-planning":
      return wealthPlanningSidebarNavItems;
    case "tax":
      return taxStrategySidebarNavItems;
    case "philanthropy":
      return philanthropySidebarNavItems;
    case "education":
      return educationSidebarNavItems;
    case "integration":
      return integrationSidebarNavItems;
    default:
      return [];
  }
};
