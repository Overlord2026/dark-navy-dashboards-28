
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { navigationCategories } from "@/navigation/navCategories";
import { bottomNavItems } from "@/navigation/bottomNavigation";

export const ThreeColumnLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
