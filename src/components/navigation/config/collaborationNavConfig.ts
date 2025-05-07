
import { 
  Users2Icon, 
  ShareIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Professional Collaboration", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    title: "Family Collaboration", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];
