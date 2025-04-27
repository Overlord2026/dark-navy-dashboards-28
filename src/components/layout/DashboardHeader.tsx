
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Network, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const location = useLocation();
  const showTitle = location.pathname !== '/';
  const handleOpenForm = (formId: string) => {
    console.log(`Form ${formId} would open here if implemented`);
  };

  return (
    <header className="h-24 border-b border-border bg-card fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center h-full px-6 max-w-screen-2xl mx-auto">
        {/* Left section with 1/3 width */}
        <div className="flex-1"></div>

        {/* Center section with logo */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/lovable-uploads/7917640e-0a5d-4111-8e2e-d3faf741374b.png" 
            alt="Boutique Family Office" 
            className="h-20 w-auto"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/integration" className="flex items-center rounded-md bg-primary/10 px-2 py-1.5 text-primary ml-2">
                  <Network className="h-4 w-4 mr-1.5" />
                  <span className="text-xs font-medium">Connected</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Part of Family Office Architecture</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right section with title (if showing) and profile dropdown */}
        <div className="flex-1 flex items-center justify-end">
          {showTitle && title && (
            <h1 className="text-xl font-semibold mr-4">{title}</h1>
          )}
          <UserProfileDropdown onOpenForm={handleOpenForm} />
        </div>
      </div>
    </header>
  );
}
