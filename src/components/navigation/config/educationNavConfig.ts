
import { 
  GraduationCapIcon,
  BookIcon,
  FileTextIcon,
  PieChart,
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const educationNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Tax Planning", 
    href: "/tax-planning", 
    icon: PieChart 
  },
  { 
    title: "Books", 
    href: "/books", 
    icon: BookIcon 
  },
  { 
    title: "Guides & Whitepapers", 
    href: "/guides", 
    icon: FileTextIcon 
  }
];
