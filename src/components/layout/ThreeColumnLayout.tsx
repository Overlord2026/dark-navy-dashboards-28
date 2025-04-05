
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { cn } from "@/lib/utils";
import { useViewportOverride } from "@/hooks/useViewportOverride";

export interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  title: string;
  activeMainItem?: string;  // Make this prop optional
  activeSecondaryItem?: string;
  secondaryMenuItems?: any[];
}

export const ThreeColumnLayout = ({
  children,
  title,
  activeMainItem,
  activeSecondaryItem,
  secondaryMenuItems,
}: ThreeColumnLayoutProps) => {
  const { effectiveIsMobile } = useViewportOverride();
  const [pageTitle, setPageTitle] = useState(title);

  useEffect(() => {
    // Update document title when component mounts or title changes
    document.title = `${title} | Boutique Family Office`;
    setPageTitle(title);
  }, [title]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col",
        effectiveIsMobile ? "" : "ml-[60px] md:ml-[260px]"
      )}>
        <main className="flex-1">
          {/* Add a container for the content */}
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
