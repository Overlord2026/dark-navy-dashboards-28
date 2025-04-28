
import { HomeIcon, BookIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    title: "Documents", 
    href: "/documents", 
    icon: BookIcon 
  }
];
