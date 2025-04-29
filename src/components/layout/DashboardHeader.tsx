
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title = "Dashboard" }) => {
  return (
    <header className="flex items-center justify-between w-full px-4 h-16 border-b border-[#333]">
      <div className="flex items-center">
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
