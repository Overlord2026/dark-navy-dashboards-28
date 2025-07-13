import { 
  ActivityIcon,
  WalletIcon,
  CircleDollarSignIcon,
  HeartHandshakeIcon,
  PillIcon,
  FlaskConicalIcon,
  TrendingUpIcon,
  FolderHeartIcon,
  BookHeartIcon,
  ShareIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const healthcareOptimizationNavItems: NavItem[] = [
  { 
    title: "Health Dashboard", 
    href: "/healthcare-dashboard", 
    icon: ActivityIcon 
  },
  { 
    title: "HSA Accounts", 
    href: "/healthcare-hsa-accounts", 
    icon: WalletIcon 
  },
  { 
    title: "Healthcare Savings", 
    href: "/healthcare-savings", 
    icon: CircleDollarSignIcon 
  },
  { 
    title: "Healthcare Providers", 
    href: "/healthcare-providers", 
    icon: HeartHandshakeIcon 
  },
  { 
    title: "Medications", 
    href: "/healthcare-medications", 
    icon: PillIcon 
  },
  { 
    title: "Supplements", 
    href: "/healthcare-supplements", 
    icon: FlaskConicalIcon 
  },
  { 
    title: "HealthSpan Expansion", 
    href: "/healthcare-healthspan", 
    icon: TrendingUpIcon 
  },
  { 
    title: "Healthcare Documents", 
    href: "/healthcare-documents", 
    icon: FolderHeartIcon 
  },
  { 
    title: "Knowledge & Support", 
    href: "/healthcare-knowledge", 
    icon: BookHeartIcon 
  },
  { 
    title: "Share Data", 
    href: "/healthcare-share-data", 
    icon: ShareIcon 
  }
];

export default healthcareOptimizationNavItems;