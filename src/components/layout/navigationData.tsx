
import {
  HomeIcon,
  CreditCardIcon,
  PieChart,
  DollarSignIcon,
  BanknoteIcon,
  ArrowLeftRightIcon,
  CarIcon,
  PaletteIcon,
  Building2Icon,
  GraduationCapIcon,
  BarChart3Icon,
  ShieldIcon,
  ArchiveIcon,
  ClipboardIcon,
  CalculatorIcon,
  VaultIcon,
  IdCardIcon,
  FileTextIcon,
  UsersIcon,
  UserPlusIcon,
  ShareIcon,
  LinkIcon,
  HelpCircleIcon,
  SettingsIcon,
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const navigationData: Record<string, NavItem[]> = {
  "Home": [
    { title: "Dashboard", href: "/client-dashboard", icon: HomeIcon },
  ],
  "Accounts": [
    { title: "Overview", href: "/accounts", icon: CreditCardIcon },
    { title: "All Assets", href: "/all-assets", icon: PieChart },
    { title: "Cash Management", href: "/cash-management", icon: DollarSignIcon },
    { title: "Funding Accounts", href: "/funding-accounts", icon: BanknoteIcon },
    { title: "Transfers", href: "/transfers", icon: ArrowLeftRightIcon },
    { title: "Vehicles & Collectibles", href: "/vehicles-collectibles", icon: CarIcon },
    { title: "Art & Valuables", href: "/art-valuables", icon: PaletteIcon },
    { title: "Properties", href: "/properties", icon: Building2Icon },
  ],
  "Education": [
    { title: "Education Center", href: "/client-education", icon: GraduationCapIcon },
    { title: "Investments", href: "/investments", icon: BarChart3Icon },
    { title: "Tax Planning", href: "/tax-planning", icon: PieChart },
    { title: "Client-Insurance", href: "/insurance", icon: ShieldIcon },
    { title: "Lending", href: "/lending", icon: BanknoteIcon },
    { title: "Estate Planning", href: "/estate-planning", icon: ArchiveIcon },
  ],
  "Family Wealth": [
    { title: "Financial Plans", href: "/financial-plans", icon: ClipboardIcon },
    { title: "Tax Budgets", href: "/tax-budgets", icon: CalculatorIcon },
    { title: "Legacy Vault", href: "/legacy-vault", icon: VaultIcon },
    { title: "Social Security", href: "/social-security", icon: IdCardIcon },
    { title: "BillPay", href: "/billpay", icon: CreditCardIcon },
  ],
  "Collaboration": [
    { title: "Documents", href: "/documents", icon: FileTextIcon },
    { title: "Professionals", href: "/professionals", icon: UsersIcon },
    { title: "Professional Signup", href: "/professional-signup", icon: UserPlusIcon },
    { title: "Sharing", href: "/sharing", icon: ShareIcon },
  ],
  "Integration": [
    { title: "Project Integration", href: "/project-integration", icon: LinkIcon },
  ],
  "Settings": [
    { title: "Help", href: "/help", icon: HelpCircleIcon },
    { title: "Settings", href: "/settings", icon: SettingsIcon },
  ],
};

export const getSecondaryMenuItems = (activeMainItem: string): { id: string; label?: string; name?: string; active?: boolean }[] => {
  // For most items, return empty array as they don't have secondary menus
  // This function can be expanded in the future for items that need secondary navigation
  switch (activeMainItem) {
    case "investments":
      return [
        { id: "overview", name: "Overview" },
        { id: "alternative", name: "Alternative" },
        { id: "model-portfolios", name: "Model Portfolios" },
        { id: "stock-screener", name: "Stock Screener" },
      ];
    case "sharing":
      return [
        { id: "documents", name: "Documents" },
        { id: "professionals", name: "Professionals" },
      ];
    default:
      return [];
  }
};
