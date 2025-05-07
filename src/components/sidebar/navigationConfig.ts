
import { LayoutDashboardIcon, BookOpen, FileText, Users, Network } from "lucide-react";

// Define the navigation structure
export const navSections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/"
  },
  {
    id: "education",
    label: "Education & Solutions",
    icon: BookOpen,
    items: [
      { label: "Education Center", href: "/education", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Guides", href: "/guides", icon: <FileText className="h-4 w-4" /> }
    ]
  },
  {
    id: "planning",
    label: "Planning & Services",
    icon: FileText,
    items: [
      { label: "Financial Plans", href: "/financial-plans", icon: <FileText className="h-4 w-4" /> },
      { label: "Tax Planning", href: "/tax-planning", icon: <FileText className="h-4 w-4" /> },
      { label: "Estate Planning", href: "/estate-planning", icon: <FileText className="h-4 w-4" /> }
    ]
  },
  {
    id: "wealth",
    label: "Wealth Management",
    icon: FileText,
    items: [
      { label: "Accounts", href: "/accounts", icon: <FileText className="h-4 w-4" /> },
      { label: "Investments", href: "/investments", icon: <FileText className="h-4 w-4" /> },
      { label: "Properties", href: "/properties", icon: <FileText className="h-4 w-4" /> }
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: Users,
    href: "/sharing"
  },
  {
    id: "integration",
    label: "Project Integration",
    icon: Network,
    href: "/integration",
    requireRoles: ["admin", "advisor"] // This section requires admin or advisor role
  }
];
