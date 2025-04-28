
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-20 border-b border-border bg-gradient-to-r from-[#0A1F44] to-[#1B1B32] fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center h-full px-6 max-w-screen-2xl mx-auto">
        {/* Left section with 1/3 width */}
        <div className="flex-1"></div>

        {/* Center section with logo */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center">
            {/* Updated logo with more prominence */}
            <img 
              src="/lovable-uploads/44608b26-0af4-4b77-998a-0d2cde72da54.png" 
              alt="Boutique Family Office" 
              className="h-16 w-auto"
            />
          </div>
        </div>

        {/* Right section with profile dropdown */}
        <div className="flex-1 flex items-center justify-end">
          <UserProfileDropdown onOpenForm={(id) => console.log(`Form ${id} would open here if implemented`)} />
        </div>
      </div>
    </header>
  );
}
