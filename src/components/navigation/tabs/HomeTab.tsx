
import React from "react";
import { HomeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { BoutiqueFamilyOfficeDashboard } from "@/components/dashboard/BoutiqueFamilyOfficeDashboard";

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
      <BoutiqueFamilyOfficeDashboard />
    </div>
  );
};

export default HomeTab;
