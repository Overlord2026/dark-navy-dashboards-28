
import { 
  GraduationCapIcon,
  BarChart3Icon,
  PieChart,
  ShieldIcon,
  BanknoteIcon,
  ArchiveIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const educationSolutionsNavItems: NavItem[] = [
  { 
    title: "Education Center", 
    href: "/education", 
    icon: GraduationCapIcon 
  },
  { 
    title: "Investments", 
    href: "/investments", 
    icon: BarChart3Icon 
  },
  { 
    title: "Tax Planning", 
    href: "/education/tax-planning", 
    icon: PieChart 
  },
  { 
    title: "Insurance", 
    href: "/insurance", 
    icon: ShieldIcon 
  },
  { 
    title: "Lending", 
    href: "/lending", 
    icon: BanknoteIcon 
  },
  { 
    title: "Estate Planning", 
    href: "/estate-planning", 
    icon: ArchiveIcon 
  }
];
