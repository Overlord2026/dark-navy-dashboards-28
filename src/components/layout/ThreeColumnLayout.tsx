
import React from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { BrandedHeader } from "./BrandedHeader";
import { cn } from "@/lib/utils";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  noSidebar?: boolean;
  noHeader?: boolean;
  className?: string;
  contentClassName?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
  noSidebar = false,
  noHeader = false,
  className,
  contentClassName,
}) => {
  const renderSidebar = () => {
    if (leftSidebar) {
      return leftSidebar;
    }

    if (noSidebar) {
      return null;
    }

    return <Sidebar />;
  };

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      <BrandedHeader />

      <div className="flex flex-1 overflow-hidden pt-16">
        {renderSidebar()}

        <div className={cn("flex flex-col flex-1 h-full overflow-y-auto", contentClassName)}>
          {!noHeader && <DashboardHeader />}
          {children}
        </div>

        {rightSidebar && (
          <div className="w-80 border-l border-border bg-background overflow-y-auto hidden lg:block">
            {rightSidebar}
          </div>
        )}
      </div>
    </div>
  );
};
