
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
        {/* Left section with keyword */}
        <div className="flex-1 flex justify-end mr-12">
          <span className="text-[#D4AF37] font-semibold text-3xl">Organize</span>
        </div>

        {/* Center section with logo */}
        <div className="mx-4">
          <div className="relative">
            <img 
              src="/lovable-uploads/5d3bcbf7-9c7e-4071-8db1-b7011ac1a630.png" 
              alt="Boutique Family Office Logo" 
              className="h-16 w-auto"
            />
            {title === "Integration" && (
              <Badge className="bg-blue-600 text-white absolute -bottom-2 left-1/2 transform -translate-x-1/2">Connected</Badge>
            )}
          </div>
        </div>

        {/* Right section with keyword */}
        <div className="flex-1 flex justify-start ml-16">
          <span className="text-[#D4AF37] font-semibold text-3xl">Maximize</span>
        </div>
        
        {/* UserProfileDropdown positioned absolutely */}
        <div className="absolute right-6">
          <UserProfileDropdown onOpenForm={(id) => console.log(`Form ${id} would open here if implemented`)} />
        </div>
      </div>
    </header>
  );
}
