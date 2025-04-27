
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  // Define a default empty function for onOpenForm
  const handleOpenForm = (formId: string) => {
    console.log(`Form ${formId} would open here if implemented`);
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <UserProfileDropdown onOpenForm={handleOpenForm} />
      </div>
    </header>
  );
}
