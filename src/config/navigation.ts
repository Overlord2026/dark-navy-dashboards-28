
import {
  HomeIcon,
  FileTextIcon, 
  BookIcon,
  WalletIcon,
  BriefcaseIcon,
  UsersIcon,
  SettingsIcon,
  BanknoteIcon
} from "lucide-react";
import { NavCategory } from "@/types/navigation";

export const navigationCategories: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    defaultExpanded: true,
    items: [
      { title: "Dashboard", href: "/", icon: HomeIcon },
      { title: "Documents", href: "/documents", icon: FileTextIcon }
    ]
  },
  {
    id: "wealth",
    label: "Wealth Management",
    defaultExpanded: true,
    items: [
      { title: "Assets", href: "/all-assets", icon: BriefcaseIcon },
      { title: "Accounts", href: "/accounts", icon: WalletIcon },
      { title: "Cash Management", href: "/cash-management", icon: BanknoteIcon }
    ]
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: [
      { title: "Professionals", href: "/professionals", icon: UsersIcon },
      { title: "Education", href: "/education", icon: BookIcon }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { title: "Settings", href: "/settings", icon: SettingsIcon }
    ]
  }
];
