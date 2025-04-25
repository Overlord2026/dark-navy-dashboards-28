
import React from "react";
import { HomeIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";

export const homeNavItems: NavItem[] = [
  { 
    title: "Home", 
    href: "/", 
    icon: HomeIcon 
  }
];

const HomeTab = () => {
  return (
    <div className="home-tab">
      {/* Additional home tab specific UI can be added here */}
    </div>
  );
};

export default HomeTab;
