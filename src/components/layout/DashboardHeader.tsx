
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  const handleOpenForm = (formId: string) => {
    console.log(`Form ${formId} would open here if implemented`);
  };

  return (
    <header className="h-24 border-b border-border bg-card fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-6 max-w-screen-2xl mx-auto">
        <div className="flex-1 flex items-center gap-4">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office" 
            className="h-16 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <UserProfileDropdown onOpenForm={handleOpenForm} />
        </div>
      </div>
    </header>
  );
}
