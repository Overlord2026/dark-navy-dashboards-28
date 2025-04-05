
import {
  HeartHandshakeIcon,
  UserIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const bottomNavItems: NavItem[] = [
  { 
    title: "Help", 
    href: "/help", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Settings", 
    href: "/settings", 
    icon: UserIcon 
  }
];
