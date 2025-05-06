
import { 
  Users2Icon, 
  ShareIcon,
  Network
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Service Professionals", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    title: "Family Member Access", 
    href: "/sharing", 
    icon: ShareIcon 
  },
  {
    title: "Project Integration",
    href: "/integration",
    icon: Network
  }
];
