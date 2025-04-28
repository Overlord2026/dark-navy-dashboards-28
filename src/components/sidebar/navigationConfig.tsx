
import { 
  Book, 
  BriefcaseIcon, 
  FileText, 
  TrendingUp, 
  Shield, 
  Banknote,
  MessageSquare,
  VaultIcon,
  HomeIcon,
  Grid
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavSection {
  id: string;
  label: string;
  icon?: React.ElementType;
  items?: NavItem[];
  href?: string;
}

export const navSections: NavSection[] = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: BriefcaseIcon,
    items: [
      { label: "Landing", href: "/landing", icon: HomeIcon },
      { label: "Dashboard", href: "/dashboard?segment=preretirees", icon: Grid },
      { label: "Aspiring Wealthy", href: "/dashboard?segment=aspiring", icon: TrendingUp },
      { label: "Pre-Retirees & Retirees", href: "/dashboard?segment=preretirees", icon: Shield },
      { label: "Ultra-HNW", href: "/dashboard?segment=ultrahnw", icon: Banknote },
      { label: "Advisor", href: "/dashboard?segment=advisor", icon: BriefcaseIcon },
    ],
  },
  {
    id: "education",
    label: "Education & Solutions",
    icon: Book,
    items: [
      { label: "Education Center", href: "/education", icon: Book },
      { label: "Courses", href: "/courses", icon: Book },
      { label: "Guides & Whitepapers", href: "/guides", icon: FileText },
      { label: "Books", href: "/books", icon: Book },
      { label: "Planning Examples", href: "/examples", icon: FileText },
      { label: "Presentations", href: "/presentations", icon: FileText },
    ],
  },
  {
    id: "wealth",
    label: "Wealth Management",
    icon: BriefcaseIcon,
    items: [
      { label: "Secure Family Vault", href: "/legacy-vault", icon: VaultIcon },
      { label: "Accounts", href: "/accounts", icon: FileText },
      { label: "Financial Plans", href: "/financial-plans", icon: FileText },
      { label: "Investments", href: "/accounts", icon: TrendingUp },
      { label: "Properties", href: "/properties", icon: FileText },
      { label: "Tax & Budgets", href: "/tax-budgets", icon: FileText },
    ],
  },
  {
    id: "planning",
    label: "Planning & Services",
    icon: FileText,
    items: [
      { label: "Financial Planning", href: "/financial-plans", icon: FileText },
      { label: "Investments", href: "/accounts", icon: TrendingUp },
      { label: "Tax Planning", href: "/tax-planning", icon: FileText },
      { label: "Estate Planning", href: "/estate-planning", icon: FileText },
      { label: "Insurance", href: "/insurance", icon: Shield },
      { label: "Lending", href: "/lending", icon: Banknote },
    ],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: MessageSquare,
    href: "/integration",
  },
];
