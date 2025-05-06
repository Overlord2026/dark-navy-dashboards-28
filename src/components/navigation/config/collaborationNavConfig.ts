
import { 
  Users2Icon, 
  ShareIcon,
  Network
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const collaborationNavItems: NavItem[] = [
  { 
    id: "professionals",
    title: "Service Professionals", 
    href: "/professionals", 
    icon: Users2Icon 
  },
  { 
    id: "family-access",
    title: "Family Member Access", 
    href: "/sharing", 
    icon: ShareIcon 
  },
  {
    id: "project-integration",
    title: "Project Integration",
    href: "/integration",
    icon: Network
  }
];
