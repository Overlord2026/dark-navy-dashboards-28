
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-20 border-b border-border bg-[#0A1F44] fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center justify-between h-full px-6 max-w-screen-2xl mx-auto">
        {/* Center section with logo */}
        <div className="mx-auto">
          <div className="relative font-dwite">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office Logo" 
              className="h-16 w-auto"
            />
            {title === "Integration" && (
              <Badge className="bg-blue-600 text-white absolute -bottom-2 left-1/2 transform -translate-x-1/2">Connected</Badge>
            )}
          </div>
        </div>
        
        {/* UserProfileDropdown positioned absolutely */}
        <div className="absolute right-6">
          <UserProfileDropdown onOpenForm={(id) => console.log(`Form ${id} would open here if implemented`)} />
        </div>
      </div>
    </header>
  );
}
