
import {
  Home,
  CreditCard,
  BarChart,
  Users,
} from "lucide-react";
import { BottomNavItem } from "@/types/navigation";

export const bottomNavItems: BottomNavItem[] = [
  {
    id: "home",
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: CreditCard,
    href: "/accounts",
  },
  {
    id: "investments",
    title: "Investments",
    icon: BarChart,
    href: "/investments",
  },
  {
    id: "profile",
    title: "Profile",
    icon: Users,
    href: "/profile",
  }
];
