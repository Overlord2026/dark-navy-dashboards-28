
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

export const navigationItems = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Personal",
    items: [
      {
        title: "Profile",
        href: "/profile",
        icon: <User className="h-5 w-5" />,
      },
      {
        title: "Documents",
        href: "/documents",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Wealth",
    items: [
      {
        title: "Investments",
        href: "/investments",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        title: "Properties",
        href: "/properties",
        icon: <Folder className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help",
        href: "/help",
        icon: <LifeBuoy className="h-5 w-5" />,
      },
      {
        title: "FAQ",
        href: "/faq",
        icon: <BadgeHelp className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        title: "Diagnostics",
        href: "/system-diagnostics",
        icon: <BarChartHorizontal className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Integration",
    items: [
      {
        title: "Project Integration",
        href: "/project-integration",
        icon: <Network className="h-5 w-5" />,
      },
      {
        title: "Connected Users",
        href: "/connected-users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Marketplace",
        href: "/marketplace",
        icon: <Boxes className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];
