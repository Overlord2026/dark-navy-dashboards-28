
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Badge } from "@/components/ui/badge";
import GoldTreeLogo from "@/assets/logo-gold-tree.svg";

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title = "Dashboard" }) => {
  return (
    <header className="flex items-center justify-between w-full px-4 h-16 bg-black border-b border-[#333]">
      <div className="flex items-center">
        <img
          src={GoldTreeLogo}
          alt="Boutique Family Office Logo"
          className="h-14 w-auto mr-2"
        />
        <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500/50 hidden sm:flex">
          Connected
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <UserProfileDropdown />
      </div>
    </header>
  );
};
