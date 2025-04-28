
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-20 border-b border-border bg-gradient-to-r from-[#0A1F44] to-[#1B1B32] fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center h-full px-6 max-w-screen-2xl mx-auto">
        {/* Left section with keyword */}
        <div className="flex-1 flex justify-end">
          <span className="text-[#D4AF37] font-semibold text-xl">Organize</span>
        </div>

        {/* Center section with logo */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/5d3bcbf7-9c7e-4071-8db1-b7011ac1a630.png" 
                alt="Boutique Family Office Logo" 
                className="h-16 w-auto"
              />
            </div>
            {title === "Integration" && (
              <Badge className="bg-blue-600 text-white mt-1">Connected</Badge>
            )}
          </div>
        </div>

        {/* Right section with keyword and profile dropdown */}
        <div className="flex-1 flex items-center justify-between">
          <span className="text-[#D4AF37] font-semibold text-xl">Maximize</span>
          <UserProfileDropdown onOpenForm={(id) => console.log(`Form ${id} would open here if implemented`)} />
        </div>
      </div>
    </header>
  );
}
