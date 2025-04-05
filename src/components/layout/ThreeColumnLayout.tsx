
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

interface ThreeColumnLayoutProps {
  children: ReactNode;
  title?: string;
  activeMainItem?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ 
  children,
  title,
  activeMainItem
}) => {
  return (
    <div className="flex h-screen bg-[#0B1121] text-white">
      {/* Left column - Navigation */}
      <div className="h-screen overflow-y-auto border-r border-[#1E293B] w-64 fixed left-0 top-0">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col w-full ml-64">
        <GlobalHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
