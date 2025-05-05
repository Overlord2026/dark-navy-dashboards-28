
import React from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Settings,
  TrendingUp,
  Folder,
  LifeBuoy,
  BadgeHelp,
  BarChartHorizontal,
  Network,
  Users,
  Boxes
} from "lucide-react";

// Define each section properly with id, label and icon properties
export const navigationItems = [
  {
    id: "home",
    label: "Home",
    icon: LayoutDashboard,
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    icon: User,
    items: [
      {
        label: "Profile",
        href: "/profile",
        icon: <User className="h-5 w-5" />,
      },
      {
        label: "Documents",
        href: "/documents",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "wealth",
    label: "Wealth",
    icon: TrendingUp,
    items: [
      {
        label: "Investments",
        href: "/investments",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        label: "Properties",
        href: "/properties",
        icon: <Folder className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    icon: LifeBuoy,
    items: [
      {
        label: "Help",
        href: "/help",
        icon: <LifeBuoy className="h-5 w-5" />,
      },
      {
        label: "FAQ",
        href: "/faq",
        icon: <BadgeHelp className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: BarChartHorizontal,
    items: [
      {
        label: "Diagnostics",
        href: "/system-diagnostics",
        icon: <BarChartHorizontal className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "integration",
    label: "Integration",
    icon: Network,
    items: [
      {
        label: "Project Integration",
        href: "/project-integration",
        icon: <Network className="h-5 w-5" />,
      },
      {
        label: "Connected Users",
        href: "/connected-users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        label: "Marketplace",
        href: "/marketplace",
        icon: <Boxes className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

// Add this export to match the import in Sidebar.tsx
export const navSections = navigationItems;
