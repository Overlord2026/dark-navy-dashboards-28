
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Users,
  FileText,
  Building2,
  BadgePercent,
  LandPlot,
  HandCoins,
  Home,
  Network,
  Layers,
  BarChart
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Education",
    href: "/education",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Family Wealth",
    href: "/family-wealth",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Professionals",
    href: "/professionals",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Planning",
    href: "/planning",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <BarChart className="h-5 w-5" />,
  },
];

export const bottomNavigationItems = [
  {
    title: "Project Integration",
    href: "/integration",
    icon: <Network className="h-5 w-5" />,
    badge: "New",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export const advisorNavigationItems = [
  {
    title: "Dashboard",
    href: "/advisor/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Clients",
    href: "/advisor/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Marketing",
    href: "/advisor/marketing",
    icon: <BadgePercent className="h-5 w-5" />,
  },
  {
    title: "Practice",
    href: "/advisor/practice",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/advisor/reports",
    icon: <FileText className="h-5 w-5" />,
  },
];
