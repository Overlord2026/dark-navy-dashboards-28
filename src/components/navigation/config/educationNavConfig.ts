
import { 
  GraduationCapIcon,
  BookIcon,
  FileTextIcon,
  PieChart,
  BanknoteIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const educationNavItems: NavItem[] = [
  { 
    id: "education-center",
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    id: "tax-planning",
    title: "Tax Planning", 
    href: "/tax-planning", 
    icon: PieChart 
  },
  { 
    id: "lending",
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    id: "books",
    title: "Books", 
    href: "/books", 
    icon: BookIcon 
  },
  { 
    id: "guides",
    title: "Guides & Whitepapers", 
    href: "/guides", 
    icon: FileTextIcon 
  }
];
