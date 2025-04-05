
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useSidebarState } from "@/hooks/useSidebarState";
import { navigationCategories } from "@/navigation/navCategories";
import { cn } from "@/lib/utils";

interface ThreeColumnLayoutProps {
  children: ReactNode;
  title?: string;
  rightSidebar?: ReactNode;
  hideRightSidebar?: boolean;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  children,
  title,
  rightSidebar,
  hideRightSidebar = false,
}) => {
  const { collapsed } = useSidebarState(navigationCategories);

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar is fixed positioned in NavBar component */}
      <Sidebar />
      
      {/* Main content area */}
      <main 
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 bg-background",
          collapsed ? "md:ml-[60px]" : "md:ml-[260px]"
        )}
      >
        {title && (
          <header className="h-16 px-4 border-b border-border sticky top-0 z-10 bg-background flex items-center">
            <h1 className="text-xl font-semibold">{title}</h1>
          </header>
        )}
        
        <div className="flex flex-1">
          <div className={cn("flex-1", !hideRightSidebar && "md:mr-[280px]")}>
            {children}
          </div>
          
          {!hideRightSidebar && rightSidebar && (
            <aside className="hidden md:block fixed top-0 right-0 w-[280px] border-l border-border h-screen overflow-y-auto pt-16">
              <div className="p-4">{rightSidebar}</div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};
