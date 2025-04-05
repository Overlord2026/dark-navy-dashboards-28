
import React, { ReactNode } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface ThreeColumnLayoutProps {
  children: ReactNode;
  activeMainItem?: string;
  title: string;
  activeSecondaryItem?: string;
  secondaryMenuItems?: any[];
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  children,
  activeMainItem,
  title,
  activeSecondaryItem,
  secondaryMenuItems
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <NavBar />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children}
      </main>
      <RightSidebar />
    </div>
  );
};
