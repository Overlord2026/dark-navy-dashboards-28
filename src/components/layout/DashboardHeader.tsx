import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
interface DashboardHeaderProps {
  title?: string;
}
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Dashboard"
}) => {
  const location = useLocation();
  const path = location.pathname;
  const isConnected = path === "/integration";
  return <header className="flex items-center justify-between w-full px-4 h-16 border-b border-[#333]">
      
      
      <div className="flex items-center space-x-2">
        {isConnected && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Connected
          </Badge>}
        <UserProfileDropdown />
      </div>
    </header>;
};