
import React from "react";
import { HomeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { ComprehensiveDashboard } from "@/components/dashboard/ComprehensiveDashboard";

export const homeNavItems: NavItem[] = [
  { 
    title: "Dashboard", 
    href: "/client-dashboard", 
    icon: HomeIcon 
  }
];

const HomeTab = () => {
  return (
    <div className="home-tab">
      <ComprehensiveDashboard />
    </div>
  );
};

export default HomeTab;
