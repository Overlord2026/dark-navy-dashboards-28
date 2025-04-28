
import { HomeIcon, BookIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

const CustomHomeIcon: React.FC = () => (
  <img 
    src="/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png" 
    alt="Home"
    className="h-5 w-5"
  />
);

export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: CustomHomeIcon 
  },
  { 
    title: "Documents", 
    href: "/documents", 
    icon: BookIcon 
  }
];
