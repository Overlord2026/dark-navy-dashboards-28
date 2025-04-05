
import { Home, FileText, BarChart, Users, Settings, Shield, Briefcase } from "lucide-react";
import { NavCategory, MainMenuItem, NavItem } from "@/types/navigation";

// Helper function to convert NavItem array to MainMenuItem array
const convertToMainMenuItems = (items: NavItem[]): MainMenuItem[] => {
  return items.map(item => ({
    id: item.href.replace(/\//g, '-').substring(1) || 'home', // Generate ID from href
    title: item.title,
    label: item.title, // Copy title to label for compatibility
    description: item.description,
    icon: item.icon,
    href: item.href,
  }));
};

// Then update your categories
export const navigationCategories: NavCategory[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    defaultExpanded: true,
    items: convertToMainMenuItems([
      { title: "Overview", href: "/", icon: Home },
      { title: "Documents", href: "/documents", icon: FileText, description: "Access your important documents" },
      { title: "Investments", href: "/investments", icon: BarChart },
    ]),
  },
  {
    id: "documents",
    label: "Documents",
    items: convertToMainMenuItems([
      { title: "All Documents", href: "/documents", icon: FileText },
      { title: "Estate Planning", href: "/estate-planning", icon: Shield },
    ]),
  },
  {
    id: "finance",
    label: "Finance",
    items: convertToMainMenuItems([
      { title: "Accounts", href: "/accounts", icon: Home },
      { title: "Transfers", href: "/transfers", icon: FileText },
      { title: "Insurance", href: "/insurance", icon: BarChart },
    ]),
  },
  {
    id: "settings",
    label: "Settings",
    items: convertToMainMenuItems([
      { title: "Profile", href: "/profile", icon: Users },
      { title: "Preferences", href: "/preferences", icon: Settings },
    ]),
  },
];
