
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Network } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-24 border-b border-border bg-[#0A1F44] fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex items-center h-full px-6 max-w-screen-2xl mx-auto">
        {/* Left section with 1/3 width */}
        <div className="flex-1"></div>

        {/* Center section with logo */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/lovable-uploads/1e5f557d-a959-44b7-894a-5a58b8feecba.png" 
            alt="Boutique Family Office" 
            className="h-10 w-auto"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/integration" className="flex items-center rounded-md bg-yellow-400 px-2 py-1.5 text-white font-semibold ml-2">
                  <Network className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Connected</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Part of Family Office Architecture</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right section with profile dropdown */}
        <div className="flex-1 flex items-center justify-end">
          <UserProfileDropdown onOpenForm={(id) => console.log(`Form ${id} would open here if implemented`)} />
        </div>
      </div>
    </header>
  );
}
