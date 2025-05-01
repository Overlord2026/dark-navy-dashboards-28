import { 
  LayoutIcon, 
  LineChart, 
  Library, 
  BookOpen, 
  Scale, 
  FileText, 
  Home, 
  BookMarked, 
  MoveRight,
  Info,
  Settings,
  User,
  Heart, 
  Building, 
  GanttChart,
  BarChart3,
  Folders,
  PieChart,
  FileBox,
  LayoutGrid,
  PanelsTopBottom,
  PanelsLeftRight,
  Plane,
  LayoutList,
  LayoutTemplate,
  LayoutDashboard,
  ListChecks,
  CheckCircle,
  Shield
} from "lucide-react";

export const navigationData = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutIcon,
        description: "Your personalized overview.",
      },
      {
        title: "Net Worth",
        href: "/net-worth",
        icon: LineChart,
        description: "Track your financial progress.",
      },
    ],
  },
  {
    title: "Financial Planning",
    items: [
      {
        title: "Budgeting",
        href: "/budgeting",
        icon: Scale,
        description: "Manage your income and expenses.",
      },
      {
        title: "Goals",
        href: "/goals",
        icon: BookMarked,
        description: "Set and achieve your financial goals.",
      },
      {
        title: "Investments",
        href: "/investments",
        icon: BarChart3,
        description: "Manage your investment portfolio.",
      },
      {
        title: "Insurance",
        href: "/insurance",
        icon: Shield,
        description: "Protect yourself and your assets.",
      },
      {
        title: "Estate Planning",
        href: "/estate-planning",
        icon: FileText,
        description: "Plan for the future and secure your legacy.",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Financial Education",
        href: "/financial-education",
        icon: BookOpen,
        description: "Learn about personal finance.",
      },
      {
        title: "Marketplace",
        href: "/marketplace",
        icon: Library,
        description: "Explore financial products and services.",
      },
      {
        title: "Find an Advisor",
        href: "/find-an-advisor",
        icon: User,
        description: "Connect with a financial advisor.",
      },
    ],
  },
  {
    title: "Boutique Family Office",
    items: [
      {
        title: "About Us",
        href: "/about",
        icon: Info,
        description: "Learn about our company and mission.",
      },
      {
        title: "Contact",
        href: "/contact",
        icon: MoveRight,
        description: "Get in touch with our team.",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Manage your account settings.",
      },
    ],
  },
];
