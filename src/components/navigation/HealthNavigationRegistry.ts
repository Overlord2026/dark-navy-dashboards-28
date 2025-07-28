import {
  Home,
  BookOpen,
  Library,
  ChartBar,
  DollarSign,
  Shield,
  Banknote,
  Building,
  Heart,
  Users,
  FileText,
  Settings,
  ArrowLeftRight,
  Wallet,
  Share,
  Activity,
  CreditCard,
  Calculator,
  TestTube,
  Microscope,
  Timer,
  TrendingUp,
  UserPlus,
  Pill,
  GraduationCap,
  MessageSquare,
  Target,
  Cog
} from "lucide-react";
import { NavCategory } from "@/types/navigation";

export const healthNavigationCategories: NavCategory[] = [
  {
    id: "home",
    title: "HOME",
    label: "HOME",
    items: [
      { 
        title: "Dashboard", 
        href: "/client-dashboard", 
        icon: Home 
      }
    ],
    defaultExpanded: true
  },
  {
    id: "learning-hub",
    title: "LEARNING HUB",
    label: "LEARNING HUB",
    items: [
      { 
        title: "Education Center", 
        href: "/education", 
        icon: BookOpen 
      },
      { 
        title: "Book & Course Library", 
        href: "/education/library", 
        icon: Library 
      }
    ],
    defaultExpanded: true
  },
  {
    id: "solutions-catalog",
    title: "SOLUTIONS CATALOG",
    label: "SOLUTIONS CATALOG",
    items: [
      { 
        title: "Investment Solutions", 
        href: "/solutions/investments", 
        icon: ChartBar 
      },
      { 
        title: "Tax Planning Solutions", 
        href: "/solutions/tax", 
        icon: DollarSign 
      },
      { 
        title: "Insurance Solutions", 
        href: "/solutions/insurance", 
        icon: Shield 
      },
      { 
        title: "Lending Solutions", 
        href: "/solutions/lending", 
        icon: Banknote 
      },
      { 
        title: "Estate Planning Solutions", 
        href: "/solutions/estate", 
        icon: Building 
      }
    ],
    defaultExpanded: false
  },
  {
    id: "client-tools",
    title: "CLIENT TOOLS",
    label: "CLIENT TOOLS",
    items: [
      {
        title: "WEALTH MANAGEMENT",
        icon: Wallet,
        collapsible: true,
        children: [
          { title: "Overview", href: "/wealth" },
          { title: "Portfolio", href: "/wealth/portfolio" },
          { title: "Cash Flow & Transfers", href: "/wealth/cash", icon: ArrowLeftRight },
          { title: "Documents & Vault", href: "/wealth/docs", icon: FileText }
        ]
      },
      {
        title: "HEALTH OPTIMIZATION",
        icon: Heart,
        collapsible: true,
        children: [
          { title: "Health Dashboard", href: "/health" },
          {
            title: "Accounts",
            href: "/health/accounts",
            children: [
              { title: "HSA Accounts", href: "/health/accounts/hsa" },
              { title: "HSA Savings Calculator", href: "/health/accounts/hsa/calculator" }
            ]
          },
          {
            title: "Healthspan Insights",
            href: "/health/insights",
            children: [
              { title: "Daily Metrics", href: "/health/insights/vitals" },
              { title: "Lab Biomarkers", href: "/health/insights/labs" },
              { title: "Biological Age & Epi", href: "/health/insights/epigenetics" },
              { title: "Preventive Screening", href: "/health/insights/screenings" },
              { title: "Trends & AI Coach", href: "/health/insights/trends" }
            ]
          },
          {
            title: "Care Team",
            href: "/health/care",
            children: [
              { title: "Providers", href: "/health/care/providers" },
              { title: "Share Data (CCDA)", href: "/health/care/share", icon: Share }
            ]
          },
          {
            title: "Pharmacy",
            href: "/health/pharmacy",
            children: [
              { title: "Medications", href: "/health/pharmacy/meds" },
              { title: "Supplements", href: "/health/pharmacy/supps" }
            ]
          },
          { title: "Docs & Directives", href: "/health/docs", icon: FileText },
          {
            title: "Knowledge Base",
            href: "/health/knowledge",
            children: [
              { title: "Coaching", href: "/health/knowledge/coaching" },
              { title: "Education", href: "/health/knowledge/education" },
              { title: "Recommendations", href: "/health/knowledge/recommendations" }
            ]
          },
          { title: "Settings", href: "/health/settings", icon: Cog }
        ]
      }
    ],
    defaultExpanded: true
  },
  {
    id: "collaboration",
    title: "COLLABORATION",
    label: "COLLABORATION",
    items: [
      { 
        title: "Family Members", 
        href: "/collab/family", 
        icon: Users 
      },
      { 
        title: "Trusted Contacts", 
        href: "/collab/contacts", 
        icon: Users 
      },
      { 
        title: "Share Center", 
        href: "/collab/share", 
        icon: Share 
      }
    ],
    defaultExpanded: false
  }
];