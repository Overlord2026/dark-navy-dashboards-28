
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { Network, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const handleOpenForm = (formId: string) => {
    console.log(`Form ${formId} would open here if implemented`);
  };

  return (
    <header className="h-24 border-b border-border bg-card fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-center h-full px-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/7917640e-0a5d-4111-8e2e-d3faf741374b.png" 
            alt="Boutique Family Office" 
            className="h-20 w-auto"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/integration" className="flex items-center rounded-md bg-primary/10 px-2 py-1.5 text-primary">
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
        {title && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        )}
        <div className="absolute right-6">
          <UserProfileDropdown onOpenForm={handleOpenForm} />
        </div>
      </div>
    </header>
  );
}
