
import React from "react";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Dashboard" }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <UserProfileDropdown />
      </div>
    </header>
  );
}
