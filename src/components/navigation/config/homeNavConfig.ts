
import { HomeIcon, BookIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const homeNavItems: NavItem[] = [
  { 
    id: "home",
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  },
  { 
    id: "documents",
    title: "Documents", 
    href: "/documents", 
    icon: BookIcon 
  }
];
