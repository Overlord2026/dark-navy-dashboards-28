
import { 
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  LineChart, 
  FileText, 
  Users, 
  Settings, 
  NetworkIcon, 
  PuzzleIcon
} from "lucide-react";

export const homeNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    sections: []
  },
  {
    title: "Investments",
    href: "/investments",
    icon: LineChart,
    sections: [
      {
        title: "Portfolio Overview",
        href: "/investments/portfolio"
      },
      {
        title: "Alternative Investments",
        href: "/investments/alternative"
      },
      {
        title: "Intelligent Allocation",
        href: "/investments/intelligent-allocation"
      },
      {
        title: "Performance",
        href: "/investments/performance"
      }
    ]
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    sections: []
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Wallet,
    sections: []
  },
  {
    title: "Planning",
    href: "/planning",
    icon: Briefcase,
    sections: []
  },
  {
    title: "Professionals",
    href: "/professionals",
    icon: Users,
    sections: []
  },
  {
    title: "Project Integration",
    href: "/integration",
    icon: NetworkIcon,
    sections: [
      {
        title: "Connected Projects",
        href: "/integration/connected-projects"
      },
      {
        title: "Architecture",
        href: "/integration/architecture"
      },
      {
        title: "API Integrations",
        href: "/integration/api"
      },
      {
        title: "Plugins",
        href: "/integration/plugins"
      }
    ]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    sections: []
  }
];
