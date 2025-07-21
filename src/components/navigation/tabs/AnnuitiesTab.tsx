import { Book, Calculator, Search, Upload, Users, Award, Video, MessageCircle } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const annuitiesNavItems: NavItem[] = [
  {
    title: "Annuities Overview",
    href: "/annuities",
    icon: Award
  },
  {
    title: "Education Center",
    href: "/annuities/learn",
    icon: Book
  },
  {
    title: "Product Comparison",
    href: "/annuities/compare",
    icon: Search
  },
  {
    title: "Contract Analyzer",
    href: "/annuities/analyze",
    icon: Upload
  },
  {
    title: "Calculators",
    href: "/annuities/calculators",
    icon: Calculator
  },
  {
    title: "Marketplace",
    href: "/annuities/marketplace",
    icon: Award
  },
  {
    title: "Fiduciary Review",
    href: "/annuities/review",
    icon: Users
  },
  {
    title: "Video Library",
    href: "/annuities/videos",
    icon: Video
  },
  {
    title: "AI Assistant",
    href: "/annuities/chat",
    icon: MessageCircle
  }
];