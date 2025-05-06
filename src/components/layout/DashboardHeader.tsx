import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
interface DashboardHeaderProps {
  title?: string;
}
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Dashboard"
}) => {
  return <header className="flex items-center justify-between w-full px-4 h-16 border-b border-[#333]">
      
      <div className="flex items-center space-x-2">
        <UserProfileDropdown />
      </div>
    </header>;
};